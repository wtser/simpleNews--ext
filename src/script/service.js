angular.module('TenRead.Services', [])
    .factory("$modal", function () {

        var modal = {
            show: function (template) {

                $('.chrome-bootstrap').append(template)

            },
            close: function () {
                $('.overlay').remove()
            }
        };
        return modal;


    });