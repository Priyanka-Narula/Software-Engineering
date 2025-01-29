export default {
    template: `
      <div>
        <h2>Course Content Management</h2>
  
        <!-- Display Weeks and Lectures -->
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <h3>Week {{ weekIndex + 1 }}</h3>
  
          <!-- Dropdown to manage lectures -->
          <div>
            <button @click="toggleDropdown(weekIndex)">
              Manage Lectures for Week {{ weekIndex + 1 }}
            </button>
  
            <div v-if="dropdownOpen === weekIndex">
              <!-- Lectures in the Week -->
              <div v-for="(lecture, lectureIndex) in week" :key="lectureIndex">
                <span>Lecture {{ weekIndex + 1 }}.{{ lectureIndex + 1 }}:</span>
                <input
                  v-model="lecture.lecture_url"
                  type="text"
                  placeholder="Enter lecture URL"
                />
                <!-- Delete button only if lecture_url is empty -->
                <button v-if="!lecture.lecture_url.trim()" @click="removeLecture(weekIndex, lectureIndex)">
                  Remove
                </button>
              </div>
  
              <!-- Add Lecture Button inside dropdown -->
              <button @click="addLectureToWeek(weekIndex)">
                Add Another Lecture
              </button>
            </div>
          </div>
        </div>
  
        <!-- Add Week Button outside dropdown -->
        <button @click="addNewWeek">Add Another Week</button>
  
        <!-- Submit Button -->
        <div>
          <button @click="submitContent">Submit Content</button>
        </div>
  
        <!-- Error/Success Messages -->
        <p v-if="message" :class="messageType === 'error' ? 'error' : 'success'">
          {{ message }}
        </p>
  
        <!-- Loading Indicator -->
        <div v-if="loading">Loading...</div>
      </div>
    `,
  
    data() {
      return {
        weeks: [], // Initialize as an empty array, populated with fetched data
        message: "",
        messageType: "",
        dropdownOpen: null, // Track which dropdown is open
        course_id: null, // Will get the course_id from the route params
        loading: false, // For loading indicator
      };
    },
  
    methods: {
      toggleDropdown(weekIndex) {
        this.dropdownOpen = this.dropdownOpen === weekIndex ? null : weekIndex;
      },
  
      addLectureToWeek(weekIndex) {
        this.weeks[weekIndex].push({ lecture_url: "" });
      },
  
      addNewWeek() {
        this.weeks.push([{ lecture_url: "" }]);
      },
  
      removeLecture(weekIndex, lectureIndex) {
        this.weeks[weekIndex].splice(lectureIndex, 1);
      },
  
      async get_course_details(course_id) {
        console.log("Fetching content for course ID:", course_id); // Debug log
        this.loading = true; // Start loading
  
        const res = await fetch(`/api/course_content/${course_id}`, {
          headers: {
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
        });
  
        this.loading = false; // Stop loading
  
        const data = await res.json();
        console.log("Fetched data:", data); // Debug log
  
        if (res.ok) {
          if (data.course_content.length > 0) {
            const groupedContent = data.course_content.map((week) => {
              return {
                weekNumber: week.week,
                lectures: week.lectures.map((lecture) => ({
                  lecture_no: lecture.lecture_no,
                  lecture_url: lecture.lecture_url,
                })),
              };
            });
  
            this.weeks = groupedContent.map((week) =>
              week.lectures.map((lecture) => ({
                lecture_url: lecture.lecture_url,
              }))
            );
          } else {
            this.weeks = [[{ lecture_url: "" }]]; // Initialize if no content
          }
        } else {
          this.message = data.message || "An error occurred while fetching course content.";
          this.messageType = "error";
        }
      },
  
      async submitContent() {
        this.message = ""; // Clear previous messages
        this.messageType = "";
  
        const payload = [];
  
        this.weeks.forEach((week, weekIndex) => {
          week.forEach((lecture, lectureIndex) => {
            payload.push({
              lecture_no: `${weekIndex + 1}.${lectureIndex + 1}`,
              lecture_url: lecture.lecture_url,
            });
          });
        });
  
        if (payload.some((lecture) => !lecture.lecture_url.trim())) {
          this.message = "Please ensure all lecture URLs are filled.";
          this.messageType = "error";
          return;
        }
  
        this.loading = true; // Start loading
  
        const res = await fetch(`/api/course_content/${this.course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({ content: payload }),
        });
  
        this.loading = false; // Stop loading
  
        const data = await res.json();
        if (res.ok) {
          this.message = data.message || "Content updated successfully!";
          this.messageType = "success";
        } else {
          this.message = data.message || "An error occurred.";
          this.messageType = "error";
        }
      },
    },
  
    mounted() {
      const course_id = this.$route.params.course_id; // Get the course ID from the route parameters
      if (!course_id) {
        this.message = "Course ID is missing.";
        this.messageType = "error";
        return;
      }
      this.course_id = course_id;
      this.get_course_details(course_id); // Fetch the course details using the course ID
    },
  };
  