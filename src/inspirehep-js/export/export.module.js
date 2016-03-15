(function(angular) {

  angular.module('export', [
    'ngclipboard',
    'ngSanitize',
    'ui.bootstrap',
    'export.controllers',
    'export.directives',
    'export.services'
  ]);

  angular.module('export').config(['$uibTooltipProvider', function($uibTooltipProvider){
    $uibTooltipProvider.setTriggers({
      'click': 'mouseleave',     
    });
  }]);
             

})(angular);
