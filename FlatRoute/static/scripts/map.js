import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js'
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js'
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js'

import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';

import { Style, Icon } from "https://cdn.skypack.dev/ol/style"

import { Feature } from "https://cdn.skypack.dev/ol"
import { Point } from "https://cdn.skypack.dev/ol/geom"

import { fromLonLat, transform } from 'https://cdn.skypack.dev/ol/proj'
import { Control, defaults as defaultControls } from "https://cdn.skypack.dev/ol/control"

import "./utils.js"
import { HomeButtonControl, mousePositionControl, epsg3857toEpsg4326 } from "./utils.js"

const loc = JSON.parse(sessionStorage.getItem("current_location"))

let markers = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/64/map-marker-icon.png'
        })
    })
});

const map = new Map({
    controls: defaultControls().extend([
        new HomeButtonControl(),
        mousePositionControl
    ]),
    layers: [
        new TileLayer({ source: new OSM() }),
        markers
    ],
    view: new View({
        center: fromLonLat([loc.lon, loc.lat]),
        zoom: 15
    }),
    target: 'map'
});

map.on("click", (evt) => {
    let clicked_pos = epsg3857toEpsg4326(evt.coordinate)
    console.log(clicked_pos)
    markers.getSource().addFeature(new Feature(new Point(fromLonLat([clicked_pos[0], clicked_pos[1]]))));
})