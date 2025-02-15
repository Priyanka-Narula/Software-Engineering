export default {
    template: `
    <div class="container mt-4">
        <div class="d-flex flex-wrap gap-3 px-3">
            <!-- Courses Section -->
            <div class="d-flex flex-wrap gap-3 flex-grow-1">
                <div v-for="course in my_courses" :key="course.course_id" 
                    @click="openCourseDetails(course.course_id)" 
                    class="card shadow-sm p-3 border-0 rounded cursor-pointer" 
                    style="width: 220px; transition: transform 0.2s; cursor: pointer;"
                    @mouseover="e => e.currentTarget.style.transform='scale(1.05)'"
                    @mouseleave="e => e.currentTarget.style.transform='scale(1)'">
                    
                    <h5 class="text-dark fw-bold mb-2">{{ course.course_name }}</h5>
                    <p class="text-secondary mb-1">Credits: {{ course.credits }}</p>
                    <p class="text-secondary">Term: {{ course.term }}</p>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            my_courses: [],  
            auth_token: localStorage.getItem("auth_token"),
        };
    },
    methods: {

        async get_usercourses() {
            const res = await fetch('/api/user_course', {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.auth_token,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                this.my_courses = data;  
            } else {
                alert(data.message);  
            }
        },

        openCourseDetails(course_id) {
            window.open(`#/course_details/${course_id}`, "_blank");
        }
    },
    async mounted() {
        await this.get_usercourses(); 
    },
};
