import Map from "./ol/Map.js"
import View from './ol/View.js';
import OSM from './ol/source/OSM.js';
import TileLayer from './ol/layer/Tile.js';

const source = new OSM();
const layer = new TileLayer({ source: source });
const view = new View({
    center: [0, 0],
    zoom: 2
})

const map = new Map({
    layers: [layer],
    view: view,
    target: 'map',
});