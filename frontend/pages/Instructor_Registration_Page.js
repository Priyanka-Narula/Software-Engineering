export default {
    template: `
      <div class="registration-page" style="max-width: 500px; margin: 0 auto; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); background-color: #ffffff; margin-top: 24vh;">
        <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">Register for EduNex</h1>
        <p style="font-size: 18px; margin-bottom: 30px;">Create your instructor account.</p>
        <form @submit.prevent="student_registration">
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="user_name" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">User  Name</label>
            <input type="text" id="user_name" v-model.trim="user_credentials.name" required 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;" />
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="user_email" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Email Address</label>
            <input type="email" id="user_email" v-model.trim="user_credentials.email" required 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;" />
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="user_password" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Password</label>
            <input type="password" id="user_password" v-model.trim="user_credentials.password" required 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;" />
          </div>
          <button type="submit" class="btn" 
                  style="background-color: #4caf50; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease; width: 100%;">
            Register
          </button>
        </form>
        
        <div v-if="error" class="text-danger" style="margin-top: 10px; color: red;">{{ error }}</div>
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
            const res = await fetch('/instructor_registration', {
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
            } else {
                alert("Account already exists, Please login!");
                this.$router.push({ path: '/login' });
            }
        },
    },
};
