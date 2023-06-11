<script>
import axios from 'axios'
import { useSessionStore } from '../../stores/sessionStore'
import $ from 'jquery'

export default {
    setup() {
        const store = useSessionStore()
        return { store }
    },
    data() {
        return {
            stories: [],
            activestorie: 1
        };
    },
    methods: {
        chiudipopStorie() {
            this.$refs.ppupStories.style.display = "none";
            this.store.activeStories = false;
            this.store.isMyStory = false
            this.activestorie = 1
        },
        async getStories() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/StoriaAPI/GetStorieUtente', {
                params: {
                    username: this.store.usernameForPopupStories
                }
            }).then((response) => {
                this.stories = response.data.result.listaStorie
                setTimeout(() => { 
                    this.$refs.carousel.forEach(element => {
                        element.classList.value = 'carousel-item'
                    });
                    this.$refs.carousel[0].classList.value = 'carousel-item active' 
                }, 500);        //0,5 s per aspettare che vengare renderizzato da v-for
            })
                .catch((error) => {
                });
        },
        async DeleteStory(id){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.delete('https://socialccapi.azurewebsites.net/api/v1/StoriaAPI/EliminaStoria', {
                params: {
                    id: id
                }
            }).then((response) =>{
                this.chiudipopStorie()
                this.store.key++
                this.$router.push('/')
            }).catch((response) => {
            })
        }
    },
    computed: {
        isActiveStories() {
            if (this.store.activeStories == true) {
                this.getStories()
            }
            return this.store.activeStories == true ? 'block' : 'none'
        },
        numStories() {
            if (this.activestorie > this.stories.length) { this.activestorie = 1 }
            if (this.activestorie < 1) { this.activestorie = this.stories.length }
            return this.activestorie
        },
    },
}
</script>

<template>
    <div class="popupesfondoStorie" id="ppupStories" ref="ppupStories" :style="{ display: isActiveStories }">
        <div class="sfondopopStorie" @click="chiudipopStorie">
        </div>
        <div class="pop-upStorie">
            <div class="container">
                <div class="row">
                    <div class="col-12" style="position: relative;">

                        <div class="immaginepostStorie">
                            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner" id="carousel2">
                                    <div v-for="story in stories" ref="carousel" class="carousel-item">
                                        <div class="num p-2">
                                            {{ numStories }} of {{ stories.length }}
                                        </div>
                                        <div v-if="this.store.isMyStory" class="num2 p-2">
                                            <div class="dropdown" style="overflow: none; cursor: pointer;">
                                                <i class="fa-solid fa-ellipsis" data-bs-toggle="dropdown"></i>
                                                <ul class="dropdown dropdown-menu">
                                                    <li><a class="dropdown-item" @click="DeleteStory(story.id)"><span class="me-2"><i class="fa-solid fa-trash"></i></span>Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <img :src="story.media" alt="...">
                                    </div>
                                </div>
                                <button class="carousel-control-prev" type="button"
                                    data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"
                                        @click="activestorie--"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button"
                                    data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"
                                        @click="activestorie++"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pop-upStorie {
    position: absolute;
    overflow: hidden;
    left: 40%;
    top: 25%;
    border-radius: 25px;
    width: 20%;
    transition: all 5s ease-in-out;
    z-index: 99999;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.528);
    animation: popup 1s;
}

@media screen and (max-width: 992px) {
    .pop-upStorie{
        left: 30%;
        width: 40%;
    }
}

@media screen and (max-width: 768px) {
    .pop-upStorie{
        left: 20%;
        width: 60%;
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

.sfondoinv {
    position: absolute;
    display: none;
    background-color: transparent;
    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}

.sfondopopStorie {
    position: absolute;
    background-color: transparent;
    backdrop-filter: blur(10px) brightness(0.8);


    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}

.pop-upStorie .carousel {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 100%;

}

.carousel img {
    object-fit: cover;
    object-position: center;
    position: relative;
    height: 55vh;
    width: 100%;
}

.popupesfondoStorie {

    position: absolute;
    background-color: transparent;
    display: none;
    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}

.pop-upStorie .row .col-12 {
    height: 55vh;
    position: relative;
}

.num {
    position: absolute;
    z-index: 99;
    background-color: rgba(255, 255, 255, 0.39);
    left: 0;
}

.num2 {
    display: grid;
    justify-content: end;
    background-color: rgba(255, 255, 255, 0.39);
    position: absolute;
    z-index: 99;
    right: 0;
}
</style>