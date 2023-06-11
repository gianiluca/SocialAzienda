<script>
import axios from 'axios'
import { useSessionStore } from '../../stores/sessionStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import $ from 'jquery'

export default {
    setup() {
        const store = useSessionStore()
        return { store }
    },
    data() {
        return {
            comments: [],
            likes: [],
            likePopup: true,
            image: {},
            commento: '',
            v$: useVuelidate(),
        };
    },
    validations() {
        return {
            commento: { required },
        }
    },
    methods: {
        closePopup() {
            this.store.active = false
        },
        change(what) {
            if (what == 'likes') {
                this.likePopup = true
                this.$refs.atlike.className = "active";
                this.$refs.atcomm.classList.remove("active");
            }
            if (what == 'commenti') {
                this.likePopup = false
                this.$refs.atlike.classList.remove("active");
                this.$refs.atcomm.className = "active";
            }
        },
        async getCommenti() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/CommentoAPI/GetCommentiPost', {
                params: {
                    id: this.store.idForPopup
                }
            }).then((response) => {
                this.comments = response.data.result
            })
                .catch((error) => {
                });
        },
        getLike() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            axios.get('https://socialccapi.azurewebsites.net/api/v1/LikeAPI/GetLikePost', {
                params: {
                    id: this.store.idForPopup
                }
            }).then((response) => {
                this.likes = response.data.result
            })
                .catch((error) => {
                });
        },
        getPost() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            axios.get('https://socialccapi.azurewebsites.net/api/v1/PostAPI/GetPostByID', {
                params: {
                    id: this.store.idForPopup
                }
            }).then((response) => {
                this.image = response.data.result
            })
                .catch((error) => {
                });
        },
        SubmitComment() {
            this.v$.$touch()
            if (!this.v$.$error) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
                var url = 'https://socialccapi.azurewebsites.net/api/v1/CommentoAPI/CreaCommento?idPost=' + this.store.idForPopup
                axios.post(url, {
                    contenuto: this.commento
                }).then((response) => {
                    this.getCommenti()
                    this.commento = ''
                })
                    .catch((error) => {
                    });
            }
        },
        deleteComment(id){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            axios.delete('https://socialccapi.azurewebsites.net/api/v1/CommentoApi/EliminaCommento', {
                params:{
                    id: id
                }
            })
            .then((response) => {
                this.getCommenti()
            })
            .catch((error) => {
            });
        },
        deletePost(id){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            axios.delete('https://socialccapi.azurewebsites.net/api/v1/PostAPI/EliminaPost', {
                params:{
                    id: id
                }
            })
            .then((response) => {
                this.closePopup()
                this.store.key++
                this.$router.push('/Profile/' + this.store.myusername)
            })
            .catch((error) => {
            });
        },
        IsMyProfile(value){
            if(value == this.store.myusername){
                this.store.isMyAccount = true
            }
            this.closePopup()
        }
    },
    computed: {
        isActive() {
            if(this.store.active == true){
                this.getCommenti()
                this.getLike()
                this.getPost()
            }
            return this.store.active == true ? 'block' : 'none'
        }
    },
}
</script>

