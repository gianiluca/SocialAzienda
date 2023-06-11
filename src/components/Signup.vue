<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, alphaNum, helpers, sameAs } from '@vuelidate/validators'
import axios from 'axios'

const name = helpers.regex(/^[a-z A-Z,.']+$/)
const pass = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export default {
    data() {
        return {
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            v$: useVuelidate()
        }
    },
    validations() {
        return {
            fullName: { required, name: helpers.withMessage('Value must be alphabetical', name) },
            username: { required, alphaNum },
            email: { required, email },
            password: { required, pass: helpers.withMessage('Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:', pass) },
            confirmPassword: { required, sameAspassword: sameAs(this.password) }
        }
    },
    methods: {
        SubmitForm() {
            this.v$.$touch()
            if (!this.v$.$error) {
                axios.post('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/register', {
                    userName: this.username,
                    email: this.email,
                    name: this.fullName,
                    password: this.confirmPassword,
                    role: 'customer'
                })
                .then((response) => {
                    this.$swal({
                        icon: 'success',
                        title: 'Success!',
                        text: 'You have been successfully registrated!',
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: () => {
                            this.$swal.showLoading()
                        }
                    }).then((result) => {
                        if (result.dismiss === this.$swal.DismissReason.timer || result.dismiss === this.$swal.DismissReason.backdrop) {
                            this.$router.push('/Account/Login')
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
    <div class="signup-form">
        <div class="form-container">
            <p class="title">Sign up</p>
            <form class="form" ref="form">
                <div class="row">
                    <div class="input-group col-md">
                        <label for="email">Email</label>
                        <span class="ms-1">
                            <div class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
                                <div class="error-msg"> - {{ error.$message }}</div>
                            </div>
                        </span>
                        <input type="text" name="email" id="email" placeholder="some@gmail.com" v-model="this.email">
                    </div>
                    <div class="input-group col-md">
                        <label for="username">Username</label>
                        <span class="ms-1">
                            <div class="input-errors" v-for="error of v$.username.$errors" :key="error.$uid">
                                <div class="error-msg"> - {{ error.$message }}</div>
                            </div>
                        </span>
                        <input type="text" name="username" id="username" placeholder="" v-model="this.username">
                    </div>
                </div>
                <div class="row">
                    <div class="input-group col-md">
                        <label for="password">Password</label>
                        <span class="ms-1">
                            <div class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
                                <div class="error-msg"> - {{ error.$message }}</div>
                            </div>
                        </span>
                        <input type="password" name="password" id="password" placeholder="" v-model="this.password">
                    </div>
                    <div class="input-group col-md">
                        <label for="confirmPassword">Confirm Password</label>
                        <span class="ms-1">
                            <div class="input-errors" v-for="error of v$.confirmPassword.$errors" :key="error.$uid">
                                <div class="error-msg"> - {{ error.$message }}</div>
                            </div>
                        </span>
                        <input type="password" name="confirmPassword" id="confirmPassword" placeholder=""
                            v-model="this.confirmPassword">
                    </div>
                </div>
                <div class="row">
                    <div class="input-group col-md">
                        <label for="fullName">Full Name</label>
                        <span class="ms-1">
                            <div class="input-errors" v-for="error of v$.fullName.$errors" :key="error.$uid">
                                <div class="error-msg"> - {{ error.$message }}</div>
                            </div>
                        </span>
                        <input type="text" name="fullName" id="fullName" placeholder="" v-model="fullName">
                    </div>
                    <div class="input-group col-md">
                        <label for="birthdate">Birth Date</label>
                        <input type="date" name="birthdate" id="birthdate" placeholder="">
                    </div>
                </div>
                <a class="sign my-3" @click="SubmitForm">Sign Up</a>
            </form>
            <p class="signup">Do you already have an account?
                <router-link to="/Account/Login">Sign in</router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.form-container {
    min-width: 320px !important;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
    box-shadow: 0px 0px 20px 10px rgb(21, 30, 47);
}

@media screen and (min-width: 768px) {
    .form-container {
        width: 800px;
    }
}
</style>