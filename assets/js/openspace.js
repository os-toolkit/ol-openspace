/*
 * Ordnance Survey OpenSpace
 * Crown Copyright and database right 2012. All rights reserved.
 * http://openspace.ordnancesurvey.co.uk/openspace/developeragreement.html
 *
 * OS Toolkit ol-openspace project
 * Copyright 2014 by OS Toolkit ol-openspace Contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @requires OpenLayers/Layer/WMS.js
 */

/**
 * Class: OpenLayers.Layer.OpenSpace
 * This layer allows access to the free Ordnance Survey's
 * OpenSpace map tile service of Great Britain
 */
OpenLayers.Layer.OpenSpace = OpenLayers.Class( OpenLayers.Layer.WMS, {

    /**
     * Property: serverResolutions
     * {Array(Number)} This property is documented in subclasses as
     *    an API property.
     */
    serverResolutions: [ 2500, 1000, 500, 200, 100, 50, 25, 10, 5, 4, 2.5, 2, 1 ],

    /**
     * APIProperty: maxExtent
     * {<OpenLayers.Bounds>|Array}
     */
    maxExtent: new OpenLayers.Bounds( 0, 0, 700000, 1300000 ),

    /**
     * APIProperty: projection
     * {<OpenLayers.Projection>} or {<String>} Specifies the projection of the layer.
     */
    projection: new OpenLayers.Projection( 'EPSG:27700' ),

    /**
     * APIProperty: units
     * {String}
     */
    units: 'm',

    /**
     * CustomProperty: URL
     * {String} URL of Ordnance Survey's OpenSpace map tile service
     */
    url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/ts',

    /**
     * Method: moveTo
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo: function( bounds, zoomChanged, dragging ) {
      
      if( zoomChanged ) {

        var res = this.resolutions[ this.map.getZoom() ];

        // Resolutions 1, 2 and 4 have a tile size of 250x250.
        // All other resolutions have a tile size of 200x200.
        // See the section named 'Mapping Layers and Look-ups' below for more details:
        // http://www.ordnancesurvey.co.uk/business-and-government/help-and-support/web-services/os-ondemand/configuring-wmts.html
        if( /^[124]$/.test( res ) ) {
          if( this.tileSize.h !== 250 ) {
            this.tileSize = new OpenLayers.Size( 250, 250 );
          }
        }
        else {
          if( this.tileSize.h !== 200 ) {
            this.tileSize = new OpenLayers.Size( 200, 200 );
          }
        }

        // Send the resolution along with the tile request
        this.params.LAYERS = res;

      }
      
      return OpenLayers.Layer.Grid.prototype.moveTo.apply( this, arguments );
    },

    /**
     * Constructor: OpenLayers.Layer.OpenSpace
     *
     * Parameters:
     * config - {Object} Configuration options
     */
    initialize: function( config ) {

      // Check that a config object has been passed in
      if( typeof config !== 'object' ) {
        throw new Error( 'OpenLayers.Layer.OpenSpace: Expected config object' );
      }

      // Check that an API key is present
      if( typeof config.apiKey !== 'string' ) {
        throw new Error( 'OpenLayers.Layer.OpenSpace: Expected API key' );
      }

      // Check that a referrer is present
      if( typeof config.referrer !== 'string' ) {
        throw new Error( 'OpenLayers.Layer.OpenSpace: Expected referrer' );
      }

      // Merge any custom params with our own
      var params = OpenLayers.Util.extend({
        format: 'image/png',
        key: config.apiKey,
        url: config.referrer
      }, config.params );

      // Mandatory attribution
      var attribution = "&copy; Crown Copyright and database right 2012. All rights reserved. " +
        "<a target='_blank' href='http://openspace.ordnancesurvey.co.uk/openspace/developeragreement.html'>" +
        "End User License Agreement</a>";

      // Merge any custom options with our own
      var options = OpenLayers.Util.extend({
        restrictedExtent: new OpenLayers.Bounds( 0, 0, 700000, 1300000 ),
        resolutions: this.serverResolutions,
        numZoomLevels: this.serverResolutions.length,
        transitionEffect: null, // Disable the default 'resize' transition as it interferes when the tile size gets changed
        attribution: attribution
      }, config.options );
    
      // Apply the new arguments to the WMS class
      OpenLayers.Layer.WMS.prototype.initialize.apply( this, [ config.name || 'OpenSpace', this.url, params, options ] );

    },

    CLASS_NAME: "OpenLayers.Layer.OpenSpace"

});
