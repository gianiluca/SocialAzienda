<script>
import { useSessionStore } from '../../stores/sessionStore'
import axios from 'axios'
import $ from 'jquery'

export default {
  setup() {
    const store = useSessionStore()
    store.isMyAccount = false
    return { store }
  },
  data() {
    return {
      posts: [],
      stories: [],
      colorLike: ''
    };
  },
  methods: {
    async getAll() {
      await axios.get('https://socialccapi.azurewebsites.net/api/v1/PostAPI/GetPostUtentiSeguitiInfo', {
      }).then((response) => {
        this.posts = response.data.result
        this.posts.forEach((post) => {
          post.likes.forEach((like) => {
            if (like.usernamePubblicante == this.store.myusername) {
              return post['isLiked'] = 'red'
            }
            post['isLiked'] = 'no'
          })
        })
      })
        .catch((error) => { });
      await axios.get('https://socialccapi.azurewebsites.net/api/v1/StoriaAPI/GetStorieUtentiSeguiti', {
      }).then((response) => {
        this.stories = response.data.result
      })
        .catch((error) => { });
    },
    openPopup(id, username) {
      this.store.active = true
      this.store.usernameForPopup = username
      this.store.idForPopup = id
    },
    apripopStorie(username) {
      this.store.activeStories = true
      if(username == 'la tua storia'){
        this.store.usernameForPopupStories = this.store.myusername
        this.store.isMyStory = true
      }else{
        this.store.usernameForPopupStories = username
      }
    },
    async likeDislike(isLiked, id) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
      var color = document.getElementById(id).style.color
      if (color !== 'red') {
        await axios.post('https://socialccapi.azurewebsites.net/api/v1/LikeAPI/LikePost?idPost=' + id, {
        }).then((response) => {
          document.getElementById(id).style.color = "red"
        })
          .catch((error) => { });
      } else {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
        await axios.delete('https://socialccapi.azurewebsites.net/api/v1/LikeAPI/DeleteLikePost', {
          params: {
            idPost: id
          }
        })
          .then((response) => {
            document.getElementById(id).style.color = "black"
          })
          .catch((error) => { });
      }
    },
    CreateStory() {
      this.$refs.uploadstorybut.click();
    },
    storyPrew() {
      let reader = new FileReader();
      reader.readAsDataURL(this.$refs.uploadstorybut.files[0]);
      reader.onload = () => {
        this.$refs.uploadedstory.style.display = 'block'
        this.$refs.uploadedstory.setAttribute("src", reader.result);
      }
    },
    PostStory() {
      var form = new FormData();
      form.append("image", this.$refs.uploadstorybut.files[0])

      var settings = {
        "url": "https://api.imgbb.com/1/upload?key=553304cd513118a5ae948b8978f9743a",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };
      $.ajax(settings).done((response) => {
        var jx = JSON.parse(response);
        axios.post('https://socialccapi.azurewebsites.net/api/v1/StoriaAPI/CreaStoria', {
          media: jx.data.url
        }).then((response) => {
          this.store.key++
          this.$router.push('/')
        }).catch((response) => {
        })
      });
    }
  },
  beforeMount() {
    this.getAll()
  },
};
</script>

