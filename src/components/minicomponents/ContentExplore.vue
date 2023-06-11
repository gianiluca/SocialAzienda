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
      posts: [],
      postsinthree: [],
    };
  },
  methods: {
    async getAll() {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
      var user = this.$route.params.username
      await axios.get('https://socialccapi.azurewebsites.net/api/v1/PostAPI/GetPostExplore', {
        params: {
            username: user
        }
      })
      .then((response) => {
        this.posts = response.data.result
        const parts = Math.ceil(this.posts.length / 3);
        for (let i = 0; i < parts; i++) {
            this.postsinthree.push(this.posts.splice(0,3))
        }
      })
        .catch((error) => {
        });
    },
    openPopup(id, username) {
      this.store.active = true
      this.store.idForPopup = id
      this.store.usernameForPopup = username
    },
  },
  beforeMount() {
    this.getAll()
  },
};
</script>

<template>
    <div class="col-lg-6 col-10" style="position: relative;">
        <div class="centro" style="position: relative;">
            <div class="postUtente">
                <div class="container">
                    <div v-for="posts in postsinthree" class="row">
                        <div v-for="post in posts" class="col-sm-4">
                            <div class="post">
                                <img @click="openPopup(post.id, post.user.usernamePubblicante)" :src="post.media" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .postUtente .container .row .col-sm-4 {
    margin-top: 10px;
}

.post {
    position: relative;
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    cursor: pointer;
    transition: 0.5s;
}

.post::after {
    content: "";
    display: block;
    padding-bottom: 100%;
}

.post:hover {
    transform: scale(0.95);
}

.postUtente img {
    position: absolute;
    width: 100%;
    padding: 2%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>