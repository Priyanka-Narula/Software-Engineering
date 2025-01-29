export default {
  template: `
  <div>
    <h2>Instructor Dashboard</h2>

    <!-- Courses Section -->
    <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 0 20px;">
      <div v-for="course in assigned_course" :key="course.course_id" 
           @click="openCourseContent(course.course_id)" 
           style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff; width: 200px; cursor: pointer;">
        <h3 style="font-size: 18px; color: #333;">{{ course.course_name }}</h3>
        <p style="color: #777;">Credits: {{ course.credits }}</p>
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
