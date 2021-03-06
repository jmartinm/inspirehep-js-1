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

'use strict';

describe('Check citemodal directive', function() {

  var $compile;
  var $rootScope;
  var $httpBackend;
  var scope;
  var template;

  // Load the templates
  beforeEach(angular.mock.module('templates'));

  // Inject the angular module
  beforeEach(angular.mock.module('citemodal'));

  beforeEach(
    inject(function(_$compile_, _$rootScope_, _$httpBackend_) {

      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;

      scope = $rootScope;

      template = ' <inspire-cite-modal button-template="src/inspirehep-js/citemodal/templates/button.html"' +
                 ' body-template="src/inspirehep-js/citemodal/templates/modalbody.html"' +
                 ' recid=123> </inspire-cite-modal>';

      var response = {
        data: "Test"
      };

      // Expect a request
      $httpBackend.whenGET('/api/literature/123').respond(200, response);
      
      // Compile
      template = $compile(template)(scope);

      // Digest
      scope.$digest();
    })
  );

  it('should call the modal open function', inject(function($uibModal) {
    var spy = sinon.spy($uibModal, "open");
    template.find('[type=button]').eq(0).triggerHandler('click');
    expect(spy).to.have.been.called;
  }));

});
