_.mixin(_.extend(require('underscore.string').exports(), require(path.join(_rootPath, 'libs', 'common'))));
_moment.locale("vi");

fsx.readdirSync(path.join(_rootPath, 'modals')).forEach(function (file) {
    if (path.extname(file) !== '.js') return;
    global['_' + _.classify(_.replaceAll(file.toLowerCase(), '.js', ''))] = require(path.join(_rootPath, 'modals', file));
    console.info('Modal : '.yellow + '_' + _.classify(_.replaceAll(file.toLowerCase(), '.js', '')));
});

global.hostname = 'http://' + _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) {
        return (val.family == 'IPv4' && val.internal == false)
    }).pluck('address').first().value();

global._Excel = require('exceljs');
global._rootMenu = {};
module.exports = function routers(app) {
    app.locals._moment = _moment;
    app.locals._switch = _.switch;
    app.locals._equal = _.isEqual;
    app.locals._where = _.findWhere;
    app.locals._htmlVerticalMenu = _.htmlVerticalMenu;
    app.locals._Tags = _.htmlTags;
    app.locals._hostname = hostname;
    app.locals._parseMenu = _.htmlMenu;
    fsx.readdirSync(path.join(_rootPath, 'controllers')).forEach(function (file) {
        if (path.extname(file) !== '.js') return;
        app.resource(_.trim(_.dasherize(_.replaceAll(file.toLowerCase(), '.js', ''))).toString(), require(path.join(_rootPath, 'controllers', file.toString())));
    });

    app.get('/', function (req, res) {
        _.render(req, res, 'home', {page: 'home', plugins: [['ckeditor'], ['mrblack-table']]}, true);
    });

    app.get('/logout', function (req, res) {
        _.omit(req.session, 'logged', 'user');
        delete req.session.user;
        req.session.logged = false;
        delete req.decoded;
        res.cookie("x-access-token", "");
        res.redirect('/');
    });

    app.post('/login', function (req, res){
        var _body = _.pick(req.body, 'username', 'password');
        _User.findOne({username: _body['username']}, function(err, user){
            if (err){
                return res.json({code: 500});
            }

            if (!user){
                return res.json({code: 404});
            }

            _.compareWithHashData(_body["password"], user['password'], function(err, pass){
                if (err){
                    return res.json({code: 500});
                }
                if (!pass){
                    return res.json({code: 404});
                }

                getChildsMenu(user.role, {}, _rootMenu, function (err, arr, ma) {
                    req.session['menuRouter'] = arr;
                    req.session['menuAccess'] = ma;
                    req.session.user = _.pick(user, '_id', 'username', 'email', 'avatar');
                    req.session.logged = true;
                    res.status(200).send({code: 200});
                });

            });

        });

    });

    _User.findOne({username: 'admin'}, function (error, user) {
        if (!_.isNull(user)) return false;
        _User.create({
            _id: new mongodb.ObjectId('5795d235f2b7b8c418a4d56b'),
            username: 'admin',
            email: 'admin@dft.vn',
            password: '123456',
            accountCode: '000000',
            status: 1
        });
    });

    app.post('/uploads', function (req, res) {
        var id = req.decoded._id || req.session.user._id;
        var user = {};
        var code = {
            "200":"Thành công",
            "15": "Định dạng ảnh không đúng",
            "16": "Kích thước ảnh phải nhỏ hơn 400x400",
            "17": "Id tài khoản phụ không chính xác",
            "23": "Tệp tải lên vượt quá dung lượng còn lại",
            "500": "Lỗi bất thường do server"
        };
        var time = new Date().getTime();
        _async.waterfall([function(cb){
            if(req.body.subAccount){
                _User.findOne({_id:_.convertObjectId(id),subAccount:_.convertObjectId(req.body.subAccount)}, function(err,r){
                    if(err) return cb(err);
                    if(!r){
                        if (req.files && req.files.length > 0) {
                            _.each(req.files, function (o) {
                                fse.removeSync(o.path);
                            })
                        }
                        return res.json({code: 17, msg:code['17']});
                    }
                    _SubAccount.findById(req.body.subAccount, function(err,r){
                        if(err) return cb(err)
                        if(!r){
                            if (req.files && req.files.length > 0) {
                                _.each(req.files, function (o) {
                                    fse.removeSync(o.path);
                                })
                            }
                            return res.json({code: 17, msg:code['17']});
                        }
                        id = r._id.toString();
                        user = r.toObject();
                        cb();
                    })
                });
            }else{
                _User.findById(id).lean(true).exec(function(err,r){
                    user = r;
                    cb();
                });
            }
        }],function(err){
            if(err) {
                if (req.files && req.files.length > 0) {
                    _.each(req.files, function (o) {
                        fse.removeSync(o.path);
                    })
                }
                return res.json({code: 500, msg: err.message});
            }
            if (req.files && req.files.length > 0) {
                _.each(req.files, function (o) {
                    checkUploadSize(id,o.size,user.maxData,function(err,statement){
                        if (err) {
                            return res.json({code:500,msg:code['500'],data:err.message});
                        }
                        if(statement){
                            var ex = o.originalname.split(".");
                            if (o.fieldname == 'avatar') {
                                if (!_.contains(["png", "jpg"], ex[ex.length - 1].toLowerCase())) {
                                    fsx.remove(o.path, function (err) {
                                        if (err) return res.json({code:500,msg:code['500'],data:err.message});
                                        return res.json({code: 15, msg:code['15']})
                                    })
                                } else {
                                    jimp.read(o.path, function (err, image) {
                                        if (image.bitmap.width > 400 || image.bitmap.height > 400) {
                                            //fsx.remove(o.path, function (err) {
                                            //    if (err) return res.json({code:500,msg:code['500'],data:err.message});
                                            //    return res.json({code: 16, msg:code['16']})
                                            //})
                                            image.scaleToFit(400,400).write(path.join(_rootPath, 'assets', 'upload', id, time + "." + ex[ex.length - 1]), function(err, image){
                                                if (err) return res.json({code:500,msg:code['500'],data:err.message});
                                                fse.removeSync(o.path);
                                                return res.json({code:200,msg:code['200'],data:path.sep + path.join('assets', 'upload', id, time + "." + ex[ex.length - 1])})
                                            })
                                        } else {
                                            fsx.mkdirRecursive(path.join(_rootPath, 'assets', 'upload', id), function (err) {
                                                if (err) return res.json({code:500,msg:code['500'],data:err.message});
                                                var time = _moment().valueOf();
                                                fse.move(o.path, path.join(_rootPath, 'assets', 'upload', id, time + "." + ex[ex.length - 1]), {clobber: true}, function (err) {
                                                    if (err) {
                                                        return res.json({code:500,msg:code['500'],data:err.message});
                                                    }
                                                    else {
                                                        return res.json({code:200,msg:code['200'],data:path.sep + path.join('assets', 'upload', id, time + "." + ex[ex.length - 1])})
                                                    }
                                                })
                                            })
                                        }
                                    })
                                }
                            } else {
                                fsx.mkdirRecursive(path.join(_rootPath, 'assets', 'upload', id), function (err) {
                                    if (err) return res.json({code:500,msg:code['500'],data:err.message});
                                    var time = _moment().valueOf();
                                    fse.move(o.path, path.join(_rootPath, 'assets', 'upload', id, time + "." + ex[ex.length - 1]), {clobber: true}, function (err) {
                                        if (err) {
                                            return res.json({code:500,msg:code['500'],data:err.message});
                                        }
                                        else {
                                            return res.json({code:200,msg:code['200'],data:path.sep + path.join('assets', 'upload', id, time + "." + ex[ex.length - 1])})
                                        }
                                    })
                                })
                            }
                        }else{
                            fsx.remove(o.path, function (err) {
                                if (err)  return res.json({code:500,msg:code['500'],data:err.message});
                                return res.json({code: 23, msg:code['23']})
                            })
                        }
                    });
                })
            } else {
                return res.json({code: 500, msg: "Không có dữ liệu"})
            }
        });
    });

    _Router.findById({_id: _.convertObjectId("56ccef10107427552ed55ce7")}, function (err, result) {
        if (err) return log.error(err);
        if (_.isNull(result) || result.length == 0) {
            var parseJSONToObject = require(path.join(_rootPath, 'libs', 'parseJSONToObject.js'));
            var menu = parseJSONToObject(require(path.join(_rootPath, 'config', 'menus.json')), 'path');

            mongodb.MongoClient.connect(_dbPath, function (err, db) {
                if (err) return log.error(err);
                var batch = db.collection('routers').initializeUnorderedBulkOp({useLegacyOps: true});
                _.each(menu, function (item, index) {
                    batch.insert(item);
                });

                if (batch.s.currentIndex == 0) return db.close();
                batch.execute(function (error, result) {
                    if (error) log.error(error);
                    db.close();
                    _Router.findById({_id: _.convertObjectId("56ccef10107427552ed55ce7")}, function (err, r) {
                        if (err) return log.error(err);
                        _rootMenu = r;
                    });
                });
            });
        } else {
            _rootMenu = result;
        }
    });

};

