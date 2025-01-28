export default {
  template: `
    <div class='d-flex justify-content-center' style="margin-top:24vh">
    <form @submit.prevent="login">
      <div class="mb-3 p-5 bg-light">
        <div class='text-danger'>{{error}}</div>
        <label for="user_email" class="form-label">Email Address</label>
        <input type="email" class="form-control" id="user_email" placeholder='Type Your Mail' v-model='user_credentials.email'>
        <label for="user_password" class="form-label">Password</label>
        <input type="password" class="form-control" id="user_password" placeholder='Type Your Password' v-model='user_credentials.password'>
        <button type="submit" class="btn btn-primary mt-4">Login</button>
      </div>
    </form>
  </div>
  `
  ,
  // Now we have to bind the values of the form input to some variable and send a request to backend .
  data(){
      return{
          user_credentials:{
              email: null,
              password: null,
          },
          //user_role : null,
          error: null,
      }
  },
  // Now lets write the methods
  methods:{
      async login(){
          const res = await fetch('/login',{
              method:'POST',
              headers:{
                  'Content-type': 'application/json'
              },
              body:JSON.stringify(this.user_credentials),
          })
          const data = await res.json()
          if(res.ok){ 
              localStorage.setItem('auth_token',data.token)
              localStorage.setItem('role',data.role)
              localStorage.setItem('email',data.email)
              localStorage.setItem('user_name',data.name)
              
              if (data.role === 'student') {
                this.$router.push({ path: '/student_dashboard' });
            } else if (data.role === 'admin') {
                this.$router.push({ path: '/admin_dashboard' });
            } else if (data.role === 'instructor') {
                this.$router.push({ path: '/instructor_dashboard' });
            } else {
                this.error = 'Unknown role';
            }
          }
          else{
              this.error = data.message
          }
      }
  },
}
// this.$router.push({path : '/home' , query : {role : data.role }})