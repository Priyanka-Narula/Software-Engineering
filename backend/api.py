# backend/api.py

from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with , reqparse
from flask_security import auth_required, current_user , roles_required
from backend.model import * 


api = Api(prefix='/api')


class CourseAPI(Resource):
    
    post_parser = reqparse.RequestParser()
    post_parser.add_argument('course_name', type=str, required=True, help="Course name is required")
    post_parser.add_argument('credits', type=int, required=True, help="Credits are required")

    # @auth_required("token") 
    # @roles_required("admin")
    def post(self):
        args = self.post_parser.parse_args()
        course_name = args['course_name']
        credits = args['credits']

        existing_course = Course.query.filter_by(course_name=course_name).first()
        if existing_course:
            return {
                "message": f"Course '{course_name}' already exists."
            }, 400

        new_course = Course(
            course_name=course_name,
            credits=credits
        )

        db.session.add(new_course)
        db.session.commit()

        return {
            "message": "Course added successfully",
            "course": {
                "id": new_course.id,
                "course_name": new_course.course_name,
                "credits": new_course.credits
            }
        }, 201


    get_parser = reqparse.RequestParser()


    # @auth_required("token") 
    # @roles_required("admin")
    def get(self):
        courses = Course.query.all()

        all_courses = []
        for course in courses:
            all_courses.append({
                "id": course.id,
                "course_name": course.course_name,
                "instructor_id": course.instructor_id,
                "credits": course.credits
            })

        if len(all_courses) > 0:
            return all_courses, 200
        else:
            return {"message": "No courses found"}, 404

    

    put_parser = reqparse.RequestParser()
    put_parser.add_argument('id', type=int, required=True, help="Course ID is required")
    put_parser.add_argument('course_name', type=str, required=False, help="Course name is optional")
    put_parser.add_argument('credits', type=int, required=False, help="Credits are optional")
    put_parser.add_argument('instructor_id', type=int, required=False, help="Instructor ID is optional")

    # @auth_required("token") 
    # @roles_required("admin")
    def put(self):
        args = self.put_parser.parse_args()
        course_id = args['id']
        course = Course.query.get(course_id)

        if not course:
            return {"message": f"Course with ID {course_id} not found."}, 404

        if args['course_name']:
            course.course_name = args['course_name']
        if args['credits'] is not None:
            course.credits = args['credits']
        if args.get('instructor_id') is not None:
            instructor_id = args['instructor_id']
            
            instructor = User.query.filter_by(id=instructor_id).first()
            if not instructor:
                return {"message": f"Instructor with ID {instructor_id} not found."}, 404
            
            if 'instructor' not in [role.name for role in instructor.roles]:
                return {"message": "User is not an instructor"}, 400

            course.instructor_id = instructor_id

        db.session.commit()
        return {
            "message": "Course updated successfully",
            "course": {
                "id": course.id,
                "course_name": course.course_name,
                "credits": course.credits,
                "instructor_id": course.instructor_id
            }
        }, 200
    

# Course Registration 

class CourseRegistrationAPI(Resource):
    
    post_parser = reqparse.RequestParser()
    post_parser.add_argument('course_ids', type=list, required=True, help="List of course IDs to register for", location='json')

    @auth_required("token")
    def post(self):
        args = self.post_parser.parse_args()
        course_ids = args['course_ids']
        current_student = current_user

        term = "May 2025"  # term

        # Check if the user is already registered for 4 courses
        existing_courses_count = CourseOpted.query.filter_by(user_id=current_student.id, term=term).count()

        if existing_courses_count >= 4:
            return {"message": "You can register for a maximum of 4 courses per term."}, 400

        # Loop through each course in the provided list
        for course_id in course_ids:
            # Check if the user has already registered for this course in any previous terms
            existing_registration = CourseOpted.query.filter_by(user_id=current_student.id, course_id=course_id).first()
            if existing_registration:
                return {"message": f"You are already registered for course ID {course_id} in a previous term."}, 400

            # If the user has not registered for this course in a previous term, register them
            new_registration = CourseOpted(
                user_id=current_student.id,
                course_id=course_id,
                term=term,
                status=True  # Assuming the registration status is active
            )

            # Add the new registration to the session
            db.session.add(new_registration)

        # Commit the session after adding all the registrations
        db.session.commit()

        return {"message": "Courses registered successfully."}, 201
    

# Getting the course Details for the user 

class UserCoursesAPI(Resource):

    @auth_required("token")
    @roles_required("student")
    def get(self):
        current_student = current_user
        registrations = db.session.query(CourseOpted, Course).join(Course, CourseOpted.course_id == Course.id) \
            .filter(CourseOpted.user_id == current_student.id, CourseOpted.status == True).all()

        if not registrations:
            return jsonify({"message": "You are not registered for any courses."}), 404

        courses = []
        for registration, course in registrations:
            course_data = {
                "course_id": course.id,
                "course_name": course.course_name,
                "credits": course.credits,
                "term": registration.term
            }
            courses.append(course_data)

        if len(courses) > 0:
            return courses, 200
        else:
            return {"message": "No courses found"}, 404
        

api.add_resource(CourseAPI, '/courses')
api.add_resource(CourseRegistrationAPI, '/courseregistration')
api.add_resource(UserCoursesAPI, '/usercourses')
