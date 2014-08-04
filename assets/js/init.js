var gbBounds = new OpenLayers.Bounds( 0, 0, 700000, 1300000 );

var map = new OpenLayers.Map({
  div: 'js-map',
  maxExtent: gbBounds,
  restrictedExtent: gbBounds
});

var layer = new OpenLayers.Layer.OpenSpace({
  name: 'OpenSpace',
  apiKey: 'INSERT_YOUR_API_KEY_HERE', // Your API key from registration
  referrer: 'file:///' // file:/// for local development. Switch to your registered website URL when live
});

map.addLayer( layer );

map.setCenter( new OpenLayers.LonLat([ 437324, 115386 ]), 4 );
