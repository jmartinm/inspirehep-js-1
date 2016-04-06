(function(angular) {

  angular.module('citemodal', [
    'ui.bootstrap',
    'citemodal.directives',
    'citemodal.services',
    'citemodal.controllers'
  ]);

  angular.module('citemodal').config(['$uibTooltipProvider', function($uibTooltipProvider){
    $uibTooltipProvider.setTriggers({
      'click': 'mouseleave',     
    });
  }]);
             

})(angular);
