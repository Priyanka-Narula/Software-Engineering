export default {
    template: `
    <div>
      
      <!-- Navbar -->
      
    <nav class="bg-blue-800 text-white p-4 flex justify-between items-center w-full">
      <ul class="flex space-x-6">
        <li>
          <a href="#" class="hover:underline hover:text-blue-200 transition duration-300">About</a><>
          <a href="#courses" class="hover:underline hover:text-blue-200 transition duration-300">Courses</a><>
          <a href="#contact" class="hover:underline hover:text-blue-200 transition duration-300">Contact</a>
        </li>
      </ul>
    </nav>

  
      <!-- Hero Section -->
      <div class="hero bg-gray-100 text-center py-16">
        <h3 class="text-2xl font-semibold">Welcome to IITM BS in Data Science</h3>
        <div class="hero bg-gray-100 text-center py-16" >
            <p class="mt-2 text-lg">
            IIT Madras, India's top technical institute, welcomes you to the world's first 4-year BS Degree in Data Science and Applications
            with options to exit earlier in the foundation, diploma, or BSc degree level.
            For the first time, you can work towards an undergraduate degree/diploma from an IIT regardless of your age, location, or academic background.
            More than 36,000 students are currently studying with us in the program.
            Your gateway to a successful career in Data Science.Industry-Aligned Curriculum:Designed to meet market needs.
            Learn from top IIT Madras professors with flexible learning.
            </p> 
        </div>      
      </div> 
      
  
      <!-- Courses Section -->
  <section id="courses" class="p-8 bg-gray-100 text-center">
    <h3 class="text-2xl font-semibold">Our Courses</h3>
    <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div v-for="course in courses" :key="course.id" class="p-4 bg-white shadow-lg rounded-lg">
        <h4 class="font-bold">{{ course.course_name }}</h4>
        <p class="text-sm text-gray-600">Course Credits: {{ course.credits }}</p>
      </div>
    </div>
    <p v-else>No courses available at the moment.</p>
  </section>
  
      <!-- Footer -->
      <div id="contact" class="footer bg-blue-800 text-black p-6 mt-6 text-center">
        <h5 class="text-lg font-bold">Contact Us</h5>
        <p>📍 IITM BS Degree Office, 3rd Floor, ICSR Building, IIT Madras, Chennai - 600036</p>
        <p>📞 7850-999966 (Mon-Fri 9am-6pm)</p>
        <p>📧 support@study.iitm.ac.in</p>
        <p>
          <a href="#" class="underline">Privacy Policy</a> |
          <a href="#" class="underline">Terms of Service</a>
        </p>
      </div>
    </div>
    `,
    data() {
      return {
        courses: [],  // Array to store the fetched courses
      };
    },
    mounted() {
      this.fetchCourses();  // Fetch courses when the component is mounted
    },
    methods: {
      async fetchCourses() {
        try {
          const response = await fetch("/api/admin_course");
          if (response.ok) {
            const data = await response.json();
            this.courses = data;  // Store the fetched courses in the courses array
          } else {
            console.error("Failed to fetch courses:", response.status);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      },
    },
  };
  