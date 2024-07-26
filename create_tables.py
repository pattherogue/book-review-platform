from create_app import create_app

app = create_app()

with app.app_context():
    from models import db  # Import db here to avoid circular imports
    db.create_all()
