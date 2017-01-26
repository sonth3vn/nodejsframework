
;(function ($) {
    var _userId;
    var _tblName = 'tab-interested';
    var _notiIds = [];

    var _this = function (s) {
        return 'body #header .header-inner .pull-right .top-menu ' + s;
    }

    var _table = function (s) {
        return 'body #content #card-content .tab-content #' + s + ' table';
    }

    var _tableCounter = function (s) {
        return 'body #content #card-content .main-tabs #c-' + s + ' i.tmn-counts';
    }

    var bindClick = function (socket) {
        $(document).on('click', '.zmdi-globe', function(){
            // lấy id của các thư trong hòm thư
            getIds();
        });

        $(document).on('click', '.a-notification', function(){
            var self = $(this);
            //update status msg in previous tab
            updateMsgStatus(function(){
                _tblName = self.attr('aria-controls');
                getIds();
            });
        });

        //Handle event the table body is rendered and avaiable in DOM
        //Update counter
        $('#tbl-interested').on('post-body.bs.table', function (data) {
            getIds();
            //refresh counter to 0
            NotificationTab.refreshTabCounter(1);
            NotificationTab.refreshCounter();
            //update counter
            NotificationTab.updateTabCounter(1, _counterI);
            var counter = _counterI + _counterP + _counterN;
            NotificationTab.updateCounter(counter);
        });

        $('#tbl-private').on('post-body.bs.table', function (data) {
            getIds();
            //refresh counter to 0
            NotificationTab.refreshTabCounter(2);
            NotificationTab.refreshCounter();
            //update counter
            NotificationTab.updateTabCounter(2, _counterP);
            var counter = _counterI + _counterP + _counterN;
            NotificationTab.updateCounter(counter);
        });

        $('#tbl-news').on('post-body.bs.table', function (data) {
            getIds();
            //refresh counter to 0
            NotificationTab.refreshTabCounter(3);
            NotificationTab.refreshCounter();
            //update counter
            NotificationTab.updateTabCounter(3, _counterN);
            var counter = _counterI + _counterP + _counterN;
            NotificationTab.updateCounter(counter);
        });

        //==============================================================

        function updateMsgStatus(next){
            var ids = _.union(_notiIds);

            if (ids.length > 0){
                _Ajax('/notification/' + _userId, 'PUT', [{ids: ids}], function(resp){
                    if (resp.code == 200) {
                        _notiIds = [];
                        // cập nhật số lượng thư mới trên giao diện
                        NotificationTab.updateCounter(-resp.data.nModified);
                        if (_.isEqual(_tblName, 'tab-interested')){
                            NotificationTab.updateTabCounter(1, -resp.data.nModified);
                        }
                        else if (_.isEqual(_tblName, 'tab-private')){
                            NotificationTab.updateTabCounter(2, -resp.data.nModified);
                        }
                        else{
                            NotificationTab.updateTabCounter(3, -resp.data.nModified);
                        }
                    }
                    $(_table(_tblName)).bootstrapTable('refresh');
                    next();
                });
            }
            else{
                _notiIds = [];
                next();
            }
        }

        function getIds(){
            var $_table = $(_table(_tblName));
            var notiIds = _.compact($.map($($_table).bootstrapTable('getData'), function (row) {
                return _.isEqual(row.status, 0) ? row._id : '';
            }));
            _notiIds = _notiIds.concat(notiIds);
        }

        $('#card-content').on('hidden.bs.modal page-change.bs.table', function () {
            // khi tắt popup, cập nhật trạng thái đã đọc cho các thư
            if (_notiIds.length > 0){
                // cập nhật trạng thái
                updateMsgStatus(function(){ });
            }
        })
    };

    var bindSocket = function (client) {
        client.on('notification', function (noti) {
            NotificationTab.updateTable(noti);
            NotificationTab.updateCounter(1);
            NotificationTab.updateTabCounter(Number(noti.type), 1);
        });
    }

    $(document).ready(function () {
        NotificationTab.init();
        //////test
        //var tSocket = io.connect(window.location.protocol + '//' + window.location.hostname + ':' + 3111, {'reconnection': true, 'reconnectionDelay': 500});
        //tSocket.on('connect', function(s){
        //    tSocket.emit('client-connect', {_id: '5795d235f2b7b8c418a4d56b'});
        //
        //    setInterval(function(){
        //        tSocket.emit('client-emit', {location: {lat: "20.99708163647074", long: "20.99708163647074"}});
        //    }, 3000);
        //    //tSocket.on('package-timer', function(data){
        //    //    console.log(141, data);
        //    //});
        //});

        $.get('/users?type=0', function(resp){
            if (resp.code == 200){
                _userId = resp.data._id;
                var csocket = io.connect(window.location.protocol + '//' + window.location.hostname + ':' + 3100, {'reconnection': true, 'reconnectionDelay': 500});
                csocket.on('connect', function(s){
                    csocket.emit('user-connect', {_id: _userId});
                    csocket.emit('listen-package', {_id: '57f5c4cf0118a55c058820ca'});
                    csocket.on('package-timer', function(data){
                        console.log(141, data);
                    });
                    bindSocket(csocket);
                });
            }
        });
        bindClick();
    });

    var NotificationTab = window.NotificationTab = Object.create({
        counter: 0,
        interestedCounter: 0,
        privateCounter: 0,
        newsCounter: 0,
        tabCounter: null,

        init: function () {
            this.tabCounter = $(_this('i.tmn-counts'));
        },

        updateTable: function (noti) {
            var $table;
            switch (Number(noti.type)) {
                case 1: {
                    //Tin quan tâm
                    $table = $(_table('tab-interested'));
                    break;
                }
                case 2: {
                    //Tin cá nhân
                    $table = $(_table('tab-private'));
                    break;
                }
                case 3: {
                    //Tin tức mới
                    $table = $(_table('tab-news'));
                    break;
                }
                default: {
                    break;
                }
            }

            if ($table){
               $table.bootstrapTable('refresh');
            }
        },

        updateCounter: function (add) {
            this.counter += add;
            $(_this('.zmdi-globe')).removeClass('c-black');
            $(_this('.zmdi-globe')).addClass('c-white');
            this.tabCounter.show();

            if (this.counter == 0){
                $(_this('.zmdi-globe')).addClass('c-black');
                $(_this('.zmdi-globe')).removeClass('c-white');
                this.tabCounter.hide();
            }

            this.tabCounter.text(this.counter);
        },

        refreshCounter: function(){
            this.counter = 0;
            this.tabCounter.text(this.counter);
        },

        refreshTabCounter: function(tab){
            switch (tab){
                case 1:
                    this.interestedCounter = 0;
                    $(_tableCounter('interested')).text(this.interestedCounter);
                    $(_tableCounter('interested')).hide();
                    break;
                case 2:
                    this.privateCounter = 0;
                    $(_tableCounter('private')).text(this.privateCounter);
                    $(_tableCounter('private')).hide();
                    break;
                case 3:
                    this.newsCounter = 0;
                    $(_tableCounter('news')).text(this.newsCounter);
                    $(_tableCounter('news')).hide();
                    break;
                default:
                    break;
            }
        },

        updateTabCounter: function(tab, add){
            var tabCounter;
            switch (tab){
                case 1:
                    tabCounter = $(_tableCounter('interested'));
                    this.interestedCounter += add;
                    tabCounter.text(this.interestedCounter);
                    tabCounter.show();
                    if (this.interestedCounter == 0){
                        tabCounter.hide();
                    }
                    break;
                case 2:
                    tabCounter = $(_tableCounter('private'));
                    this.privateCounter += add;
                    tabCounter.text(this.privateCounter);
                    tabCounter.show();
                    if (this.privateCounter == 0){
                        tabCounter.hide();
                    }
                    break;
                case 3:
                    tabCounter = $(_tableCounter('news'));
                    this.newsCounter += add;
                    tabCounter.text(this.newsCounter);
                    tabCounter.show();
                    if (this.newsCounter == 0){
                        tabCounter.hide();
                    }
                    break;
                default:
                    break;
            }
        }
    });
})(jQuery);