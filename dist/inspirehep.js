(function(angular) {

  angular.module('inspirehep', [
    'export',
    'checkbox'
  ]);

})(angular);

(function(angular) {

  angular.module('checkbox', [
    'checkbox.controllers',
    'checkbox.services'
  ]);

})(angular);

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
      if (!$scope.$parent.vm.invenioSearchResults.hits) {
        return false;
      }
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

(function(angular) {

  function exportRecords() {

    var recids = [];
    var service = {
      addIdToExport: addIdToExport,
      removeIdFromExport: removeIdFromExport,
      toggleIdToExport: toggleIdToExport,
      getIdsToExport: getIdsToExport
    };

    return service;

    function getIdxForRecid(recid) {
      return recids.indexOf(recid);
    }

    function addRecid(idx, recid) {
      if (idx === -1) {
        recids.push(recid);
      }
    }

    function removeRecid(idx, recid) {
      if (idx > -1) {
        recids.splice(idx, 1);
      }
    }
    
    function addIdToExport(recid) {
      var idx = getIdxForRecid(recid);
      addRecid(idx, recid);
    }

    function removeIdFromExport(recid) {
      var idx = getIdxForRecid(recid);
      removeRecid(idx, recid);
    }    

    function toggleIdToExport(recid) {            
      var idx = getIdxForRecid(recid);
      if (idx > -1) {
        removeRecid(idx, recid);
      } else {
        addRecid(idx, recid);
      }
    }

    function getIdsToExport(){
      return recids;
    }
   
  }

  angular.module('checkbox.services', [])
    .service('exportRecords', exportRecords);

})(angular);

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

      var invenioSearchCurrentArgs;

      // Access current search page parameters or fall back to defaults
      if ( $scope.$parent.vm === undefined ) {
        invenioSearchCurrentArgs = {
          'method': 'GET',
          'params': {'q': ''},
          'url': '/api/literature/'
        };
      }
      else {
        invenioSearchCurrentArgs = $scope.$parent.vm.invenioSearchCurrentArgs;
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

(function(angular) {

  function inspireExportModal($uibModal) {

    function link(scope, element, attrs) {

      scope.openModal = function (size) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: attrs.bodyTemplate,
          size: size,
          controller: 'exportModalInstanceCtrl',
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

  inspireExportModal.$inject = ['$uibModal'];

  angular.module('export.directives', [])
    .directive('inspireExportModal', inspireExportModal);

})(angular);

(function(angular) {

  function exportAPI($http) {

    var service = {
      getFormat: getFormat
    };

    return service;

    function getFormat(http_params, format, ids) {

      var control_numbers = [];

      angular.forEach(ids, function(value, key) {
        control_numbers.push('control_number:' + value);
      });

      http_params['params']['q'] = control_numbers.join(' OR ');
      
      switch (format) {
        case 'BibTex':
          http_params['headers'] = {
            'Accept': 'application/x-bibtex'
          };
          break;
        case 'LaTex(EU)':
          http_params['headers'] = {
            'Accept': 'application/x-latexeu'
          };
          break;
        case 'LaTex(US)':
          http_params['headers'] = {
            'Accept': 'application/x-latexus'
          };
          break;
        case 'CV format (LaTex)':
          http_params['headers'] = {
            'Accept': 'application/x-cvformatlatex'
          };
          break;
        case 'CV format (html)':
          http_params['headers'] = {
            'Accept': 'application/x-cvformathtml'
          };
          break;
        case 'CV format (text)':
          http_params['headers'] = {
            'Accept': 'application/x-cvformattext'
          };
          break;
      }
      
      return $http(http_params);
    }
  
  }

  // Inject the necessary angular services
  exportAPI.$inject = ['$http'];

  angular.module('export.services', [])
    .service('exportAPI', exportAPI);

})(angular);
