'use strict';

angular.module('ng-nouislider', []).directive('nouislider', function(){
  return {
    restrict: 'A',
    scope: {
      min: '=',
      max: '=',
      minPadding: '=',
      maxPadding: '=',
      step: '=',
      margin: '=',
      enable: '=',
      range: '=',
      ngModel: '=',
      ngRange: '='
    },
    link: function(scope, element, attrs) {
      var slider = $(element);
      var getMin = function() { return +scope.min; };
      var getMax = function() { return +scope.max; };
      var getRealMin = function() { return getMin() + (+(scope.minPadding || 0)); };
      var getRealMax = function() { return getMax() - (+(scope.maxPadding || 0)); };
      var getRange = function() {
        return scope.ngRange ? scope.ngRange.map(function(d) { return +d; }) : [getMin(), getMax()];
      }
      var getFrom = function() { return getRange()[0]; };
      var getTo = function() { return getRange()[1]; };
      var getStep = function() { return +(scope.step || 1); };
      var getModel = function() { return +(scope.ngModel || scope.min); };
      var getMargin = function() { return +(scope.margin) || 0; };
      var regularVal = function(val) {
        if (val <= getRealMin()) { val = getRealMin(); }
        if (val >= getRealMax()) { val = getRealMax(); }
        return val;
      };

      if (scope.range === true || scope.range === 'true') {
        // range slider
        slider.noUiSlider({
          start:[
            getFrom(),
            getTo()
          ],
          connect: true,
          margin: getMargin(),
          step: getStep(),
          range: {
            min: [getMin()],
            max: [getMax()]
          }
        });

        slider.on('slide', function() {
          var from = regularVal(+slider.val()[0]), to = regularVal(+slider.val()[1]);
          slider.val([from, to]);
          scope.$apply(function() {
            scope.ngRange = [from, to];
          });
        });

        scope.$watchCollection('ngRange', function(newFromTo, oldFromTo) {
          if (newFromTo !== oldFromTo) { slider.val([newFromTo[0], newFromTo[1]]); }
        });
      } else {
        // simple slider
        slider.noUiSlider({
          start: getModel(),
          step: getStep(),
          connect: 'lower',
          range: {
            min: getMin(),
            max: getMax()
          }
        });

        slider.on('slide', function() {
          var val = regularVal(+slider.val());
          slider.val(val);
          scope.$apply(function() { scope.ngModel = val; });
        });
        scope.$watch('ngModel', function(newVal, oldVal) {
          if (newVal !== oldVal) { slider.val(newVal); }
        });
      }

      scope.$watch('enable', function(newEnable, oldEnable) {
        if (newEnable === false || newEnable === 'false') { // remove disabled attr
          element.attr('disabled', true);
        } else { // add disabled attr
          element.removeAttr('disabled');
        }
      });

    }
  };

});
