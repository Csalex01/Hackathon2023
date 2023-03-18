from flask import render_template, url_for, flash, redirect, request, Blueprint
from FlatRoute import *
import json
import openrouteservice as ors

# Initialize blueprint
general = Blueprint("general", __name__)

@general.route("/")
def index():
    return render_template("home/index.html")

@general.route("/find_route")
def find_route():
    point_a = json.loads(request.args.get("point_a"))
    point_b = json.loads(request.args.get("point_b"))

    coords = [
        (point_a["lon"], point_a["lat"]),
        (point_b["lon"], point_b["lat"])
    ]

    client = ors.Client('5b3ce3597851110001cf62489e4d077cabd84d33bf9c6992a077bfac')
    routes = client.directions(coords, profile='wheelchair',
                                       format="geojson", 
                                       optimize_waypoints=True,
                                       geometry_simplify=True,
                                       options={
                                        "avoid_features": ["ferries","steps"],
                                        "profile_params": {
                                            "restrictions": {
                                                "surface_type": "cobblestone:flattened",
                                                "track_type": "grade1",
                                                "smoothness_type": "good",
                                                #"maximum_sloped_curb": 0.06,
                                                "maximum_incline": 2
                                            }
                                        }
                                    }
                              )

    return routes, 200
