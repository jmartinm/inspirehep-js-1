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
