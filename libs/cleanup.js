function noOp() {
};

exports.Cleanup = function Cleanup(callback) {

    callback = callback || noOp;
    process.on('cleanup', callback);

    process.on('exit', function () {
        process.emit('cleanup');
    });

    process.on('SIGUSR2', function(){
        __log.error('restart forever', arguments);
    });

    process.on('SIGINT', function () {
        __log.error(arguments);
        process.exit(2);
    });

    process.on('uncaughtException', function (e) {
        console.log('Uncaught Exception...');
        __log.error(e);
        process.exit(99);
    });
};