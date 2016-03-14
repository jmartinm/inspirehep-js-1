(function(angular) {

  function inspireCiteModal($uibModal) {

    function link(scope, element, attrs) {

      scope.openModal = function (size) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: attrs.bodyTemplate,
          size: size,
          controller: 'modalInstanceCtrl',
          controllerAs: 'vm',
          resolve: {
            recid: function() {
              return attrs.recid;
            }
          }
        });
      };
    }

    function templateUrl(element, attrs) {
      return attrs.buttonTemplate;
    }

    return {
        templateUrl: templateUrl,
        restrict: 'E',
        scope: false,
        link:link
      };
  }

  inspireCiteModal.$inject = ['$uibModal'];

  angular.module('citemodal.directives', [])
    .directive('inspireCiteModal', inspireCiteModal);

})(angular);
