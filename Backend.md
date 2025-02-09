# File Descriptions

## api.py
This file defines the API for your application using Flask-RESTful. It includes the route prefix `/api` and initializes the Flask-RESTful API instance. The `api.py` file doesn't contain detailed routes but acts as a starting point for API resources.

## config.py
Contains configuration settings for your Flask application. These include:

- **Database URI**: Uses SQLite (`sqlite:///database.sqlite3`) for local development.
- **Security Settings**: Defines password hashing methods, session handling, and CSRF protection.
- **Other Configurations**: Sets values for Flask debug mode, secret keys, and token expiration.

## create_initial_data.py
This script is used for initializing the database with default roles and users if they don't already exist. The default roles created are:

- **Admin**
- **Instructor**
- **Student**

It also creates dummy users with default credentials:

- **Admin**: `admin@app.com`, password `1234`
- **Instructor**: `instructor@app.com`, password `1234`
- **Student**: `student@app.com`, password `1234`

This script is run once to populate the database with initial data.

## model.py
Defines the database models using SQLAlchemy. Models in this file include:

- **Role**: Represents user roles (Admin, Instructor, Student).
- **User**: Represents application users with attributes like name, email, password, and roles.
- **Course**: Represents courses, including the course name and related instructor.
- **Instructor**: Represents instructors who teach courses.
- **CourseContent**: Represents content for each course, including lecture videos.
- **CourseOpted**: Represents the courses opted by students.

## router.py
Contains the main route definitions for the backend application. Key routes include:

- **Home Route** (`/`): Renders the homepage (`index.html`).
- **Login Route** (`/login`): Authenticates users based on their email and password.
- **Student Registration Route** (`/student_registration`): Registers new students with their name, email, and password.

# Database Models

## User Model
The User model represents the users in the application. It has the following attributes:

- **id**: Primary key for the user.
- **name**: User's name.
- **email**: User's unique email address.
- **password**: User's password (hashed).
- **roles**: A many-to-many relationship with the Role model.
- **last_login_at**: Timestamp of the last login.

## Role Model
The Role model defines the roles available in the application. Each user can have multiple roles:

- **id**: Primary key for the role.
- **name**: Role name (e.g., Admin, Instructor, Student).
- **description**: A description of the role.

## Course Model
The Course model represents courses in the application:

- **id**: Primary key for the course.
- **course_name**: Name of the course.
- **credits**: Number of credits for the course.
- **instructor_id**: Foreign key to the Instructor model.

## Instructor Model
The Instructor model represents an instructor:

- **id**: Primary key for the instructor.
- **name**: Name of the instructor.
- **course_id**: Foreign key to the Course model.

## CourseContent Model
The CourseContent model holds details about the content of a course:

- **id**: Primary key for the course content.
- **course_id**: Foreign key to the Course model.
- **lecture_no**: The number of the lecture.
- **lecture_url**: URL to the lecture video or content.
- **instructor_id**: Foreign key to the Instructor model.

## CourseOpted Model
The CourseOpted model represents the courses opted by a student:

- **id**: Primary key for the opted course.
- **user_id**: Foreign key to the User model (student).
- **term**: The academic term for the course.
- **status**: Whether the student is currently enrolled in the course.

# Routes

### 1. POST `/login`
**Description**: Logs in a user using their email and password.

- **Request Body**:
    ```json
    {
        "email": "user_email",
        "password": "user_password"
    }
    ```

- **Response**:
    - **Success**:
      ```json
      {
          "message": "Login successful!",
          "token": "user_token",
          "email": "user_email",
          "role": "role_name"
      }
      ```
    - **Failure**: Returns error messages for invalid email/password or missing fields.

- **Example Request**:
    ```json
    {
        "email": "admin@app.com",
        "password": "1234"
    }
    ```

### 2. POST `/student_registration`
**Description**: Registers a new student.

- **Request Body**:
    ```json
    {
        "name": "Student Name",
        "email": "student_email",
        "password": "student_password"
    }
    ```

- **Response**:
    - **Success**:
      ```json
      {
          "message": "Account created successfully! You can now log in.",
          "user": {
              "name": "Student Name",
              "email": "student_email",
              "role": "student"
          }
      }
      ```
    - **Failure**: Returns an error if the email already exists or required fields are missing.

### 3. GET `/` (Home Route)
**Description**: Renders the index.html page of the application.

- **Response**: The HTML content of the homepage.

# Dummy User Credentials

- **Admin**:
    - **Email**: `admin@app.com`
    - **Password**: `1234`
- **Instructor**:
    - **Email**: `instructor@app.com`
    - **Password**: `1234`
- **Student**:
    - **Email**: `student@app.com`
    - **Password**: `1234`