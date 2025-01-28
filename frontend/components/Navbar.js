export default{
  template:`
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" >Seek Portal</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <li class="nav-item">
            <router-link class="nav-link active" v-if="!is_loged_in" to="/">Home</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link active" v-if="!is_loged_in" to="/login">Login</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link active" v-if="!is_loged_in" to="/student_registration_page">Student_Registration</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link active" v-if="!is_loged_in" to="/instructor_registration_page">Instructor_Registration</router-link>
          </li>
          
          <li class="nav-item active" v-if="is_loged_in">
            <button class="nav-link active" @click="logout">Logout</button>
          </li>

          <li class="nav-item active" v-if="is_loged_in">
            <button class="nav-link active">Welcome, {{ user_name }}</button>
          </li>
        
          
        </ul>
      </div>
    </div>
  </nav>
  `,

data(){
  return{
    role:localStorage.getItem('role'),
    is_loged_in:localStorage.getItem('auth_token'),
    email:localStorage.getItem('email'),
    user_name:localStorage.getItem('user_name'),
  }
},
methods:{
  logout(){
    localStorage.removeItem('auth_token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('user_name')
    this.$router.push({path:'/'})
  },
},


  
}