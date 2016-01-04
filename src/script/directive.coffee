angular.module('TenRead.directive', [])

.directive 'scroll', ($window) ->
    (scope, element, attrs) ->
        angular.element($('.tabs')).bind 'scroll', -> scope.$apply()