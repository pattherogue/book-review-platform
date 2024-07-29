from flask import Flask, request, jsonify, render_template
import requests
from create_app import create_app, db
from models import Cart, Transaction
from datetime import datetime


app = create_app()

# Define database models here or in a separate models file

# Google Books API configuration
GOOGLE_BOOKS_API_KEY = 'AIzaSyB-ihBh7hsTBoFXtN86YaGtVrHaqKL0SWU'
GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes'

def get_book_price(book_id):
    response = requests.get(f'{GOOGLE_BOOKS_API_URL}/{book_id}?key={GOOGLE_BOOKS_API_KEY}')
    book_data = response.json()
    return book_data.get('saleInfo', {}).get('listPrice', {}).get('amount', 0)

def get_book_title(book_id):
    response = requests.get(f'{GOOGLE_BOOKS_API_URL}/{book_id}?key={GOOGLE_BOOKS_API_KEY}')
    book_data = response.json()
    return book_data.get('volumeInfo', {}).get('title', '')

# API Endpoints

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.json
    required_keys = ['user_id', 'book_id', 'quantity']
    for key in required_keys:
        if key not in data:
            return jsonify({"error": f"Missing key: {key}"}), 400

    new_cart_item = Cart(user_id=data['user_id'], book_id=data['book_id'], quantity=data['quantity'])
    db.session.add(new_cart_item)
    db.session.commit()
    
    return jsonify({"message": "Book added to cart"}), 201

@app.route('/api/cart/<user_id>', methods=['GET'])
def view_cart(user_id):
    items = Cart.query.filter_by(user_id=user_id).all()
    result = []
    for item in items:
        result.append({
            "cart_id": item.cart_id,
            "book_id": item.book_id,
            "quantity": item.quantity,
            "date_added": item.date_added
        })
    return jsonify(result), 200

@app.route('/api/transaction/place', methods=['POST'])
def place_order():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "No items in cart"}), 404

    for item in cart_items:
        transaction = Transaction(
            user_id=user_id,
            book_id=item.book_id,
            price=get_book_price(item.book_id),
            title=get_book_title(item.book_id),
            date=datetime.utcnow()
        )
        db.session.add(transaction)
        db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Order placed successfully"}), 201

@app.route('/api/transaction/<user_id>', methods=['GET'])
def view_orders(user_id):
    orders = Transaction.query.filter_by(user_id=user_id).all()
    result = []
    for order in orders:
        result.append({
            "transaction_id": order.transaction_id,
            "book_id": order.book_id,
            "title": order.title,
            "price": order.price,
            "date": order.date
        })
    return jsonify(result), 200

@app.route('/api/transaction/<transaction_id>', methods=['DELETE'])
def cancel_order(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Order cancelled successfully"}), 200

@app.route('/api/cart/edit', methods=['PUT'])
def edit_cart_item():
    data = request.json
    cart_item = Cart.query.get_or_404(data['cart_id'])
    cart_item.quantity = data['quantity']
    db.session.commit()
    return jsonify({"message": "Cart item updated successfully"}), 200

@app.route('/api/transaction/count/<book_id>', methods=['GET'])
def get_book_orders_count(book_id):
    count = Transaction.query.filter_by(book_id=book_id).count()
    return jsonify({"book_id": book_id, "order_count": count}), 200

if __name__ == '__main__':
    app.run(debug=True)
