export default {
    template: `
    <div style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 20px; padding: 0 20px;">
        <!-- Notifications Section -->
        <div style="flex: 1; min-width: 300px; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #f9f9f9;">
            <h2 style="font-size: 20px; color: #333;">Latest Notifications</h2>
            <ul style="list-style: none; padding: 0;">
                <li v-if="notifications.length === 0" style="font-size: 14px; color: #777; text-align: center;">
                    No notifications available.
                </li>
                <li v-for="notification in notifications" :key="notification.id" style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #ddd;">
                    <h4 style="font-size: 16px; color: #555;">{{ notification.title }}</h4>
                    <p style="font-size: 14px; color: #777;">{{ notification.message }}</p>
                </li>
            </ul>
        </div>

        <!-- Courses Section -->
        <div style="flex: 2; display: flex; flex-wrap: wrap; gap: 20px;">
            <div v-for="course in my_courses" :key="course.course_id" style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff; width: 200px;">
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
            notifications: [], // Will hold notification data
            auth_token: localStorage.getItem("auth_token"),
            role: localStorage.getItem("role"),
        };
    },

    methods: {
        async get_usercourses() {
            const res = await fetch('/api/usercourses', {
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

        async get_notifications() {
            const res = await fetch('/api/notifications', {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.auth_token,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                this.notifications = data;
            } else {
                alert(data.message);
            }
        },
    },

    async mounted() {
        await this.get_usercourses();
        await this.get_notifications();
    },
};
