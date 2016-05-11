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

describe('Check export service', function() {
  
  beforeEach(angular.mock.module('export'));

  var _exportAPI;
  var $httpBackend;
  var invenioSearchCurrentArgs

  beforeEach(inject(
    function (_$httpBackend_, exportAPI) {
      $httpBackend = _$httpBackend_;
      _exportAPI = exportAPI;

      invenioSearchCurrentArgs = {
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

      var response_bibtex = {
        data: 'My BibTex'
      };

      var response_latexeu = {
        data: 'My Latex EU'
      };

      var response_latexus = {
        data: 'My Latex US'
      };

      var response_cvformatlatex = {
        data: 'My CV Latex'
      };

      var response_cvformathtml = {
        data: 'My CV HTML'
      };

      var response_cvformattext = {
        data: 'My CV Text'
      };

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-bibtex'
      }
      ).respond(200, response_bibtex);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexeu'
      }
      ).respond(200, response_latexeu);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexus'
      }
      ).respond(200, response_latexus);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-cvformatlatex'
      }
      ).respond(200, response_cvformatlatex);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-cvformathtml'
      }
      ).respond(200, response_cvformathtml);

      $httpBackend.whenGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-cvformattext'
      }
      ).respond(200, response_cvformattext);
    }
  ))

  describe('Getting formats', function () {
    it('should send the correct API calls', function () {
      _exportAPI.getFormat(invenioSearchCurrentArgs, 'BibTex', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-bibtex'
      });

      $httpBackend.flush();

      _exportAPI.getFormat(invenioSearchCurrentArgs, 'LaTex(EU)', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexeu'
      });

      $httpBackend.flush();

       _exportAPI.getFormat(invenioSearchCurrentArgs, 'LaTex(EU)', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexeu'
      });

      $httpBackend.flush();

       _exportAPI.getFormat(invenioSearchCurrentArgs, 'LaTex(US)', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-latexus'
      });

      $httpBackend.flush();

       _exportAPI.getFormat(invenioSearchCurrentArgs, 'CV format (LaTex)', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-cvformatlatex'
      });

      $httpBackend.flush();

       _exportAPI.getFormat(invenioSearchCurrentArgs, 'CV format (html)', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-cvformathtml'
      });

      $httpBackend.flush();

       _exportAPI.getFormat(invenioSearchCurrentArgs, 'CV format (text)', ['123']);

      $httpBackend.expectGET('/api/literature/?page=1&q=control_number:123&size=25', {
        'Accept': 'application/x-cvformattext'
      });

      $httpBackend.flush();
    });
  })

});