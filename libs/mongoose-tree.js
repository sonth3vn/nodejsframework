var streamWorker = require('stream-worker');

module.exports = exports = tree;

function tree(schema, options) {

    var pathSeparator = options && options.pathSeparator || '#'
        , wrapChildrenTree = options && options.wrapChildrenTree
        , onDelete = options && options.onDelete || 'DELETE' //'REPARENT'
        , numWorkers = options && options.numWorkers || 5
        , idType = options && options.idType || mongoose.Schema.ObjectId
        , pathSeparatorRegex = '[' + pathSeparator + ']';

    schema.add({
        parent: {
            type: idType,
            set: function (val) {
                return (val instanceof Object && val._id) ? val._id : val;
            },
            index: true
        },
        path: {
            type: String,
            index: true
        }
    });

    schema.pre('save', function preSave(next) {
        var isParentChange = this.isModified('parent');

        if (this.isNew || isParentChange) {
            if (!this.parent) {
                this.path = this._id.toString();
                return next();
            }

            var self = this;
            this.collection.findOne({_id: this.parent}, function (err, doc) {

                if (err) {
                    return next(err);
                }

                var previousPath = self.path;
                self.path = doc.path + pathSeparator + self._id.toString();

                if (isParentChange) {
                    self.collection.find({path: {'$regex': '^' + previousPath + pathSeparatorRegex}}, function (err, cursor) {

                        if (err) {
                            return next(err);
                        }

                        streamWorker(cursor.stream(), numWorkers, function streamOnData(doc, done) {

                                var newPath = self.path + doc.path.substr(previousPath.length);
                                self.collection.update({_id: doc._id}, {$set: {path: newPath}}, done);
                            },
                            next);
                    });
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }
    });
    schema.pre('remove', function preRemove(next) {

        if (!this.path)
            return next();

        if (onDelete == 'DELETE') {
            this.collection.remove({path: {'$regex': '^' + this.path + pathSeparatorRegex}}, next);
        }
        else {
            var self = this,
                newParent = this.parent,
                previousParent = this._id;
            this.collection.find({parent: previousParent}, function (err, cursor) {

                if (err) {
                    return next(err);
                }

                streamWorker(cursor.stream(), numWorkers, function streamOnData(doc, done) {

                        self.collection.update({_id: doc._id}, {$set: {parent: newParent}}, done);
                    },
                    function streamOnClose(err) {

                        if (err) {
                            return next(err);
                        }

                        self.collection.find({path: {$regex: previousParent + pathSeparatorRegex}}, function (err, cursor) {

                            var subStream = cursor.stream();
                            streamWorker(subStream, numWorkers, function subStreamOnData(doc, done) {

                                    var newPath = doc.path.replace(previousParent + pathSeparator, '');
                                    self.collection.update({_id: doc._id}, {$set: {path: newPath}}, done);
                                },
                                next);
                        });
                    });
            });
        }
    });
    schema.methods.getChildren = function getChildren(filters, fields, options, recursive, next) {

        // normalize the arguments
        if ('function' === typeof filters) {
            next = filters;
            filters = {};
        }
        else if ('function' === typeof fields) {
            next = fields;
            fields = null;

            if ('boolean' === typeof filters) {
                recursive = filters;
                filters = {}
            }
        }
        else if ('function' === typeof options) {
            next = options;
            options = {};

            if ('boolean' === typeof fields) {
                recursive = fields;
                fields = null;
            }
        }
        else if ('function' === typeof recursive) {
            next = recursive;

            if ('boolean' === typeof options) {
                recursive = options;
                options = {}
            }
            else {
                recursive = false
            }
        }

        filters = filters || {};
        fields = fields || null;
        options = options || {};
        recursive = recursive || false;

        if (recursive) {
            if (filters['$query']) {
                filters['$query']['path'] = {$regex: '^' + this.path + pathSeparatorRegex};
            } else {
                filters['path'] = {$regex: '^' + this.path + pathSeparatorRegex};
            }
        } else {
            if (filters['$query']) {
                filters['$query']['parent'] = this._id;
            } else {
                filters['parent'] = this._id;
            }
        }

        return this.model(this.constructor.modelName).find(filters, fields, options, next);
    };

    schema.methods.getParent = function getParent(next) {

        return this.model(this.constructor.modelName).findOne({_id: this.parent}, next);
    };

    schema.methods.getAncestors = function getAncestors(filters, fields, options, next) {

        if ('function' === typeof filters) {
            next = filters;
            filters = {};
        }
        else if ('function' === typeof fields) {
            next = fields;
            fields = null;
        }
        else if ('function' === typeof options) {
            next = options;
            options = {};
        }

        filters = filters || {};
        fields = fields || null;
        options = options || {};

        var ids = [];

        if (this.path) {
            ids = this.path.split(pathSeparator);
            ids.pop();
        }

        if (filters['$query']) {
            filters['$query']['_id'] = {$in: ids};
        } else {
            filters['_id'] = {$in: ids};
        }

        return this.model(this.constructor.modelName).find(filters, fields, options, next);
    };

    schema.statics.getChildrenTree = function getChildrenTree(root, args, next) {

        if ("function" === typeof(root)) {
            next = root;
            root = null;
            args = {};
        }
        else if ("function" === typeof(args)) {
            next = args;

            if ("model" in root) {
                args = {};
            }
            else {
                args = root;
                root = null
            }
        }

        var filters = args.filters || {};
        var fields = args.fields || null;
        var options = args.options || {};
        var minLevel = args.minLevel || 1;
        var recursive = args.recursive != undefined ? args.recursive : true;
        var allowEmptyChildren = args.allowEmptyChildren != undefined ? args.allowEmptyChildren : true;

        if (!next)
            throw new Error('no callback defined when calling getChildrenTree');

        if (recursive) {
            if (root) {
                filters.path = {$regex: '^' + root.path + pathSeparatorRegex};
            }

            if (filters.parent === null) {
                delete filters.parent;
            }

        } else {
            if (root) {
                filters.parent = root._id;
            }
            else {
                filters.parent = null
            }
        }

        if (fields) {
            if (fields instanceof Object) {
                if (!fields.hasOwnProperty('path')) {
                    fields['path'] = 1;
                }
                if (!fields.hasOwnProperty('parent')) {
                    fields['parent'] = 1;
                }
            }
            else {
                if (!fields.match(/path/)) {
                    fields += ' path';
                }
                if (!fields.match(/parent/)) {
                    fields += ' parent';
                }
            }
        }

        if (!options.sort) {
            options.sort = {};
        }
        options.sort.path = 1;

        if (options.lean == null) {
            options.lean = !wrapChildrenTree;
        }

        return this.find(filters, fields, options, function (err, results) {

            if (err) {
                return next(err);
            }

            var getLevel = function (path) {

                return path ? path.split(pathSeparator).length : 0;
            };

            var createChildren = function createChildren(arr, node, level) {

                if (level == minLevel) {
                    if (allowEmptyChildren) {
                        node.children = [];
                    }
                    return arr.push(node);
                }

                var nextIndex = arr.length - 1;
                var myNode = arr[nextIndex];

                if (!myNode) {
                    //console.log("Tree node " + node.name + " filtered out. Level: " + level + " minLevel: " + minLevel);
                    return []
                } else {
                    createChildren(myNode.children, node, level - 1);
                }
            };

            var finalResults = [];
            var rootLevel = 1;

            if (root) {
                rootLevel = getLevel(root.path) + 1;
            }

            if (minLevel < rootLevel) {
                minLevel = rootLevel
            }

            for (var r in results) {
                var level = getLevel(results[r].path);
                createChildren(finalResults, results[r], level);
            }

            next(err, finalResults);

        });
    };


    schema.methods.getChildrenTree = function (args, next) {

        this.constructor.getChildrenTree(this, args, next)
    };

    schema.virtual('level').get(function virtualPropLevel() {

        return this.path ? this.path.split(pathSeparator).length : 0;
    });
}