(function() {
  angular.module('TenRead', ['ui.router', 'TenRead.directive', 'TenRead.Controllers']).config(function($compileProvider) {
    return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
  }).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector, $location) {
      if (location.hash === '' && location.pathname === '/option.html') {
        return location.hash = '#/option/store';
      } else {
        return location.hash = '#/popup';
      }
    });
    return $stateProvider.state('popup', {
      url: '/popup',
      templateUrl: '/template/popup.html',
      controller: 'PopupCtrl'
    }).state('option', {
      url: '/option',
      templateUrl: '/template/option.html'
    }).state('option.store', {
      url: '/store',
      templateUrl: '/template/option.html',
      views: {
        'content': {
          templateUrl: '/template/option.store.html',
          controller: 'OptionStoreCtrl'
        }
      }
    }).state('option.subscription', {
      url: '/subscription',
      templateUrl: '/template/option.html',
      views: {
        'content': {
          templateUrl: '/template/option.subscription.html',
          controller: 'OptionSubscriptionCtrl'
        }
      }
    }).state('option.exchange', {
      url: '/exchange',
      templateUrl: '/template/option.html',
      views: {
        'content': {
          templateUrl: '/template/option.exchange.html',
          controller: 'OptionExchangeCtrl'
        }
      }
    }).state('option.about', {
      url: '/about',
      templateUrl: '/template/option.html',
      views: {
        'content': {
          templateUrl: '/template/option.about.html',
          controller: 'OptionAboutCtrl'
        }
      }
    });
  });

}).call(this);
