var DFT = function ($) {
    function getIdSelections() {
        return $.map($('#user-table').bootstrapTable('getSelections'), function (row) {
            return row._id;
        });
    }

    var bindClick = function () {
        $('#btn-delSelection').on('click', function(e){
            e.preventDefault();
            swal({
                    title: 'Thông báo',
                    text: 'Bạn muốn xóa các bản ghi này?',
                    type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55", confirmButtonText: "Có, chắc chắn!", closeOnConfirm: true
                },
                function () {
                    console.log(17, getIdSelections());
                });
        });
    };


    var bindSubmit = function () {

    };

    return {
        init: function () {
            bindClick();
            bindSubmit();

            $("#user-table")
                .bootstrapTable('hideLoading')
                .bootstrapTable('refresh');
        }
    };
}(jQuery);