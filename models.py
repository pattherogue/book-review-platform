# models.py
from create_app import db
from datetime import datetime

class Cart(db.Model):
    cart_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    book_id = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    transaction_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    book_id = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    title = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
