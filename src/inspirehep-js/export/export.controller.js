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
      var format_blob = new Blob([vm.exportContent], {type:'text/plain'});
      var linkElem = $('#download_hidden_link');
      var element = angular.element(linkElem);
      element.attr({
        href: window.URL.createObjectURL(format_blob),
        target: '_self',
        download: vm.exportFormat + '.' + vm.formats[vm.exportFormat]
      })[0].click();
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

      var invenioSearchCurrentArgs = {};

      // Access current search page parameters or fall back to defaults
      if ( $scope.$parent.vm === undefined ) {
        invenioSearchCurrentArgs = {
          'method': 'GET',
          'params': {'q': ''},
          'url': '/api/literature/'
        };
      }
      else {
        angular.copy($scope.$parent.vm.invenioSearchCurrentArgs,
                     invenioSearchCurrentArgs);
      }

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
