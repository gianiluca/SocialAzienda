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
      user: {},
      menu: [
        { text: 'Home', url: '/', icon: 'fa-solid fa-house' },
        { text: 'Explore', url: '/Explore', icon: 'fa-solid fa-compass' },
        { text: 'Message', url: '/Chat', icon: 'fa-solid fa-envelope' },
      ]
    };
  },
  methods: {
    getAll() {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
      axios.get('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/GetUtenteByToken', {
      }).then((response) => {
        this.user = response.data.result
        this.store.setImmagineProfilo(this.user.immagineProfilo)
        this.store.myusername = this.user.userName
      })
        .catch((error) => {
        });
    },
    IsMyProfile(value){
      this.store.isMyAccount = value
    }
  },
  beforeMount() {
    this.getAll()
  },
};
</script>

<template>
  <div class="col-lg-3 col-2" style="position: relative;">
    <div class="sinistra">
      <aside>
        <router-link :to="'/Profile/' + user.userName" @click.prevent="IsMyProfile(true)" class="profile" id="profile">
          <div class="profile-picture">
            <img class="img-fluid" :src="user.immagineProfilo" alt="">
          </div>
          <div class="text-profile">
            <p class="mb-1">{{ user.name }}</p>
            <p class="text-muted mb-1">
              @{{ user.userName }}
            </p>
          </div>
        </router-link>
        <div class="sidebar-menu">
          <router-link v-for="link in menu" :to="link.url" class="menu-item">
            <span class="sidebar-icon"><i :class="link.icon"></i></span>
            <h3 class="ms-2 mb-0">{{ link.text }}</h3>
          </router-link>
        </div>
        <router-link to="/CreatePost" for="#create-post" class="btn btn-primary">
          Create Post
        </router-link>
      </aside>
    </div>
  </div>
</template>

<style scoped>
aside .sidebar-menu {
  margin-top: 2rem;
  background: var(--white-color);
  border-radius: var(--card-border-radius);
}

@media screen and (max-width: 992px) {
  aside .sidebar-menu {
    display: grid;
    justify-content: center;
  }

  aside .sidebar-menu i {
    margin-left: 0;
  }
}

aside .sidebar-menu .menu-item {
  height: 4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 400ms ease;
  position: relative;
}

aside .sidebar-menu .menu-item:hover {
  background: var(--light-color);
}

aside .sidebar-menu i {
  font-size: 1.4rem;
  color: var(--gray-color);
  position: relative;
}

@media screen and (min-width: 992px) {
  aside .sidebar-menu i{
    margin-left: 2rem;
  }
}

aside .sidebar-menu i .notification-number {
  background: var(--danger-color);
  color: white;
  font-size: .7rem;
  width: fit-content;
  border-radius: .8rem;
  padding: .1rem .4rem;
  position: absolute;
  top: -.5rem;
  right: -1.2rem;
}

aside .sidebar-menu h3 {
  margin-left: 1.5rem;
  font-size: 1rem;
}

aside .sidebar-menu .active {
  background: var(--light-color);
}

aside .sidebar-menu .active i,
aside .sidebar-menu .active h3 {
  color: var(--primary-color);
}

aside .sidebar-menu .active::before {
  content: "";
  display: block;
  width: .5rem;
  height: 100%;
  position: absolute;
  background: var(--primary-color);
}

aside .sidebar-menu .menu-item:first-child.active {
  border-top-left-radius: var(--card-border-radius);
  overflow: hidden;
}

aside .sidebar-menu .menu-item:last-child.active {
  border-bottom-left-radius: var(--card-border-radius);
  overflow: hidden;
}

aside .btn {
  margin-top: 1rem;
  width: 100%;
  text-align: center;
  padding: 1rem 0;
}

.profile-picture {
  object-fit: cover;
    object-position: center;
}
</style>