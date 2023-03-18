from flask import render_template, url_for, flash, redirect, request, Blueprint
from FlatRoute import *

# Initialize blueprint
general = Blueprint("general", __name__)

@general.route("/")
def index():
    return render_template("home/index.html")

@general.route("/find_route")
def find_route():
    print(request.args.get("point_a"))    
    print(request.args.get("point_b"))    

    return "Success", 200