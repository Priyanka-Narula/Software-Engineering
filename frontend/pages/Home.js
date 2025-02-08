  export default {
    template: `
  <div>
    <div class="hero bg-gray-100 text-center py-16">
      <br>
      <h3 class="text-2xl font-semibold">Welcome to IITM BS in Data Science</h3>
      <div class="hero bg-gray-100 text-center py-16">
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

  <section id="courses" class="py-8 bg-gray-100 text-center">
  <br>
      <h3 class="text-2xl font-semibold">Our Courses</h3>
      <br>
      <div class="container mt-6">
        <div v-if="courses.length > 0" class="row" >
          <div v-for="course in courses" :key="course.id" class="col-md-3 mb-4" >
            <div class="card h-100 shadow-lg">
            <img src="/static/assets/card-03.jpeg" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">{{ course.course_name }}</h5>
                <p class="card-text">Credits: {{ course.credits }}</p>
                <p class="card-text">Level: {{ course.level }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-else>No courses available at the moment.</p>
      </div>
    </section>

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
        courses: [
          { id: 1, course_name: 'Fundamentals of Mathematics', credits: 3, level: 'Foundation' },
          { id: 2, course_name: 'Basics of Statistics', credits: 4, level: 'Foundation' },
          { id: 3, course_name: 'Programming in Python', credits: 3, level: 'Foundation' },
          { id: 4, course_name: 'Computational Thinking', credits: 4, level: 'Foundation' },
          { id: 5, course_name: 'Machine Learning ', credits: 3, level: 'Diploma' },
          { id: 6, course_name: 'Data Structures', credits: 4, level: 'Diploma' },
          { id: 7, course_name: 'Database Management System', credits: 3, level: 'Diploma' },
          { id: 8, course_name: 'Business Data Analytics and Management', credits: 4, level: 'Diploma' },
          { id: 9, course_name: 'Artificial Inteligence', credits: 3, level: 'Degree' },
          { id: 10, course_name: 'Deep Learning', credits: 4, level: 'Degree' },
          { id: 11, course_name: 'Natural Language Processessing', credits: 3, level: 'Degree' },
          { id: 12, course_name: 'Big Data Analytics', credits: 3, level: 'Degree' },
        ],
      };
    },
    
  };
