import Map from "./ol/Map.js"
import View from './ol/View.js'
import OSM from './ol/source/OSM.js'
import TileLayer from './ol/layer/Tile.js'
import { fromLonLat } from './ol/proj.js'

navigator.geolocation.getCurrentPosition(pos => {
    let coords = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
    }

    sessionStorage.setItem("current_location", JSON.stringify(coords))
})

const loc = JSON.parse(sessionStorage.getItem("current_location"))

console.log(loc)

const source = new OSM();
const layer = new TileLayer({ source: source });
const view = new View({
    center: fromLonLat([loc.lon, loc.lat]),
    zoom: 15
})

const map = new Map({
    layers: [layer],
    view: view,
    target: 'map',
});