export default {
    template: `
      <div class="login-page" style="max-width: 500px; margin: 0 auto; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); background-color: #ffffff;">
        <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">Login to EduNex</h1>
        <p style="font-size: 18px; margin-bottom: 30px;">Access your account.</p>
        <form @submit.prevent="login">
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="email" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Email</label>
            <input type="email" id="email" v-model.trim="user_credentials.email" required 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;" />
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="password" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Password</label>
            <input type="password" id="password" v-model.trim="user_credentials.password" required 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;" />
          </div>
          <button type="submit" class="btn" 
                  style="background-color: #4caf50; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease; width: 100%;">
            Login
          </button>
        </form>
        
        <div v-if="error" class="text-danger" style="margin-top: 10px; color: red;">{{ error }}</div>
      </div>
    `,
  
    data() {
      return {
        user_credentials: {
          email: null,
          password: null,
        },
        error: null,
      }
    },
  
    methods: {
      async login() {
        const res = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(this.user_credentials),
        });
        const data = await res.json();
        if (res.ok) { 
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('email', data.email);
          localStorage.setItem('user_name', data.name);
          
          if (data.role === 'student') {
            this.$router.push({ path: '/student_dashboard' });
          } else if (data.role === 'admin') {
            this.$router.push({ path: '/admin_dashboard' });
          } else if (data.role === 'instructor') {
            this.$router.push({ path: '/instructor_dashboard' });
          } else {
            this.error = 'Unknown role';
          }
        } else {
          this.error = data.message;
        }
      }
    }
  };