function getChildsMenu(cr, ma, usr, callback) {
    var childarr = [];
    usr.getChildren(function (err, child) {
        var childCount = child.length;
        if (childCount <= 0) callback(err, [], []);
        child.forEach(function (child) {
            getChildsMenu(cr, ma, child, function (err, arr) {
                childCount -= 1;
                var obj = {};
                obj._id = child._id;
                obj.name = child.name;
                obj.status = child.status;
                obj.icon = child.icon;
                obj.weight = child.weight;
                obj.hidden = child.hidden;
                obj.link = '/' + child.link;
                obj.access = (child.role.indexOf(cr) >= 0 && _.isEqual(child.status, 1));
                obj.childs = _.sortBy(arr, 'name');
                obj.childs.sort(_.dynamicSort("weight"));
                childarr.push(obj);
                childarr.sort(_.dynamicSort("weight"));
                if (child.link && !_.isEqual(child.link, 'none')) {
                    ma['/' + child.link] = (child.role.indexOf(cr) >= 0 && _.isEqual(child.status, 1));
                    if (child.crud) {
                        ma['/' + child.link + '/new'] = (child.role.indexOf(cr) >= 0 && _.isEqual(child.status, 1));
                        ma['/' + child.link + '/update'] = (child.role.indexOf(cr) >= 0 && _.isEqual(child.status, 1));
                        ma['/' + child.link + '/edit'] = (child.role.indexOf(cr) >= 0 && _.isEqual(child.status, 1));
                        ma['/' + child.link + '/validate'] = (child.role.indexOf(cr) >= 0 && _.isEqual(child.status, 1));
                    }
                }
                if (childCount <= 0) {
                    callback(null, childarr, ma);
                }
            });
        });
    });
};
