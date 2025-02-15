export default {
  template: `
  <div class="container mt-4">
      <h2 class="mb-3 text-primary fw-bold">Instructor Dashboard</h2>
  
      <!-- Courses Section -->
      <div class="d-flex flex-wrap gap-3 px-3">
          <div v-for="course in assigned_course" :key="course.course_id" 
               @click="openCourseContent(course.course_id)" 
               class="card shadow-sm p-3 border-0 rounded cursor-pointer" 
               style="width: 220px; transition: transform 0.2s; cursor: pointer;"
               @mouseover="e => e.currentTarget.style.transform='scale(1.05)'"
               @mouseleave="e => e.currentTarget.style.transform='scale(1)'">
              
              <h5 class="text-dark fw-bold mb-2">{{ course.course_name }}</h5>
              <p class="text-secondary">Credits: {{ course.credits }}</p>
          </div>
      </div>
  </div>
  `,
  data() {
    return {
      assigned_course: [],
      auth_token: localStorage.getItem("auth_token"),
    };
  },

  methods: {
    // Open course content page with the selected course_id
    openCourseContent(course_id) {
      if (course_id) {
        // Navigate to the course content page by updating the hash
        window.location.hash = `#/course_content/${course_id}`;
      } else {
        console.error("Course ID is undefined");
      }
    },

    async getAssignedCourses() {
      const res = await fetch('/api/instructor_assigned_course', {
        method: 'GET',
        headers: {
          "Authentication-Token": this.auth_token,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.assigned_course = data;
      } else {
        alert(data.message);
      }
    },
  },

  async mounted() {
    await this.getAssignedCourses();
  },
};