<template>
    <div class="popupesfondo" id="ppup" :style="{ display: isActive }">
        <div class="sfondopop" @click="closePopup">
        </div>
        <div class="pop-up">
            <div class="container">
                <div class="row">
                    <div class="col-md-6" style="position: relative;">
                        <div class="immaginepost">
                            <img :src="image.media">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="messages">
                            <!-- Search Bar -->
                            <div class="row" v-if="this.store.isMyAccount == true">
                                <div class="col-6 justify-content-center mt-2" style="display: grid; align-items: center;">
                                    <h5>@{{ this.store.myusername }}</h5>
                                </div>
                                <div class="col-6 justify-content-center mt-2" style="display: grid;">
                                    <router-link :to="this.$route.path" type="button" @click.prevent="deletePost(this.store.idForPopup)" class="btn btn-primary">Delete Post</router-link>
                                </div>
                            </div>
                            <div class="justify-content-center mt-4" v-else style="display: grid; align-items: center;">
                                <router-link :to="'/Profile/' + this.store.usernameForPopup" @click="IsMyProfile(this.store.usernameForPopup)">@{{ this.store.usernameForPopup }}</router-link>
                            </div>
                            <div class="message-category">
                                <h6 class="active" @click="change('likes')" id="atlike" ref="atlike">Like</h6>
                                <h6 @click="change('commenti')" id="atcomm" ref="atcomm">Commenti</h6>
                            </div>


                            <!-- like -->
                            <div class="messaggi" id="contmes" ref="contmes" v-if="likePopup">
                                <div class="message" v-if="likes.length > 0" v-for="like in likes">
                                    <div class="profile-picture">
                                        <img class="img-fluid" :src="like.immagineDiProfiloUser" alt="">
                                    </div>
                                    <div class="message-body">
                                        <h5>{{ like.usernamePubblicante }}</h5>
                                    </div>
                                </div>
                                <div v-else class="message justify-content-center">
                                    No one likes this post
                                </div>
                            </div>


                            <!-- commenti -->
                            <div class="messaggi" id="contmes" ref="contmes" v-else>
                                <span class="ms-1">
                                    <div class="input-errors" v-for="error of v$.commento.$errors" :key="error.$uid">
                                        <div class="error-msg">{{ error.$message }}</div>
                                    </div>
                                </span>
                                <div class="create-comment row">
                                    <div class="col-md-6 col-12" style="height: auto;">
                                        <input type="text" class="m-2" placeholder="Comment" id="create-post" v-model="commento">
                                    </div>
                                    <div class="col-md-6 col-12" style="height: auto;">
                                        <button type="button" class="btn btn-primary m-2" @click="SubmitComment">Comment</button>
                                    </div>
                                </div>
                                <div class="message mb-0" v-for="comment in comments">
                                    <div class="row" style="width: 100%;">
                                        <div class="profile-picture col-3 ps-2">
                                            <img class="img-fluid" :src="comment.user.immagineDiProfiloUser" alt="">
                                        </div>
                                        <div class="message-body col-7">
                                            <h5>{{ comment.user.usernamePubblicante }}</h5>
                                            <p class="text-muted">{{ comment.contenuto }}</p>
                                        </div>
                                        <div class="col-2" v-if="comment.user.usernamePubblicante == this.store.myusername">
                                            <div class="dropdown" style="overflow: none; cursor: pointer;">
                                                <i class="fa-solid fa-ellipsis" data-bs-toggle="dropdown"></i>    
                                                <ul class="dropdown dropdown-menu">
                                                    <li><a class="dropdown-item" @click="deleteComment(comment.id)"><span class="me-2"><i class="fa-solid fa-trash"></i></span>Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.dropdown-toggle::after {
    display: none;
}

.dropdown-toggle {
    background-color: #fff;
}

.pop-up {
    position: absolute;
    background-color: white;
    overflow: hidden;
    left: 18%;
    top: 25%;
    border-radius: 25px;
    width: 65%;
    transition: all 5s ease-in-out;
    z-index: 99999;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.528);
    animation: popup 1s;
}
@media screen and (max-width: 768px) {
    .pop-up{
        top: 15%;
        max-height: 80%;
        overflow-y: auto;
    }
}

@keyframes popup {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.4);
    }

    60% {
        transform: scale(1.1);
    }

    70% {
        transform: scale(1.2);
    }

    80% {
        transform: scale(1);
    }

    90% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

.sfondopop {
    position: absolute;
    background-color: transparent;
    backdrop-filter: blur(10px) brightness(0.8);
    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}

.popupesfondo {
    position: absolute;
    background-color: transparent;
    display: none;
    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}

.pop-up .row .col-md-6 {
    height: 55vh;
    position: relative;
}

.immaginepost {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99999;
}

.immaginepost img {
    background: var(--white-color);
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 99999;
}


.messages {
    background: var(--white-color);
    position: absolute;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    top: 0;
    left: 0%;
    height: 100%;
    width: 100%;
    z-index: 99999;

}

.messages .message-category {
    padding-left: var(--card-padding);
    padding-right: var(--card-padding);
    padding-top: 25px;
}

.message-body {
    align-items: center;

}

.messaggi {

    padding-left: var(--card-padding);
    padding-right: var(--card-padding);
    padding-bottom: var(--card-padding);
    justify-content: center;
    overflow-y: scroll;
    height: 75%;
    -ms-overflow-style: none;
    scrollbar-width: none;
}


.messaggi::-webkit-scrollbar {
    display: none;
}

.messages i {
    font-size: 1.4rem;
}

.messages .search-box {
    display: flex;

    margin-bottom: 1rem;
}

.messages .message-category {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    cursor: pointer;
}

.messages .message-category h6 {
    width: 100%;
    text-align: center;
    border-bottom: 4px solid var(--light-color);
    padding-bottom: .5rem;
    font-size: .85rem;
}

.messages .message-category .active {
    border-color: var(--dark-color);
}

.messages .message .message-requests {
    color: var(--primary-color);
}

.messages .message {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

}

.messages .message .profile-picture {
    position: relative;
}

.message .profile-picture img {
    border-radius: 50%;
}

.messages .message:last-child {
    margin: 0;
}

.messages .message p {
    font-size: 0.8rem;
}

.messages .message .profile-picture .active {
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
    border: 3px solid var(--white-color);
    background: var(--success-color);
    position: absolute;
    bottom: 0;
    right: 0;
}

.create-comment {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--card-padding);
    border-radius: var(--border-radius);
}

.create-comment input[type="text"] {
    justify-self: start;
    width: 100%;
    padding-left: 1rem;
    background: transparent;
    color: var(--dark-color);
    margin-right: 1rem;
}
</style>