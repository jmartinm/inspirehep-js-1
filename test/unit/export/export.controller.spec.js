/*
 * This file is part of INSPIRE.
 * Copyright (C) 2016 CERN.
 *
 * INSPIRE is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

describe('Controller: ExportInstanceCtrl', function () {

  beforeEach(angular.mock.module('export'));
  beforeEach(angular.mock.module('checkbox'));

  var $controller;
  var $httpBackend;
  var $rootScope;
  var ctrl;
  var scope;
  var modalInstance;
  var sandbox;
  var _exportRecords;

  beforeEach(inject(
    function (_$httpBackend_, _$rootScope_, _$controller_, exportAPI, exportRecords) {
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      scope = $rootScope;
      _exportRecords = exportRecords;

      sandbox = sinon.sandbox.create();

      modalInstance = { // Create a mock object using sinon spies
        close: sinon.spy(),
        dismiss: sinon.spy(),
        result: {
          then: sinon.spy()
        }
      };

      scope.$parent = {}
      scope.$parent.vm = {}
      scope.$parent.vm.invenioSearchCurrentArgs = {
        "method": "GET",
        "params": {
          "page": 1,
          "size": 25,
          "q": ""
        },
        "url": "/api/literature/",
        "headers": {
          "Accept": "application/vnd+inspire.brief+json"
        }
      }

      ctrl = $controller('exportModalInstanceCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        exportAPI: exportAPI,
        recid: '123',
      });

      // Needed for scope.$digest() to work when using Controller-as syntax
      scope.vm = ctrl;

      var response_bibtex = {
        data: 'My BibTex'
      };

      var response_multiple_bibtex = {
        data: 'My BibTex\nMy other BibTex'
      };

      var response_latexeu = {
        data: 'My LaTeX EU'
      };

      var response_latexus = {
        data: 'My LaTeX EU'
      };

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-bibtex'
      }
      ).respond(200, response_bibtex);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123+OR+control_number:555&size=25', {
        'Accept': 'application/x-bibtex'
      }
      ).respond(200, response_multiple_bibtex);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexeu'
      }
      ).respond(200, response_latexeu);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexus'
      }
      ).respond(200, response_latexus);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:500&size=25', {
        'Accept': 'application/x-bibtex'
      }
      ).respond(500, {success: false});

    })
  );

  afterEach(function () {
    sandbox.restore();
  });

  describe('Initial state', function () {
    it('should instantiate the controller properly', function () {
      expect(ctrl).to.not.be.undefined;
    });

    it('should close the modal', function () {
      ctrl.closeModal();
      expect(modalInstance.close).to.have.been.called;
    });
  });

  describe('Loading formats', function () {
    it('should send an initial request to load a format', function () {

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-bibtex'
      });

      $httpBackend.flush();
    });

    it('should send the appropriate request based on the selected format', function () {
      
      // Flush initial request
      $httpBackend.flush();

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexus'
      });

      ctrl.changeFormat('LaTex(US)');

      $httpBackend.flush();

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexeu'
      });

      ctrl.changeFormat('LaTex(EU)');

      // This allows $watch expressions to run- for 100% coverage
      scope.$digest();

      $httpBackend.flush();
    });

    it('should run error callback when there is an export error', function () {

      ctrl.recid = '500';

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:500&size=25', {
        'Accept': 'application/x-bibtex'
      });

      ctrl.loadFormat();

      $httpBackend.flush();
    });

    it('should work with multiple ids', function () {

      sandbox.stub(_exportRecords, 'getIdsToExport').returns(['123', '555']);

      ctrl.recid = undefined;

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123+OR+control_number:555&size=25', {
        'Accept': 'application/x-bibtex'
      });

      ctrl.loadFormat();

      $httpBackend.flush();
      
      expect(_exportRecords.getIdsToExport.calledOnce).to.equal(true);
    });

    it('should download a given format', function () {

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-bibtex'
      });

      $httpBackend.flush();

      ctrl.downloadFormat();
    });


  });




});