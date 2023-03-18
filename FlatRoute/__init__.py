from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

from os import path

# Initialize app with the current package name
app = Flask(__name__)

# Create database
db = SQLAlchemy()
DB_NAME = "database.db"

# Secret key for encryption
app.config["SECRET_KEY"] = "985230d0ce098c081e5b5b70f9797064"
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

# Import blueprints
from FlatRoute.general import general

app.register_blueprint(general, url_prefix="/")

# # Initialize Database
# db.init_app(app=app)

# # Create .db file if it does not exist.
# if not path.exists(f"AttendanceManager/{DB_NAME}"):
#   db.create_all(app=app)
#   init_database()
#   print("DATABASE CREATED!")