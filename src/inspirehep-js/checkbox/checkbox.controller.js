(function(angular) {

  function checkboxCtrl($scope, exportRecords) {
    
    $scope.toggleId = toggleId;
    $scope.toggleAllIds = toggleAllIds;
    $scope.isChecked = isChecked;
    $scope.allChecked = allChecked;
    $scope.anyChecked = anyChecked;
    
    function toggleId(recid) {
      exportRecords.toggleIdToExport(recid);
    }

    function toggleAllIds() {
      
      var remove_all = allChecked();
      angular.forEach($scope.$parent.vm.invenioSearchResults.hits.hits, function(record, key) {  
        if (remove_all) {
          exportRecords.removeIdFromExport(record.id);  
        } else {
          exportRecords.addIdToExport(record.id);  
        }
      }); 
    }

    function isChecked(recid) {
      return exportRecords.getIdsToExport().indexOf(recid) !== -1;
    }

    function allChecked() {
      return $scope.$parent.vm.invenioSearchResults.hits.hits.length === exportRecords.getIdsToExport().length;
    }

    function anyChecked() {
      return exportRecords.getIdsToExport().length > 0;
    }
   
  }

  checkboxCtrl.$inject = ['$scope', 'exportRecords'];

  angular.module('checkbox.controllers', [])
    .controller('checkboxCtrl', checkboxCtrl);

})(angular);
