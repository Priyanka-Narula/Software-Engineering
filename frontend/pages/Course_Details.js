export default {
    template: `
    <div :style="containerStyle">
        <!-- Sidebar (side box) -->
        <div :style="sidebarStyle">
            <ul :style="listStyle">
                <li v-for="(week, index) in weeks" :key="index">
                    <!-- Week Header: Clickable to toggle content visibility -->
                    <div @click="toggleDropdown(index)" :style="weekHeaderStyle">
                        Week {{ index + 1 }}
                    </div>
                    <!-- Week Content (Lecture URLs) -->
                    <ul v-if="week.isOpen" :style="nestedListStyle">
                        <li v-for="(content, i) in week.content" :key="i">
                            <a href="javascript:void(0);" @click="selectLecture(content.lecture_url)" :style="linkStyle">
                                Lecture {{ content.lecture_no }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <!-- Main Content Area -->
        <div :style="mainContentStyle">
            <div v-if="courseDetails">
                <h4>Course Content</h4>
                <p>Select a week from the sidebar to view the lectures.</p>
                
                <!-- Iframe Player for Video -->
                <div v-if="selectedLectureUrl" :style="iframeWrapperStyle">
                    <iframe :src="selectedLectureUrl" frameborder="0" width="100%" height="100%" allowfullscreen></iframe>
                </div>
            </div>
            <div v-else>
                <p v-if="loading">Loading course details...</p>
                <p v-else>Error fetching course details. Please try again later.</p>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            courseDetails: null,
            loading: true,
            auth_token: localStorage.getItem("auth_token"),
            weeks: [],  // Will hold the week data (each week contains its lectures)
            selectedLectureUrl: null,  // Holds the URL of the selected lecture to play in the iframe
        };
    },
    methods: {
        async get_course_details(course_id) {
            try {
                const res = await fetch(`/api/course_details/${course_id}`, {
                    method: 'GET',
                    headers: {
                        "Authentication-Token": this.auth_token,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    this.courseDetails = data;
                    this.processCourseData(data);
                    this.loading = false;
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                this.loading = false;
                console.error(error);
                alert("There was an issue fetching the course details.");
            }
        },
        
        processCourseData(data) {
            // Process and group content by weeks
            let weeks = [];
            data.content.forEach(content => {
                const weekNumber = content.lecture_no.split('.')[0];  // Get the week number (e.g., '1' from '1.1')
                if (!weeks[weekNumber - 1]) {
                    weeks[weekNumber - 1] = { isOpen: false, content: [] };
                }
                weeks[weekNumber - 1].content.push(content);
            });
            this.weeks = weeks;
        },

        toggleDropdown(index) {
            // Toggle the visibility of the week content
            this.weeks[index].isOpen = !this.weeks[index].isOpen;
        },

        selectLecture(lectureUrl) {
            // Set the selected lecture URL for iframe
            this.selectedLectureUrl = lectureUrl;
        }
    },
    async mounted() {
        const course_id = this.$route.params.course_id;  // Get the course ID from the route parameters
        await this.get_course_details(course_id);  // Fetch the course details
    },
    computed: {
        // Inline styles for container, sidebar, main content, etc.
        containerStyle() {
            return {
                display: 'flex',
                height: '100vh',
            };
        },
        sidebarStyle() {
            return {
                width: '250px',  // Sidebar width
                backgroundColor: '#f4f4f4',
                borderRight: '1px solid #ccc',
                padding: '20px',
                overflowY: 'auto',
            };
        },
        listStyle() {
            return {
                listStyleType: 'none',
                paddingLeft: '0',
            };
        },
        weekHeaderStyle() {
            return {
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#e1e1e1',
                borderRadius: '4px',
                textAlign: 'center',
            };
        },
        nestedListStyle() {
            return {
                paddingLeft: '10px',  // Indentation for nested lists
                listStyleType: 'none',
            };
        },
        linkStyle() {
            return {
                textDecoration: 'none',
                color: '#007bff',
                fontSize: '14px',
            };
        },
        mainContentStyle() {
            return {
                flex: '1',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: 'calc(100% - 250px)',  // Subtract sidebar width (250px) from the available space
            };
        },
        iframeWrapperStyle() {
            return {
                marginTop: '20px',  // Space above the video
                width: '70%',  // Set the iframe container width to 70% of the remaining space
                height: '400px', // Fixed height for the iframe player
                backgroundColor: '#000',
                borderRadius: '4px',
                overflow: 'hidden',
            };
        }
    }
};
