// frontend/app.js
import Navbar from "./components/Navbar.js"; 
import router from "./utils/router.js";

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth_token');
    if (
        to.name !== 'Home' &&
        to.name !== 'Login' &&
        to.name !== 'Student_Registration_Page' &&
        to.name !== 'Instructor_Registration_Page' &&
      
        !isAuthenticated
    ) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

const app = new Vue({
    el: "#app",    //  id matches the div in your index.html
    router,
    template: `
        <div>
            <Navbar :key="changing_route" />  <!-- Key to force re-render on route change -->
            <router-view></router-view>       <!-- View for dynamic route content -->
        </div>
    `,
    components: {
        Navbar,  // Register the Navbar component here
    },
    data() {
        return {
            changing_route: true,
        };
    },
    watch: {
        $route(to, from) {
            this.changing_route = !this.changing_route;
        },
    },
});

