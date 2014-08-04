## OpenLayers 2 WMS Layer with Ordnance Survey's OpenSpace Map Tile Service

![Ordnance Survey's OpenSpace Map Tiles](https://github.com/os-toolkit/ol-openspace/blob/master/assets/imgs/openspace-screenshot.png "Ordnance Survey's OpenSpace Map Tiles")

### Setup Instructions &amp; Options

We've tried to make this as painless as possible for you, so you can get on with your other website duties.

#### Requirements

1. An API key (yes, it's a pain but you need one)
2. OpenLayers 2 - we use `v2.13.1` for our demo
3. Our custom OpenLayers WMS Layer (`OpenLayers.Layer.OpenSpace`), see `assets/js/openspace.js`

Viewing our `demo.html` page is the best way to learn how to implement the OpenSpace map tile service into your website. But for clarity, we'll break it down for you below.

#### Retain an API key

Before you continue, please [apply for an API key](https://openspaceregister.ordnancesurvey.co.uk/osmapapi/register.do) if you haven't done so already. Once you've received your API key you can proceed to the next section.

#### Include CSS

Include our stylesheet (`assets/css/style.css`). The CSS is relatively basic, it provides a map wrapper and inside of that the map element. It applies a width and height to the map, which ensures the map displays correctly.

In particular, here's the following CSS for the copyright attribute, which tries to make it a little more inconspicuous.

```css
.olControlAttribution {
  bottom: 3px !important;
  right: 3px !important;
  background: #fff; /* fallback */
  background: rgba(255,255,255,0.7);
  border-radius: 3px;
  padding: 5px;
  font-size: 10px !important;
}
```

Our CSS rules are up for grabs, so modify as you like. But remember the map **copyright attribution is required** for compliance with the service from Ordnance Survey.

#### Include Scripts

Next up, include the JavaScript into the HTML. We need OpenLayers 2 and the OpenSpace plugin:

```html
<script src="http://openlayers.org/api/2.13.1/OpenLayers.js"></script>
<script src="assets/js/openspace.js"></script>
```

#### Initialise

And finally, like any other plugin, we need to initialise the plugin with some configuration options specific to your website. We put all this stuff inside of (`assets/js/init.js`).

Firstly, create an OpenLayers map instance. This is all standard OpenLayers syntax:

```javascript
var gbBounds = new OpenLayers.Bounds( 0, 0, 700000, 1300000 );

var map = new OpenLayers.Map({
  div: 'js-map',
  maxExtent: gbBounds,
  restrictedExtent: gbBounds
});
```

For good measure, we've set up the Great Britain bounds (`gbBounds`) and applied it to the new map instance to avoid the user dragging the map into un-tiled territory. We don't want them to get lost now, do we!?

Now we initialise our OpenSpace plugin by passing a custom configuration object:

```javascript
var layer = new OpenLayers.Layer.OpenSpace({
  name: 'OpenSpace',
  apiKey: 'INSERT_YOUR_API_KEY_HERE',
  referrer: 'http://example.com'
});
```

- *Optionally* add a layer name into the `name` property. Defaults to 'OpenSpace' anyway
- Insert your API key into the placeholder for the `apiKey` property. No default here.
- Add your website into the `referrer` property. This is the **website URL that you registered** for use with your OpenSpace API key. When developing locally from the `file:///` protocol, you can change the referrer value to `file:///` and it'll work just the same. There is no default for referrer.

Just like any other OpenLayers WMS Layer, you can also pass a `params` and `options` object. For example:

```javascript
var layer = new OpenLayers.Layer.OpenSpace({
  name: 'OpenSpace',
  apiKey: 'INSERT_YOUR_API_KEY_HERE',
  referrer: 'http://example.com',
  params: {
    isBaseLayer: false
  },
  options: {
    opacity: 0.5
  }
});
```

Your custom `params` and `options` will be included in the layer creation.

Finish up by adding the layer to the map with a centre position (using eastings and northings):

```javascript
map.addLayer( layer );
map.setCenter( new OpenLayers.LonLat([ 437324, 115386 ]), 4 );
```

And that's it! As mentioned earlier, please check out our `demo.html` page to see how we've done it.

Questions, suggestions and contributions are always welcome.
