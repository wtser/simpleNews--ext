angular.module('TenRead', ['ui.router', 'TenRead.Controllers'])

    .directive("scroll", function ($window) {
        return function (scope, element, attrs) {
            angular.element($('.tabs')).bind("scroll", function () {
                console.log($(this).scrollTop())

                scope.$apply();
            });
        };
    })


    .config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise(function ($injector, $location) {
            if (location.hash == '' && location.pathname == "/option.html") {
                location.hash = '#/option/list'
            } else {
                location.hash = '#/popup'
            }
        });

        //
        // Now set up the states
        $stateProvider
            .state('popup', {
                url: "/popup",
                templateUrl: "/template/popup.html",
                controller: 'PopupCtrl'
            })
            .state('option', {
                url: "/option",
                templateUrl: "/template/option.html"
            })
            .state('option.list', {
                url: "/list",
                templateUrl: "/template/option.html",
                views: {
                    'content': {
                        templateUrl: "/template/option.list.html",
                        controller: 'OptionListCtrl'

                    }
                }
            })
            .state('option.mylist', {
                url: "/mylist",
                templateUrl: "/template/option.html",
                views: {
                    'content': {
                        templateUrl: "/template/option.mylist.html",
                        controller: 'OptionMyListCtrl'
                    }
                }
            })
            .state('option.exchange', {
                url: "/exchange",
                templateUrl: "/template/option.html",
                views: {
                    'content': {
                        templateUrl: "/template/option.exchange.html",
                        controller: 'OptionExchangeCtrl'
                    }
                }
            })
            .state('option.about', {
                url: "/about",
                templateUrl: "/template/option.html",
                views: {
                    'content': {
                        templateUrl: "/template/option.about.html",
                        controller: 'OptionAboutCtrl'
                    }
                }
            })

    });