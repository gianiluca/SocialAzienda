<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { useSessionStore } from '../stores/sessionStore'

export default {
  setup() {
    const store = useSessionStore()
    return { store }
  },
  data() {
    return {
      username: '',
      password: '',
      v$: useVuelidate(),
    }
  },
  validations() {
    return {
      username: { required },
      password: { required }
    }
  },
  methods: {
    SubmitForm() {
      this.v$.$touch()
      if (!this.v$.$error) {
        axios.post('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/login', {
          userName: this.username,
          password: this.password,
        }).then((response) => {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.result.token;
          this.$swal({
            icon: 'success',
            title: 'Success!',
            text: 'You have been successfully logged!',
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
              this.$swal.showLoading()
            }
          }).then((result) => {
            if (result.dismiss === this.$swal.DismissReason.timer || result.dismiss === this.$swal.DismissReason.backdrop) {
              this.store.setToken(response.data.result.token)
              this.store.myusername = response.data.result.user.userName
              this.$router.push('/')
            }
          })
        })
        .catch((error) => {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Try again later',
          });
        });
      }
    }
  }
}
</script>

<template>
  <div class="login-form">
    <div class="form-container">
      <p class="title">Login</p>
      <form class="form">
        <div class="input-group">
          <label for="username">Username</label>
          <span class="ms-1">
            <div class="input-errors" v-for="error of v$.username.$errors" :key="error.$uid">
              <div class="error-msg"> - {{ error.$message }}</div>
            </div>
          </span>
          <input type="text" name="username" id="username" placeholder="" v-model="username">
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <span class="ms-1">
            <div class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
              <div class="error-msg"> - {{ error.$message }}</div>
            </div>
          </span>
          <input type="password" name="password" id="password" placeholder="" v-model="password">
          <div class="forgot">
            <a href="#">Forgot Password ?</a>
          </div>
        </div>
        <a to="/" class="sign" @click="SubmitForm">Sign in</a>
      </form>
      <div class="social-message">
        <div class="line"></div>
        <p class="message">Login with other accounts</p>
        <div class="line"></div>
      </div>
      <div class="social-icons">
        <button aria-label="Log in with Google" class="icon">
          <i class="fa-brands fa-google" style="color: #fff"></i>
        </button>
        <button aria-label="Log in with Facebook" class="icon">
          <i class="fa-brands fa-facebook" style="color: #ffffff;"></i>
        </button>
        <button aria-label="Log in with Microsoft" class="icon">
          <i class="fa-brands fa-windows" style="color: #ffffff;"></i>
        </button>
      </div>
      <p class="signup">Don't have an account?
        <router-link to="/Account/Signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<!-- style also valid for signup form beacuse is not scoped -->
<style>
.login-form,
.signup-form {
  display: grid;
  justify-content: center;
  align-items: center;
  padding: 45px;
}

.form-container {
  width: 320px;
  border-radius: 0.75rem;
  background-color: rgba(17, 24, 39, 1);
  padding: 2rem;
  color: rgba(243, 244, 246, 1);
  box-shadow: 0px 0px 20px 10px rgb(21, 30, 47);
}

.title {
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
}

.form {
  margin-top: 1.5rem;
}

.input-group {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  color: rgba(156, 163, 175, 1);
  margin-bottom: 4px;
}

.input-group input {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 0.75rem 1rem;
  color: rgba(243, 244, 246, 1);
}

.input-group input:focus {
  border-color: rgba(167, 139, 250);
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
  margin: 8px 0 14px 0;
}

.forgot a,
.signup a {
  color: rgba(243, 244, 246, 1);
  text-decoration: none;
  font-size: 14px;
}

.forgot a:hover,
.signup a:hover {
  text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
  display: block;
  width: 100%;
  background-color: rgba(167, 139, 250, 1);
  padding: 0.75rem;
  text-align: center;
  color: rgba(17, 24, 39, 1);
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  margin-top: 10px;
}

.sign:hover {
  cursor: pointer;
}

.social-message {
  display: flex;
  align-items: center;
  padding-top: 1rem;
}

.line {
  height: 1px;
  flex: 1 1 0%;
  background-color: rgba(55, 65, 81, 1);
}

.social-message .message {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(156, 163, 175, 1);
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons .icon {
  border-radius: 0.125rem;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  margin-left: 8px;
}

.social-icons .icon svg {
  height: 1.25rem;
  width: 1.25rem;
  fill: #fff;
}

.signup {
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
}
</style>