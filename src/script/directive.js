angular.module('TenRead.directive', [])

    .directive("scroll", function ($window) {
        return function (scope, element, attrs) {
            angular.element($('.tabs')).bind("scroll", function () {
                scope.$apply();
            });
        };
    });