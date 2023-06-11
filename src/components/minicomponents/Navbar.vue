<script>
import { useSessionStore } from '../../stores/sessionStore'
import axios from 'axios'
import $ from 'jquery'

export default {
  setup() {
    const store = useSessionStore()
    return { store }
  },
  data() {
    return {
      count: 0,
      brand: { text: 'Social', url: '/' },
      userLinks: [
        { text: 'Login', url: '/Account/Login' },
        { text: 'Signup', url: '/Account/Signup' }
      ],
      inputValue: '',
      userSearched: [],
    };
  },
  methods: {
    logout() {
      this.store.clearToken()
      this.store.clearImmagineProfilo()
      this.$router.push('/Account/Login')
    },
    aprisearch() {
      this.$refs.cerca.style.display = "block";
      this.$refs.sin.style.display = "block";
    },
    chiudisearch() {
      this.$refs.cerca.style.display = "none";
      this.$refs.sin.style.display = "none";
    },
    searchForUser() {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
      axios.get('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/GetUtenteBySearch', {
        params: {
          search: this.inputValue
        }
      })
        .then((response) => {
          this.userSearched = response.data.result
        })
        .catch((error) => {
        });
    },
    tryIsMyAccount(username) {
      if (this.store.myusername != username) {
        this.store.isMyAccount = false
      } else {
        this.store.isMyAccount = true
      }

    },
    openPopupImg() {
      this.store.activeImgChange = true
    }
  },
}
</script>

<template>
  <div class="sfondoinv" ref="sin" @click="chiudisearch"></div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-2">
          <div class="leftNav">
            <div class="logo-picture">
              <img src="../../assets/logo.png">
            </div>
          </div>
        </div>
        <div class="col-md-6 col-8 " id="search">
          <div class="search-box m-0">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="search" class="ms-2" placeholder="Search for user" v-model="inputValue" @click="aprisearch"
              @input="searchForUser">
            <div class="searchhead" ref="cerca">
              <div class="utenti">
                <router-link :to="'/Profile/' + user.usernamePubblicante" class="utente" v-for="user in userSearched"
                  @click.prevent="tryIsMyAccount(user.usernamePubblicante)">
                  <div class="contenitoreut">
                    <div class="row" style="width: 100%;">
                      <div class="col-3">
                        <div class="imgprof">
                          <img class="img-fluid" :src="user.immagineDiProfiloUser">
                        </div>
                      </div>
                      <div class="col-9">
                        <div class="username">
                          <h5>{{ user.usernamePubblicante }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-2">
          <div class="rightNav">
            <router-link to="/CreatePost" id="createbut" for="#create-post" class="btn btn-primary">Create</router-link>
            <div class="dropdown">
              <div class="profile-picture dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="store.immagineProfilo" alt="">
              </div>
              <ul class="dropdown-menu" style="translate: -150px;">
                <div v-if="!this.store.isAuthenticated">
                  <li v-for="link in userLinks" class="dropdown-item">
                    <router-link :to="link.url">{{ link.text }}</router-link>
                  </li>
                </div>
                <div v-else>
                  <li class="dropdown-item">
                    <a class="dropdown-item ms-3" @click.prevent="openPopupImg">Change Image</a>
                    <a class="dropdown-item ms-3" @click.prevent="logout">Logout</a>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  #createbut {
    display: none;
  }
}

nav {
  background-color: rebeccapurple;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: var(--white-color);
  position: fixed;
  top: 0;
  padding: .7rem 0;
  z-index: 10;
}

nav .container {
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

nav .container .row {
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  background: var(--light-color);
  border-radius: var(--border-radius);
  padding: var(--search-padding);
  width: 100%;
  display: flex;
  overflow: hidden;
  margin-left: 14%;
}

.search-box input[type="search"] {
  background: transparent;
  width: 100%;
  margin-left: 2rem;
  font-size: .9rem;
  color: var(--dark-color);
}

nav .search-box input[type="search"]::placeholder {
  color: var(--gray-color);
}

nav .rightNav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.profile-picture {
  width: 2.7rem;
  height: 2.7rem;
  background-color: rebeccapurple;
  border-radius: 50%;
  overflow: hidden;
}

.profile-picture img {
  width: 2.7rem;
  height: 2.7rem;
  object-fit: cover;
  object-position: center;
}

nav .rightNav img {
  object-fit: cover;
  object-position: center;
  width: 2.7rem;
  height: 2.7rem;
}

nav .leftNav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.logo-picture {
  border-radius: 50%;
  overflow: hidden;
}

nav .leftNav img {
  object-fit: cover;
  object-position: center;
  width: 2.7rem;
  height: 2.7rem;
}

.sfondoinv {
  position: absolute;
  display: none;
  background-color: transparent;
  height: 100%;
  width: 100%;
  z-index: 3;
  transition: 0.2s;
}

.searchhead {
  position: absolute;
  top: 50px;
  width: 20%;
  display: none;
  box-shadow: 0px 10px 20px 5px rgba(0, 0, 0, 0.497);
  overflow-y: scroll;
  overflow-x: hidden;
  background: var(--white-color);
  max-height: 300px;
  border-radius: 20px;
}

@media screen and (max-width: 992px) {
  .searchhead{
    width: 40%;
  }
}

@media screen and (max-width: 576px) {
  .searchhead{
    width: 65%;
  }
}

.searchhead::-webkit-scrollbar {
  display: none;
}

.searchhead .searchhead .utenti {
  position: absolute;
  border-radius: 25px;
  top: 7%;
  left: 7%;
  width: 86%;
  width: 86%;
  background-color: whitesmoke;
  align-items: center;
  justify-content: center;
}

.searchhead .utenti .utente {
  position: relative;
  width: 100%;
  border-bottom: 2px solid black;
  background-color: whitesmoke;
  text-decoration: none;
}

.searchhead .utenti .utente .contenitoreut {
  padding: 7px;
  display: flex;
  align-items: center;
}

.searchhead .utenti .utente .contenitoreut .col-3 {
  justify-content: right;
  text-align: right;
}

.searchhead .utenti .utente .contenitoreut .col-9 {
  justify-content: center;
  text-align: left;
}

.searchhead .utenti .utente .imgprof {
  width: 2.7rem;
  height: 2.7rem;
  background-color: rebeccapurple;
  border-radius: 50%;
  overflow: hidden;
}

.searchhead .utenti .utente .imgprof img {
  width: 2.7rem;
  height: 2.7rem;
  object-fit: cover;
  object-position: center;
}</style>