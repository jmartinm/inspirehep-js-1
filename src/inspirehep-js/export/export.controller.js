(function(angular) {

  function exportModalInstanceCtrl($scope, $uibModalInstance, exportAPI, exportRecords, recid) {
    var vm = this;

    // First element is the human readable export text
    // Second element is the extension of the file when the format is
    // downloaded.
    vm.formats = {
      'BibTex': 'bib',
      'LaTex(EU)': 'tex',
      'LaTex(US)': 'tex',
      'CV format (LaTex)': 'tex',
      'CV format (html)': 'html',
      'CV format (text)': 'txt'
    };

    // Single record id to export (injected from directive attribute)
    vm.recid = recid;

    // This will contain the export text
    vm.exportContent = null;

    // Keeps loading state
    vm.loading = false;
    
    // Format to export
    vm.exportFormat = 'BibTex';

    vm.changeFormat = changeFormat;

    vm.closeModal = closeModal;

    vm.loadFormat = loadFormat;

    vm.downloadFormat = downloadFormat;

    // Run initial import
    activate();

    function activate() {
      vm.loadFormat();
    }

    function closeModal() {
      $uibModalInstance.close();
    }

    function changeFormat(format) {
      vm.exportContent = '';
      vm.exportFormat = format;
    }

    function downloadFormat(){
      var blob = new Blob([ vm.exportContent ], { type : 'text/plain' });
      var response_data = 'text/plain;charset=utf-8,' + encodeURIComponent(vm.exportContent);
      var trigger_element =angular.element('<a id="data-download" href="data:' +
          response_data + '" download="' + vm.exportFormat +
          '.' + vm.formats[vm.exportFormat] + '">download</a>');
      trigger_element[0].click();
    }

    function exportFormatChanged(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }

      vm.loadFormat();
    }

    function loadFormat() {

      vm.loading = true;

      var exportRecids = [];

      if ( vm.recid ) {
        exportRecids.push(vm.recid);        
      }
      else {
        exportRecids = exportRecords.getIdsToExport();
      }

      // Access current search page parameters
      var invenioSearchCurrentArgs = $scope.$parent.vm.invenioSearchCurrentArgs;
      
      exportAPI
          .getFormat(invenioSearchCurrentArgs, vm.exportFormat, exportRecids)
          .then(successfulRequest, erroredRequest)
          .finally(clearRequest);      

      function successfulRequest(response) {
        vm.exportContent = response.data;
        
      }

      function erroredRequest(data) {
        console.log('Error request');
      }

      function clearRequest() {
        vm.loading = false;
      }
    }

    $scope.$watch('vm.exportFormat', exportFormatChanged);
   
  }

  exportModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'exportAPI', 'exportRecords', 'recid'];

  angular.module('export.controllers', [])
    .controller('exportModalInstanceCtrl', exportModalInstanceCtrl);

})(angular);
