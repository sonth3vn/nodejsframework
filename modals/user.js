var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fullName: {type: String},
    avatar: {type: String, default: '/assets/uploads/avatar/default.jpg'},
    email: {type: String, require: true},
    status: {type: Number, default: 1}, //0: chưa kích hoạt; 1: đã kích hoạt;
    role: {type: Number, default: 1},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
}, {id: false, versionKey: 'v'});

UserSchema.pre('save', function(next) {
    var user = this;
    //hash info
    _async.parallel([
        function(next){
            //password
            if (!user.password){
                return next(user.password);
            }
            _.hashData(user.password, next);
        }
    ], function(err, resp){
        __log.debug(resp);
        if (!err) user.password = resp[0];
        next();
    });
});

UserSchema.set('toJSON', {getters: true});
UserSchema.plugin(require('mongoose-aggregate-paginate'));
module.exports = mongoose.model('User', UserSchema);
