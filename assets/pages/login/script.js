var DFT = function ($) {
    var id = '';
    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    var bindSubmit = function () {
        $('#frm-login').on('submit', function(e){
            e.preventDefault();
            var obj = getFormData($(this));
            $.post('/login', obj, function (resp) {
                if (_.isEqual(resp.code, 200)) {
                    if ($('#login-form input[type="checkbox"]').is(':checked')) {
                        setCookie('username', $('#login-form #username').val(), 7);
                        setCookie('password', $('#login-form #password').val(), 7);
                    } else {
                        setCookie('username', '', 0);
                        setCookie('password', '', 0);
                    }
                    if (window.location.pathname != '/login' && window.location.pathname != '/' && window.location.pathname.split('/').indexOf('auth') === -1 && window.location.pathname != '/logout') {
                        window.location.reload();
                    } else {
                        window.location.href = '';
                    }
                }
            });
        });
    };

    return {
        init: function () {
            $('#login-form #username').val(getCookie('username'));
            $('#login-form #password').val(getCookie('password'));
            bindSubmit();
        }
    };
}(jQuery);
