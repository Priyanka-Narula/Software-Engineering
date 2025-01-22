export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top:24vh">
        <form @submit.prevent="student_registration">
            <div class="mb-3 p-5 bg-light">
                <label for="user_name" class="form-label">User Name</label>
                <input type="text" class="form-control" id="user_name" placeholder='Type Your Name' v-model='user_credentials.name'>
                <label for="user_email" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="user_email" placeholder='Type Your Mail' v-model='user_credentials.email'>
                <label for="user_password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user_password" placeholder='Type Your Password' v-model='user_credentials.password'>
                <button type="submit" class="btn btn-primary mt-4">Register</button>
            </div>
        </form>
    </div>
    `,
    
    data() {
        return {
            user_credentials: {
                name: null,
                email: null,
                password: null,
            },
        };
    },
    
    methods: {
        async student_registration() {
            const res = await fetch('/student_registration', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(this.user_credentials),
            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                this.$router.push({ path: '/' });
            }
        },
    },
};
