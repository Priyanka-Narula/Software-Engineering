export default {
  template: `
    <div>
      <h2>Course Content Management</h2>

      <!-- Display Weeks and Lectures -->
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex">
        <h3>Week {{ weekIndex + 1 }}</h3>

        <!-- Dropdown to manage lectures -->
        <div>
          <button
            @click="toggleDropdown(weekIndex)"
          >
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
            <button
              @click="addLectureToWeek(weekIndex)"
            >
              Add Another Lecture
            </button>
          </div>
        </div>
      </div>

      <!-- Add Week Button outside dropdown -->
      <button
        @click="addNewWeek"
      >
        Add Another Week
      </button>

      <!-- Submit Button -->
      <div>
        <button
          @click="submitContent"
        >
          Submit Content
        </button>
      </div>

      <!-- Error/Success Messages -->
      <p v-if="message" :class="messageType === 'error' ? 'error' : 'success'">
        {{ message }}
      </p>
    </div>
  `,

  data() {
    return {
      weeks: [], // Initialize as an empty array, populated with fetched data
      message: "",
      messageType: "",
      dropdownOpen: null, // Track which dropdown is open
    };
  },

  methods: {
    // Toggle the dropdown for managing lectures in a specific week
    toggleDropdown(weekIndex) {
      this.dropdownOpen = this.dropdownOpen === weekIndex ? null : weekIndex;
    },

    // Add another lecture to a specific week
    addLectureToWeek(weekIndex) {
      this.weeks[weekIndex].push({ lecture_url: "" });
    },

    // Add a new week with one empty lecture
    addNewWeek() {
      this.weeks.push([{ lecture_url: "" }]);
    },

    // Remove an empty lecture from a specific week
    removeLecture(weekIndex, lectureIndex) {
      this.weeks[weekIndex].splice(lectureIndex, 1);
    },

    // Fetch existing course content
    async fetchCourseContent() {
      const res = await fetch("/api/instructor_course", {
        headers: {
          "Authentication-Token": localStorage.getItem("auth_token"),
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (data.courses.length > 0) {
          // Loop through courses and their content
          const groupedContent = data.courses.flatMap((course) => {
            return course.course_content.map((week) => {
              return {
                weekNumber: week.week,
                lectures: week.lectures.map((lecture) => ({
                  lecture_no: lecture.lecture_no,
                  lecture_url: lecture.lecture_url,
                })),
              };
            });
          });

          // Assign grouped content to weeks
          this.weeks = groupedContent.map((week) =>
            week.lectures.map((lecture) => ({
              lecture_url: lecture.lecture_url,
            }))
          );
        } else {
          this.weeks = [[{ lecture_url: "" }]]; // Initialize if no content
        }
      } else {
        alert(data.message);
      }
    },

    // Submit content to the API
    async submitContent() {
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

      const res = await fetch("/api/instructor_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token"),
        },
        body: JSON.stringify({ content: payload }),
      });

      const data = await res.json();
      if (res.ok) {
        this.message = data.message;
        this.messageType = "success";
      } else {
        alert(data.message);
      }
    },
  },

  // Fetch data when the component is created
  created() {
    this.fetchCourseContent();
  },
};
