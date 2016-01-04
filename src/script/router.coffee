angular.module('TenRead', [
    'ui.router'
    'TenRead.directive'
    'TenRead.Controllers'
]).config(($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist /^\s*(https?|ftp|mailto|file|tel|chrome-extension):/
).config ($stateProvider, $urlRouterProvider) ->
#
# For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise ($injector, $location) ->
        if location.hash == '' and location.pathname == '/option.html'
            location.hash = '#/option/store'
        else
            location.hash = '#/popup'
    #
    # Now set up the states
    $stateProvider
    .state('popup',
        url: '/popup'
        templateUrl: '/template/popup.html'
        controller: 'PopupCtrl')
    .state('option',
        url: '/option'
        templateUrl: '/template/option.html')
    .state('option.store',
        url: '/store'
        templateUrl: '/template/option.html'
        views:
            'content':
                templateUrl: '/template/option.store.html'
                controller: 'OptionStoreCtrl')
    .state('option.subscription',
        url: '/subscription'
        templateUrl: '/template/option.html'
        views:
            'content':
                templateUrl: '/template/option.subscription.html'
                controller: 'OptionSubscriptionCtrl')
    .state('option.exchange',
        url: '/exchange'
        templateUrl: '/template/option.html'
        views:
            'content':
                templateUrl: '/template/option.exchange.html'
                controller: 'OptionExchangeCtrl')
    .state 'option.about',
        url: '/about'
        templateUrl: '/template/option.html'
        views:
            'content':
                templateUrl: '/template/option.about.html'
                controller: 'OptionAboutCtrl'