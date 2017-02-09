var mongoose = require('mongoose');
var mongodb = require('mongodb');
var bcrypt = require('bcryptjs');
const saltRounds = 8;
var Cryptr = require('cryptr'),
    cryptr = new Cryptr(_config.token.secret);
var nodemailer = require('nodemailer');
var crypto = require('crypto');

String.prototype.replaceAll = function (search, replace, ignoreCase) {
    if (ignoreCase) {
        var result = [];
        var _string = this.toLowerCase();
        var _search = search.toLowerCase();
        var start = 0, match, length = _search.length;
        while ((match = _string.indexOf(_search, start)) >= 0) {
            result.push(this.slice(start, match));
            start = match + length;
        }
        result.push(this.slice(start));
    } else {
        result = this.split(search);
    }
    return result.join(replace);
};

String.prototype.zFormat = function () {
    var source = this;

    _.each(arguments, function (n, i) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};

global._Menu = {content: []};
module.exports = {
    arrayObjectId: function (arr) {
        return _.compact(_.chain(arr).map(function (id) {
            return mongoose.Types.ObjectId.isValid(id) ? new mongodb.ObjectId(id) : '';
        }).value());
    },
    stringRegex: function (text) {
        var txt = text.toLowerCase().replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');

        var ss = '';

        function isValidCharacter(str) {
            return !/[~`!#$%\^&*+=\-\[\]\\';,/{}()|\\":<>\?]/g.test(str);
        }

        for (var i = 0; i < txt.length; i++) {
            ss = isValidCharacter(txt[i]) ? ss.concat(txt[i]) : ss.concat('\\', txt[i]);
        }
        txt = ss;

        var a = 'àáảãạâầấẩẫậăằắẳẵặa';
        var d = 'đd';
        var u = 'ùúủũụưừứửữựu';
        var i = 'ìíỉĩịi';
        var e = 'èéẻẽẹêềếểễệe';
        var o = 'òóỏõọôồốổỗộơờớởỡợo';
        var y = 'ỳýỷỹỵy';
        var str = '';
        for (var k = 0; k < txt.length; k++) {
            if (a.indexOf(txt[k]) >= 0) {
                str = str + '[' + a + ']';
            }
            else if (d.indexOf(txt[k]) >= 0) {
                str = str + '[' + d + ']';
            }
            else if (u.indexOf(txt[k]) >= 0) {
                str = str + '[' + u + ']';
            }
            else if (i.indexOf(txt[k]) >= 0) {
                str = str + '[' + i + ']';
            }
            else if (e.indexOf(txt[k]) >= 0) {
                str = str + '[' + e + ']';
            }
            else if (o.indexOf(txt[k]) >= 0) {
                str = str + '[' + o + ']';
            }
            else if (y.indexOf(txt[k]) >= 0) {
                str = str + '[' + y + ']';
            }
            else {
                str = str + txt[k];
            }
        }
        return str;
    },
    regexAgg: function (type, text) {
        switch (type) {
            case 1:
            case 2:
                return {$regex: new RegExp(_.stringRegex(text), 'i')};
                break;
            default:
                return text;
                break;
        }
    },
    cleanValidateKey: function (key) {
        return key.indexOf('validate') == 0 ? key.split('-for-')[1] : key;
    },
    cleanString: function (str) {
        return str.toLowerCase()
            .replace(/_/g, '')
            .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
            .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
            .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
            .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
            .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
            .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\'|\&|\#|\[|\]|~/g, '-')
            .replace(/-+-/g, '_')
            .replace(/^\-+|\-+$/g, '');
    },
    trimValue: function (v) {
        return _.trim(v).toLowerCase().replace(/  +/g, '');
    },
    trimValueAndUpper: function (v) {
        return _.trim(v).toUpperCase().replace(/  +/g, '');
    },
    trimValueNotLower: function (v) {
        return _.trim(v).replace(/  +/g, '');
    },
    trimArray: function (arr) {
        return _.map(arr, function (e) {
            return _.trimValue(e);
        });
    },
    replaceValue: function (obj, key, value) {
        var _obj = _(obj)

        _obj.each(function (v, k) {
            if (k === key) {
                obj[k] = value
            } else if (obj[k] === Object(obj[k])) {
                _.replaceValue(obj[k], key, value)
            }
        });

        return _obj;
    },
    replaceKey: function (obj, oldName, newName) {
        if (!obj.hasOwnProperty(oldName)) {
            return obj;
        }
        obj[newName] = obj[oldName];
        delete obj[oldName];
        return obj;
    },
    toLower: function (obj) {
        var result = _.first(_.map([obj], function (element) {
            return _.object(_.keys(element), _.values(element).map(function (value) {
                return _.isString(value) ? value.toLowerCase() : value;
            }));
        }));
        return result;
    },
    htmlTags: function (obj) {
        var output = '';
        _.each(obj, function (e) {
            if (_.isObject(e) && _.has(e, 'tag')) {
                var _data = _.has(e, 'data') ? _.map(e.data, function (val, key) {
                        return 'data-' + key + '="' + val + '"';
                    }) : null,
                    _attr = _.has(e, 'attr') ? _.map(e.attr, function (val, key) {
                        return key + '=' + _.quote(val) + '';
                    }) : null,
                    _sattr = _.has(e, 'sattr') ? e.sattr.join(' ') : '',
                    _tooltip = _.has(e, 'tooltip') ? 'data-container="' + (e.tooltip.container || 'body') + '" data-placement="' + (e.tooltip.placement || 'top') + '" data-original-title="' + (e.tooltip.text || '') + '"' : '';
                output += '<' + e.tag + ' ' + _tooltip + ' ' + (_.isNull(_attr) ? '' : _attr.join(' ')) + ' ' + (_.isNull(_data) ? '' : _data) + _sattr + '>';
                if (_.has(e, 'childs') && e.childs.length) {
                    output += _.htmlTags(e.childs);
                }
                output += (e.content || '') + (_.has(e, 'notend') ? '' : '</' + e.tag + '>');
            } else {
                output += '';
            }
        });
        return _.clean(output);
    },
    htmlMenu: function (obj, _class) {
        var output = '<ul class="' + (_class ? _class : '') + '">';
        _.each(obj, function (e) {
            if (e.access && _.isEqual(e.hidden, 0)) {
                output += _.htmlTags([{
                    tag: 'li',
                    attr: {class: (_.has(e, 'childs') && !_.isEmpty(e.childs)) ? 'sub-menu' : ''},
                    notend: true,
                    childs: [{
                        tag: 'a',
                        attr: {href: (!_.isEqual(e.link, '/none') && e.link) ? e.link : 'javascript:void(0)'},
                        content: e.name,
                        childs: [(_.isEmpty(e.icon) ? {} : {tag: 'i', attr: {class: e.icon}})]
                    }]
                }]);
                if (_.has(e, 'childs') && !_.isEmpty(e.childs)) {
                    output += _.htmlMenu(e.childs);
                }
                output += '</li>';
            }
        });
        output += '</ul>';
        return _.clean(output);
    },
    htmlVerticalMenu: function (_class) {
        var output = '';
        return output;
        _.each(mMenu, function (obj, i) {
            output += _.htmlTags([{
                tag: 'div', attr: {class: 'panel panel-collapse'}, childs: [
                    {
                        tag: 'div', attr: {class: 'panel-heading', role: 'tab', id: 'heading-' + obj._id},
                        childs: [
                            {
                                tag: 'h5', attr: {class: 'panel-title'},
                                childs: [{
                                    tag: 'a',
                                    content: _.capitalize(obj.name),
                                    attr: {
                                        class: 'collapsed',
                                        'data-toggle': 'collapse',
                                        'data-parent': '#accordion',
                                        'aria-expanded': false,
                                        'aria-controls': '#collapse-' + obj._id,
                                        href: '#collapse-' + obj._id
                                    }
                                }]
                            }
                        ]
                    },
                    {
                        tag: 'div',
                        attr: {
                            id: 'collapse-' + obj._id,
                            class: 'collapse',
                            role: 'panel',
                            'aria-labelledby': 'heading-' + obj._id
                        },
                        childs: [{
                            tag: 'div',
                            attr: {class: 'panel-body p-0'},
                            content: _.htmlMenu(obj.children, _class)
                        }]
                    }
                ]
            }]);
            //return output;
        });
        return _.clean(output);
    },
    dynamicSort: function (property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },
    sumBy: function (data, key, prop) {
        var sum = function (t, n) {
            return t + n;
        };
        return _.mapObject(
            _.groupBy(data, key), function (values, k) {
                var result = {};
                _.each(prop, function (p, i) {
                    result[p] = _.reduce(_.pluck(values, p), sum, 0);
                });
                return result;
            }
        );
    },
    switch: function (val, arr1, arr2) {
        return arr2[arr1.indexOf(val)];
    },
    switchAgg: function (type, text) {
        switch (type) {
            case 1:
                return {$regex: new RegExp(_.stringRegex(text), 'i')};
            case 2:
                return Number(text);
                break;
            case 3:
                return {$regex: new RegExp(_.stringRegex(text), 'i')};
                break;
            case 4:
                return {$all: text};
                break;
            case 5:
                return {$elemMatch: {$eq: text}};
                break;
            case 6:
                return {
                    $gte: _moment(text + ' 00:00:00', 'DD/MM/YYYY hh:mm:ss')._d,
                    $lte: _moment(text + ' 23:59:59', 'DD/MM/YYYY hh:mm:ss')._d
                };
            case 7:
                return {$regex: new RegExp(_.stringRegex(text), 'i')};
                break;
        }
    },
    render: function (req, res, v, o, f, e) {
        res.locals._url = req.originalUrl;
        if (e) return res.render('500', {message: e.message});
        if (!f) return res.render('404');
        if (!_.has(o, 'title')) o.title = 'DFT';
        _.extend(o, {
            isSinglePage: req.xhr,
            user: _.has(req.session, 'user') ? req.session.user : null,
            page: _.has(o, 'page') ? o.page : v,
            plugins: _.has(o, 'plugins') ? o.plugins : [],
            menu: _.has(req.session, 'menuRouter') ? req.session.menuRouter : [],
            menuAccess: _.has(req.session, 'menuAccess') ? req.session.menuAccess : [],
            base_url: req.headers.host
        });
        res.render((_.has(req.session, 'logged') && _.isEqual(req.session.logged, true) && !(_.has(o, 'custom-view') && o['custom-view'])) ? (req.xhr ? 'layout/' + o.page : (req.session.admin ? 'admin' : 'index')) : o.page, o);
    },
    convertObjectId: function (params) {
        if (_.isString(params) && mongodb.ObjectID.isValid(params)) {
            return new mongodb.ObjectID(params);
        }
        return params;
    },
    checkEmail: function (emailAddress) {
        var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
        var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
        var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
        var sQuotedPair = '\\x5c[\\x00-\\x7f]';
        var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
        var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
        var sDomain_ref = sAtom;
        var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
        var sWord = '(' + sAtom + '|' + sQuotedString + ')';
        var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
        var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
        var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
        var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

        var reValidEmail = new RegExp(sValidEmail);

        return reValidEmail.test(emailAddress);
    },
    checkPhone: function (phone) {
        return /^[0-9]+$/.test(phone);
    },
    checkName: function (name) {
        return !(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'|\'|\&|\#|\[|\]|~/g.test(name));
    },
    checkUsername: function (name) {
        return /^\w+(\w)*$/g.test(name);
    },
    checkNumber: function (str) {
        if ((typeof (str) == 'string' && str == '') || str == null || str == undefined) {
            return false;
        }
        return _.isEqual(typeof (str), 'number') ? true : (!_.isNaN(Number(str)) && str.indexOf('e') < 0);
    },
    hashData: function (plainText, cb) {
        bcrypt.hash(plainText, saltRounds, cb);
    },
    compareWithHashData: function (plainText, hashData, cb) {
        bcrypt.compare(plainText, hashData, cb);
    },
    checkLogin: function(plainText, data, cb){
        if (!data.password || !data.username){
            return cb('err');
        }
        this.compareWithHashData(data.username + '$' + plainText, data.password, cb);
    },
    sendAccountCode: function (accountName, code, toEmail) {
        var transporter = nodemailer.createTransport('smtps://mobiledev6763@gmail.com:makelove05@smtp.gmail.com');
        var sendCodeReminder = transporter.templateSender({
            subject: 'Mã xác nhận đăng ký',
            text: 'Xin chào {{username}}. Mã xác nhận đăng ký tài khoản của bạn là: {{ accountCode }}. Cám ơn đã sử dụng dịch vụ của chúng tôi.',
            html: '<p>Xin chào <strong>{{username}}</strong>. </p>' +
            '<p> Mã xác nhận đăng ký tài khoản của bạn là:\n<b>{{ accountCode }}</b></p><p>Cám ơn đã sử dụng dịch vụ của chúng tôi.</p>'
        }, {
            from: 'mobiledev6763@gmail.com',
            auth: {
                user: "mobiledev6763@gmail.com",
                pass: "makelove05"
            }
        });

        // use template based sender to send a message
        sendCodeReminder({
            to: toEmail
        }, {
            username: accountName,
            accountCode: code
        }, function (err, info) {
            if (err) {
                return console.log(err);
            }
            console.log('Message sent: ' + info.response);
        });
    },
    randomAsciiString: function (length) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charsLength = chars.length;
        if (charsLength > 256) {
            throw new Error('Argument \'chars\' should not have more than 256 characters'
                + ', otherwise unpredictability will be broken');
        }

        var randomBytes = crypto.randomBytes(length);
        var result = new Array(length);

        var cursor = 0;
        for (var i = 0; i < length; i++) {
            cursor += randomBytes[i];
            result[i] = chars[cursor % charsLength];
        }

        return result.join('');
    },
    checkDirectory: function (directory, callback) {
        fsx.stat(directory, function (err, stats) {
            //Check if error defined and the error code is "not exists"
            if (err) {
                //Create the directory, call the callback.
                fsx.mkdirp(directory, callback);
            } else {
                callback(err)
            }
        });
    }
};



