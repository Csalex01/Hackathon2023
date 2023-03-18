import * as ol from './ol*';

import { Feature } from "https://cdn.skypack.dev/ol"
import { Point } from "https://cdn.skypack.dev/ol/geom"

import { fromLonLat, transform } from 'https://cdn.skypack.dev/ol/proj'
import { Control, defaults as defaultControls } from "https://cdn.skypack.dev/ol/control"

import "./utils.js"
import { HomeButtonControl, mousePositionControl, epsg3857toEpsg4326 } from "./utils.js"

const loc = JSON.parse(sessionStorage.getItem("current_location"))

let markers = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/64/map-marker-icon.png'
        })
    })
});

const map = new ol.Map({
    controls: ol.control.defaults().extend([
        new HomeButtonControl(),
        mousePositionControl
    ]),
    layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        markers
    ],
    view: new ol.View({
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
