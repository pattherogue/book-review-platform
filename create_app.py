# create_app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        # Import models here to ensure they are registered before creating tables
        from models import Cart, Transaction
        db.create_all()
        print("Tables created")

    return app

if __name__ == '__main__':
    create_app()
