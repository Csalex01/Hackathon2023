from flask import render_template, url_for, flash, redirect, request, Blueprint
from FlatRoute import *

# Initialize blueprint
general = Blueprint("general", __name__)

@general.route("/")
def index():
    return render_template("home/index.html")