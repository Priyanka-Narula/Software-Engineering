# backend/router.py

from flask import current_app as app, jsonify, render_template,  request
from flask_security import auth_required,  current_user
from backend.model import User, db
from datetime import datetime as dt
from backend.create_initial_data import userdatastore
from werkzeug.security import check_password_hash , generate_password_hash

datastore = app.security.datastore


@app.route('/')
def home():
    return render_template('index.html')



@app.post('/login')
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is empty. Please provide email and password."}), 400
    
    email = data.get('email')
    password = data.get('password')

    if not email:
        return jsonify({"message": "Email is required. Please provide a valid email address."}), 400
    if not password:
        return jsonify({"message": "Password is required. Please provide your password."}), 400

    user = userdatastore.find_user(email=email)
    if not user:
        return jsonify({"message": f"No account found for '{email}'. Please sign up to create a new account."}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password. Please try again."}), 400

    user.last_login_at = dt.now()
    db.session.commit()
    return jsonify({
        "message": "Login successful!",
        "token": user.get_auth_token(),
        "email": user.email,
        "role": user.roles[0].name
    }), 200



# student_registration

@app.post('/student_registration')
def student_registration():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is empty. Please provide all required fields: name, email, and password."}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "All fields required. Please fill all fields."}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"message": f"An account with the email '{email}' already exists. Please log in."}), 400

    user_role = userdatastore.find_or_create_role(name='student')
    userdatastore.create_user(
        name=name,
        email=email,
        password=generate_password_hash(password),  
        roles=[user_role]
    )
    db.session.commit()

    return jsonify({
        "message": "Account created successfully! You can now log in.",
        "user": {
            "name": name,
            "email": email,
            "role": "student"
        }
    }), 201
