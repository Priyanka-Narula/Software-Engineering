export default {
    template: `
    <div style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 20px; padding: 0 20px;">
        <!-- Courses Section -->
        <div style="flex: 2; display: flex; flex-wrap: wrap; gap: 20px;">
            <div v-for="course in my_courses" :key="course.course_id" @click="openCourseDetails(course.course_id)"
                style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff; width: 200px; cursor: pointer;">
                <h3 style="font-size: 18px; color: #333;">{{ course.course_name }}</h3>
                <p style="color: #777;">Credits: {{ course.credits }}</p>
                <p style="color: #777;">Term: {{ course.term }}</p>
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