<template>
  <div class="col-lg-6 col-10" style="position: relative;">
    <div class="centro" style="position: relative; margin: 0;">
      <div class="">
        <div class="stories">
          <div v-for="story in stories" @click="apripopStorie(story.user.usernamePubblicante)" class="story"
            :style="{ background: 'url(' + story.listaStorie[0].media + ') no-repeat center center/cover' }">
            <div class="profile-picture">
              <img class="img-fluid" :src="story.user.immagineDiProfiloUser" alt="">
            </div>
            <p class="name">{{ story.user.usernamePubblicante }}</p>
          </div>
          <div v-if="stories.length == 0" class="row empty">
            <h4 class="fw-bold">no one has posted a story yet!</h4>
          </div>
        </div>
        <!-- End of Stories -->

        <form class="create-post" action="">
          <div class="imp">
            <input type="file" id="upload-button2" ref="uploadstorybut" @change="storyPrew" style="display: none;"
              accept="image/*">
            <img id="imgstoriacambia" :src="this.store.immagineProfilo" alt="">
          </div>
          <label class="storiabtn" @click="CreateStory" style="cursor: pointer;">click for create a story</label>
          <button type="button" @click.prevent="PostStory" class="btn btn-primary" style="max-width: 100px;">Post</button>
        </form>
        <div class="row justify-content-center">
          <img class="previewstory m-4" src="" ref="uploadedstory">
        </div>

        <!-- Feeds -->
        <div class="feeds" id="contenitorepost" style="position: relative;">
          <div v-for="post in posts" class="feed" style="width: 100%" :key="post.id">
            <div class="head">
              <div class="user">
                <div class="profile-picture" id="imguserpost"><img :src="post.user.immagineDiProfiloUser" alt=""></div>
                <div class="info">
                  <h4><router-link :to="'/Profile/' + post.user.usernamePubblicante">{{ post.user.usernamePubblicante
                  }}</router-link></h4><small>{{ post.dataPubblicazione.substring(0,10) }}</small>
                </div>
              </div>
            </div>
            <div class="feed-picture" @click="openPopup(post.id, post.user.usernamePubblicante)"><img :src="post.media"
                alt=""></div>
            <div class="action-buttons">
              <div class="interaction-buttons">
                <span @click="likeDislike(post.isLiked, post.id)"><i class="fa-solid fa-heart" :id="post.id"
                    :style="{ color: post.isLiked }" ref="like"></i></span>
                <span class="ms-2" @click="openPopup(post.id, post.user.usernamePubblicante)"><i class="fa-solid fa-comment-dots"></i></span>
              </div>
            </div>
            <div v-if="post.likes.length != 0" class="liked-by">
              <span v-if="post.likes.length > 1"><img :src="post.likes[0].immagineDiProfiloUser" alt=""></span>
              <span v-if="post.likes.length > 2"><img :src="post.likes[1].immagineDiProfiloUser" alt=""></span>
              <p>liked by <b>{{ post.likes[0].usernamePubblicante }}</b> and <b>{{ post.likes.length }} others</b></p>
            </div>
            <div class="caption">
              <p>
              <h6>{{ post.user.usernamePubblicante }}</h6> {{ post.contenuto }}</p>
            </div>
            <div class="comments text-muted" @click="openPopup(post.id, post.user.usernamePubblicante)"
              style="cursor:pointer;">View all {{
                post.commenti.length }} comments</div>
          </div>
          <div v-if="posts.length == 0" class="row empty" style="margin-top: 60px;">
            <h5 class="fw-bold">use the navigation bar and follow some friends</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 576px) {
  .imp{
    display: none;
  }
}
.previewstory {
  display: none;
  width: 30%;
  height: 30%;
  border-radius: 25%;
}

.empty {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.story {
  cursor: pointer;
}

.profile-picture img {
  border-radius: 50%;
}


@media screen and (max-width: 768px) {
  .profile-picture {
    display: none;
  }
}

#imguserpost {
  width: 10%;
}

.centro ::-webkit-scrollbar {
  display: none;
}

.centro .stories {
  display: flex;
  justify-content: space-between;
  overflow-x: scroll;
  height: 12rem;
  gap: .5rem;

}

.centro .stories::-webkit-scrollbar {
  display: none;
}

.centro .stories .story {
  padding: var(--card-padding);
  border-radius: var(--card-border-radius);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: .75rem;
  width: 100%;
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.centro .stories .story::before {
  content: "";
  display: block;
  width: 100%;
  height: 5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, .75));
  position: absolute;
  bottom: 0;
}

.centro .stories .story .name {
  z-index: 2;
}

.centro .stories .profile-picture {
  width: 2rem;
  height: 2rem;
  align-self: start;
  border: 3px solid var(--primary-color);
  border-radius: 50%;
}

.centro .stories .profile-picture img {
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
}

/* Create Post */
.centro .create-post {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  background: var(--white-color);
  padding: .4rem var(--card-padding);
  border-radius: var(--border-radius);
}

.centro .create-post input[type="text"] {
  justify-self: start;
  width: 100%;
  padding-left: 1rem;
  background: transparent;
  color: var(--dark-color);
  margin-right: 1rem;
}

.centro .imp {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
}

.centro .imp img {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.centro .feeds .feed {
  background: var(--white-color);
  border-radius: var(--card-border-radius);
  padding: var(--card-padding);
  margin: 1rem 0;
  font-size: .85rem;
  line-height: 1.5;
}

.centro .feeds .profile-picture img {
  object-fit: cover;
  object-position: center;
}

.centro .feed .head {
  display: flex;
  justify-content: space-between;
}

.centro .feed .head .user {
  display: flex;
  gap: 1rem;
}

.centro .feed .feed-picture {
  border-radius: var(--card-border-radius);
  overflow: hidden;
  margin: .7rem 0;
}

.centro .feed .action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
  margin: 0.6rem;
}

.centro .liked-by {
  display: flex;
}

.centro .liked-by span {
  width: 1.4rem;
  height: 1.4rem;
  display: block;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--white-color);
  margin-left: -.5rem;
}

.centro .liked-by span:first-child {
  margin: 0;
}

.centro .liked-by p {
  margin-left: .5rem;
}

.centro .feeds img {
  display: block;
  width: 100%;
}
</style>