exports.auth = function (req, res, next) {
    var _skip = (['assets', 'favicon'].indexOf(req.path.split('/')[1]) >= 0)
        || (req.xhr && _.isEqual(req.path, '/login'))
    req.originalUrl = req.path.split('/')[1];
    if (req.path.indexOf('login') >= 0) return next();
    if (!req.session.logged) return _.render(req, res, 'login', {title: 'Đăng nhập'}, true);
    //if (_.isEqual(req.path.split('?')[0], '/')) return next();
    //if (_.isEqual(req.path.split('?')[0], '/logout')) return next();
    next();
};


//exports.auth = function (req, res, next) {
//    var _skip = (['assets', 'favicon'].indexOf(req.path.split('/')[1]) >= 0)
//        || (req.xhr && _.isEqual(req.path, '/login'))
//        || (['register', 'auth'].indexOf(req.path.split('/')[1]) >= 0)
//        || (_.isEqual(req.path, '/connect'))
//        || (_.isEqual(req.path, '/recover'))
//        || (req.xhr);
//    //
//    if (_skip) return next();
//    //if (req.xhr && !_.isEqual(req.path, '/login')) {
//    //    if(_.has(req.headers,'x-user-id')){
//    //        _User.findById(req.headers['x-user-id'], function(err,r){
//    //            if(err) return res.json({code:500,msg:err.message})
//    //            else if(r) return next();
//    //            else return res.json("Bạn phải đăng nhập");
//    //        })
//    //    }else{
//    //        return res.json("Bạn phải đăng nhập");
//    //    }
//    //}else{
//    if (!req.session.logged){
//        console.log(50);
//        return _.render(req, res, 'login', {title: 'Đăng nhập'}, true);
//    }
//    console.log(53);
//    if (_.isEqual(req.path.split('?')[0], '/')) return next();
//    if (_.isEqual(req.path.split('?')[0], '/logout')) return next();
//    //    return next();
//    //}
//    return next();
//};
