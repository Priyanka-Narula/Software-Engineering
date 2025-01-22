from flask import current_app as app
from backend.model import db
from flask_security import SQLAlchemyUserDatastore
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name='admin', description='Admin')
    userdatastore.find_or_create_role(name='instructor', description='Instructor')
    userdatastore.find_or_create_role(name='student', description='Student')

    admin_mail = 'admin@app.com'
    admin_pass = '1234'
    instructor_mail = 'instructor@app.com'
    instructor_pass = '1234'
    student_mail = 'student@app.com'
    student_pass = '1234'
    
    
    if not userdatastore.find_user(email=admin_mail):
        userdatastore.create_user(name = 'Dummy Admin',email=admin_mail, password=generate_password_hash(admin_pass), roles=['admin'])
    if not userdatastore.find_user(email=instructor_mail):
        userdatastore.create_user(name = 'Dummy Instructor' ,email=instructor_mail, password=generate_password_hash(instructor_pass), roles=['instructor'])
    if not userdatastore.find_user(email=student_mail):
        userdatastore.create_user(name = 'Dummy Student',email=student_mail, password=generate_password_hash(student_pass), roles=['student'])

    db.session.commit()


