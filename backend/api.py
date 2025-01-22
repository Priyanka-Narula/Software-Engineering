# backend/api.py

from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.model import * 


api = Api(prefix='/api')

