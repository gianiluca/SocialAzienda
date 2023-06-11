<script>
import { useSessionStore } from '../../stores/sessionStore'
import axios from 'axios'

export default {
    setup() {
        const store = useSessionStore()
        return { store }
    },
    data() {
        return {
            posts: [],
            postsinthree: [],
            followers: [],
            following: [],
            numPosts: 0,
            followingUser: false,
            imgProfileUser: '',
        };
    },
    methods: {
        async getAll() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            var user = this.$route.params.username
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/PostAPI/GetPostUtente', {
                params: {
                    username: user
                }
            })
                .then((response) => {
                    this.posts = response.data.result
                    this.numPosts = response.data.result.length
                    const parts = Math.ceil(this.posts.length / 3);
                    for (let i = 0; i < parts; i++) {
                        this.postsinthree.push(this.posts.splice(0, 3))
                    }
                })
                .catch((error) => {
                });
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/FollowAPI/GetSeguiti', {
                params: {
                    username: user
                }
            }).then((response) => {
                this.following = response.data.result
            })
                .catch((error) => {
                });
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/FollowAPI/GetFollower', {
                params: {
                    username: user
                }
            }).then((response) => {
                this.followers = response.data.result
                response.data.result.forEach(follower => {
                    if (follower == this.store.myusername) {
                        return this.followingUser = true
                    }
                });
                if (this.followers.length == 0) { return this.followingUser = false }
            })
                .catch((error) => {
                });
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/GetUtenteByUser', {
                params: {
                    username: this.$route.params.username
                }
            }).then((response) => {
                this.imgProfileUser = response.data.result.immagineProfilo
            })
                .catch((error) => { });
        },
        openPopup(id, username) {
            this.store.active = true
            this.store.idForPopup = id
        },
        openPopupImg() {
            this.store.activeImgChange = true
        },
        async Follow(username) {
            console.log(username)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.post('https://socialccapi.azurewebsites.net/api/v1/FollowAPI/SeguiUtente?utenteDaSeguire=' + username, {})
                .then((response) => {
                    console.log(response)
                    this.store.key++
                    var url = this.$route.path
                    this.$router.push(url)
                })
                .catch((error) => {
                });
        },
        async Unfollow(username) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.delete('https://socialccapi.azurewebsites.net/api/v1/FollowAPI/UnfollowUtente', {
                params: {
                    UtenteDaUnfolloware: username
                }
            })
                .then((response) => {
                    console.log(response.data.result)
                    this.store.key++
                    var url = this.$route.path
                    this.$router.push(url)
                })
                .catch((error) => {
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
        <div class="centro">
            <div class="InformazioniUtente">
                <div class="container">
                    <div class="row justify-content-center mt-3" style="display: grid;">
                        <h3>{{ this.$route.params.username }}</h3>
                    </div>
                    <div class="row p-0">
                        <div class="col-md-3 col-12 p-0">
                            <div class="contfotoProfilo">
                                <div class="fotoProfilo">
                                    <img :src="this.imgProfileUser" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-4 p-0">
                            <div class="text" style="width: 100%; text-align: center;">
                                <p class="mb-0">Followers</p><strong>{{ this.followers.length }}</strong>
                            </div>
                        </div>
                        <div class="col-md-3 col-4 p-0">
                            <div class="text" style="width: 100%; text-align: center;">
                                <p class="mb-0">Post</p><strong>{{ numPosts }}</strong>
                            </div>
                        </div>
                        <div class="col-md-3 col-4 p-0">
                            <div class="text" style="width: 100%; text-align: center;">
                                <p class="mb-0">Following</p><strong>{{ this.following.length }}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12" style="text-align: center; width: 100%;">
                            <div v-if="this.store.isMyAccount == true" class="modif-pr">
                                <button @click="openPopupImg">Change Profile Image</button>
                            </div>
                            <div v-else class="modif-pr">
                                <button @click.prevent="Unfollow(this.$route.params.username)" v-if="followingUser">Already
                                    Following</button>
                                <button @click.prevent="Follow(this.$route.params.username)"
                                    v-if="!this.followingUser">Follow</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Feeds -->
            <div class="postUtente">
                <div class="container">
                    <div v-for="posts in postsinthree" class="row">
                        <div v-for="post in posts" class="col-sm-4">
                            <div class="post">
                                <img @click="openPopup(post.id)" :src="post.media" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.centro .InformazioniUtente {
    width: 100%;
    min-height: 150px;
    align-items: center;
    justify-content: center;
    background: var(--white-color);
    padding: .4rem var(--card-padding);
    border-radius: var(--border-radius);
}

.fotoProfilo {
    width: 4.2rem;
    height: 4.2rem;
    display: block;
    margin-left: auto;
    margin-right: auto;

    background-color: rebeccapurple;
    border-radius: 50%;
    overflow: hidden;
}

.centro .InformazioniUtente p {
    margin-top: 10px;
}

.centro .InformazioniUtente img {
    object-fit: cover;
    object-position: center;
    width: 4.2rem;
    height: 4.2rem;
}

.centro .InformazioniUtente .modif-pr button {
    width: 100%;
    color: white;
    background-color: rgb(2, 128, 255);
    border-radius: 50px;
    height: 30px;
}

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