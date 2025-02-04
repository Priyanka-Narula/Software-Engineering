import Home from "../pages/Home.js"
import Login from "../pages/Login.js"
import Student_Registration_Page from "../pages/Student_Registration_Page.js"
import Admin_Dashboard from "../pages/Admin_Dashboard.js"
import Instructor_Dashboard from "../pages/Instructor_Dashboard.js"
import Student_Dashboard from "../pages/Student_Dashboard.js"
import Instructor_Registration_Page from "../pages/Instructor_Registration_Page.js"
import Course_Details from "../pages/Course_Details.js"
import Course_Content from "../pages/Course_Content.js" 

const routes = [
    
    { path: '/', component: Home,name: 'Home' },
    { path: '/login', component: Login , name:'Login'}, 
    { path: '/student_registration_page', component: Student_Registration_Page , name:'Student_Registration_Page'}, 
    { path: '/admin_dashboard', component: Admin_Dashboard , name:'Admin_Dashboard'}, 
    { path: '/instructor_dashboard', component: Instructor_Dashboard , name:'Instructor_Dashboard'}, 
    { path: '/student_dashboard', component: Student_Dashboard , name:'Student_Dashboard'}, 
    { path: '/instructor_registration_page', component: Instructor_Registration_Page , name:'Instructor_Registration_Page'},
    //{ path: '/course_details/:id', component: Course_Details, name: 'Course_Details' }, 
    { path: '/course_details/:course_id', component: Course_Details, name: 'Course_Details' },
    { path: '/course_content/:course_id', component: Course_Content, name: 'CourseContent' }
   
    
]

const router = new VueRouter({
    // mode: 'history',
    routes
})


export default router;
