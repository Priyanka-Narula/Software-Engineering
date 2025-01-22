# SE Project Directory Structure

## Project Overview
Seek Portal
## Folder Structure

### Root Directory

```plaintext
project/
│
├── backend/                        # Contains the backend application (Flask)
│   ├── api.py                      # Contains API routes 
│   ├── config.py                   # Configuration file 
│   ├── create_initial_data.py      # Creating initial data (Admin , Student , Instructor)
│   ├── model.py                    # Contains database models for the application
│   └── router.py                   # Route handlers for the backend (Login , Student_Register)
│
├── frontend/                       # Frontend application (Vue.js)
│   ├── assets/                     # Static files 
│   ├── components/                 # Reusable Vue components
│   │   └── Navbar.js               # NavBar
│   ├── pages/                      # Pages
│   │   ├── Admin_dashboard.js      # Admin dashboard 
│   │   ├── Instructor_dashboard.js # Instructor dashboard 
│   │   ├── Login.js                # Login page
│   │   ├── Student_dashboard.js    # Student dashboard 
│   │   └── Student_registration.js # Student registration 
│   ├── utils/                      # Utility functions for the frontend
│   │   └── router.js               # Utility file for managing routing
│   ├── app.js                      # Main Vue.js app entry file
│   └── index.html                  # Main HTML file 
│
├── instance/                       # Contains environment-specific data
│   └── database.sqlite3            # SQLite database file
│
├── app.py                          # Entry point 
├── req.txt                         # Dependencies 


