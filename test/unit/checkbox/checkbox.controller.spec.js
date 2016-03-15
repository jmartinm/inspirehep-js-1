// /*
//  * This file is part of INSPIRE.
//  * Copyright (C) 2016 CERN.
//  *
//  * INSPIRE is free software; you can redistribute it and/or
//  * modify it under the terms of the GNU General Public License as
//  * published by the Free Software Foundation; either version 2 of the
//  * License, or (at your option) any later version.
//  *
//  * INSPIRE is distributed in the hope that it will be useful, but
//  * WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
//  * General Public License for more details.
//  *
//  * You should have received a copy of the GNU General Public License
//  * along with INSPIRE; if not, write to the Free Software Foundation, Inc.,
//  * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
//  *
//  * In applying this license, CERN does not
//  * waive the privileges and immunities granted to it by virtue of its status
//  * as an Intergovernmental Organization or submit itself to any jurisdiction.
//  */

describe('Controller: checkboxCtrl', function () {

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
    function (_$httpBackend_, _$rootScope_, _$controller_, exportRecords) {
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      scope = $rootScope;
      _exportRecords = exportRecords;

      scope.$parent = {}
      scope.$parent.vm = {}
      scope.$parent.vm.invenioSearchResults = {}
      scope.$parent.vm.invenioSearchResults.hits = {}
      scope.$parent.vm.invenioSearchResults.hits.hits = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]



      ctrl = $controller('checkboxCtrl', {
        $scope : scope,
        exportRecords: _exportRecords
      });

    })
  );

  describe('Initial state', function () {
    it('should instantiate the controller properly', function () {
      expect(ctrl).to.not.be.undefined;
    });

  });

  describe('Toggling IDs', function () {
    it('should toggle an individual record id correctly', function () {

      scope.toggleId(123);

      expect(_exportRecords.getIdsToExport()).to.deep.equal([123]);

      scope.toggleId(123);

      expect(_exportRecords.getIdsToExport()).to.deep.equal([]);

    });

    it('should toggle all ids correctly', function () {

      expect(_exportRecords.getIdsToExport()).to.deep.equal([]);
      expect(scope.anyChecked()).to.be.equal(false);

      scope.toggleAllIds();

      expect(_exportRecords.getIdsToExport()).to.deep.equal([1, 2, 3]);
      expect(scope.anyChecked()).to.be.equal(true);
      expect(scope.isChecked(1)).to.be.equal(true);

      scope.toggleAllIds();

      expect(_exportRecords.getIdsToExport()).to.deep.equal([]);

    });
  })

});