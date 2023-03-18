import { Control, defaults as defaultControls } from "./ol/control.js"
import MousePosition from './ol/control/MousePosition.js';
import { createStringXY } from './ol/coordinate.js';
import { fromLonLat } from './ol/proj.js'

document.querySelector(".closeButton").addEventListener("click", () => {
    document.querySelector(".popup").style.display = "none"
})

class HomeButtonControl extends Control {
    constructor(opt_options) {
        const options = opt_options || {}

        const button = document.createElement('button');
        button.innerHTML = 'H';

        const element = document.createElement('div');
        element.className = 'home-button rotate-north ol-unselectable ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: options.target
        })

        button.addEventListener('click', this.handle.bind(this), false);
    }

    handle() {
        let loc = JSON.parse(sessionStorage.getItem("current_location"))

        this.getMap().getView().setCenter(fromLonLat([loc.lon, loc.lat]))
        this.getMap().getView().setZoom(15)
    }
}

const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
});

const epsg3857toEpsg4326 = (pos) => {
    let x = pos[0];
    let y = pos[1];
    x = (x * 180) / 20037508.34;
    y = (y * 180) / 20037508.34;
    y = (Math.atan(Math.pow(Math.E, y * (Math.PI / 180))) * 360) / Math.PI - 90;
    return [x, y];
}

navigator.geolocation.getCurrentPosition(pos => {
    let coords = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
    }

    sessionStorage.setItem("current_location", JSON.stringify(coords))
}, (error) => alert(error), { enableHighAccuracy: true })

export {
    HomeButtonControl,
    mousePositionControl,
    epsg3857toEpsg4326
}