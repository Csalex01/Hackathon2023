import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js'
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js'
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js'

import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';

import { Style, Icon, Fill, Stroke } from "https://cdn.skypack.dev/ol/style"

import { Feature } from "https://cdn.skypack.dev/ol"

import { Point, LineString } from "https://cdn.skypack.dev/ol/geom"

import { fromLonLat, transform } from 'https://cdn.skypack.dev/ol/proj'
import { defaults as defaultControls } from "https://cdn.skypack.dev/ol/control"

import "./utils.js"
import { HomeButtonControl, mousePositionControl, epsg3857toEpsg4326 } from "./utils.js"

const loc = JSON.parse(sessionStorage.getItem("current_location"))

let markers = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/32/map-marker-icon.png'
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

let dataA = undefined
let dataB = undefined

document.getElementById("search-button").addEventListener("click", async () => {
    let pointA = document.getElementsByName("point_A")[0].value
    let pointB = document.getElementsByName("point_B")[0].value

    const responseA = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${pointA}&format=jsonv2`)
    dataA = await responseA.json()

    const responseB = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${pointB}&format=jsonv2`)
    dataB = await responseB.json()

    dataA = dataA[0]
    dataB = dataB[0]

    console.log(dataA)
    console.log(dataB)

    markers.getSource().addFeature(new Feature(new Point(fromLonLat([dataA.lon, dataA.lat]))));
    markers.getSource().addFeature(new Feature(new Point(fromLonLat([dataB.lon, dataB.lat]))));

    const midpoint = {
        lat: (parseFloat(dataA.lat) + parseFloat(dataB.lat)) / 2,
        lon: (parseFloat(dataA.lon) + parseFloat(dataB.lon)) / 2
    }

    const dist = Math.sqrt(
        Math.pow(parseFloat(dataA.lat) - parseFloat(dataB.lat), 2) +
        Math.pow(parseFloat(dataA.lon) - parseFloat(dataB.lon), 2)
    )

    console.log(`Distance: ${dist}`)

    map.getView().setCenter(fromLonLat([midpoint.lon, midpoint.lat]))

    const routeResponse = await fetch(`/find_route?point_a=${JSON.stringify({
        lon: dataA.lon,
        lat: dataA.lat
    })}&point_b=${JSON.stringify({
        lon: dataB.lon,
        lat: dataB.lat
    })}`)

    const routesJSON = await routeResponse.json()
    let coordinates = routesJSON.features[0].geometry.coordinates

    coordinates = coordinates.map(el => epsg3857toEpsg4326(fromLonLat([el[1], el[0]])))

    console.log(coordinates)

    let featureLine = new Feature({
        geometry: new LineString(coordinates)
    })


    let vectorLine = new VectorSource({});
    vectorLine.addFeature(featureLine);

    var vectorLineLayer = new VectorLayer({
        source: vectorLine,
        style: new Style({
            fill: new Fill({ color: '#FF0000', weight: 4 }),
            stroke: new Stroke({ color: '#FF0000', width: 4 })
        })
    });

    map.addLayer(vectorLineLayer);
})


