(function() {
  angular.module('TenRead.directive', []).directive('scroll', function($window) {
    return function(scope, element, attrs) {
      return angular.element($('.tabs')).bind('scroll', function() {
        return scope.$apply();
      });
    };
  });

}).call(this);
