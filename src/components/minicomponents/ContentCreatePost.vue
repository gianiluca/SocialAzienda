<script>
import { useSessionStore } from '../../stores/sessionStore'
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { required, alpha } from '@vuelidate/validators'
import $ from 'jquery'

export default {
    setup() {
        const store = useSessionStore()
        return { store }
    },
    data() {
        return {
            user: {},
            media: '',
            description: '',
            v$: useVuelidate(),
        };
    },
    validations() {
        return {
            description: { required },
        }
    },
    methods: {
        uploadImage() {
            this.$refs.uploadButton.click()
        },
        imagePreview() {
            let reader = new FileReader();
            reader.readAsDataURL(this.$refs.uploadButton.files[0]);
            reader.onload = () => {
                this.$refs.chosenImage.setAttribute("src", reader.result);
            }
        },
        async Submit() {
            this.v$.$touch()
            if (!this.v$.$error) {
                var form = new FormData();
                form.append("image", this.$refs.uploadButton.files[0])

                var settings = {
                    "url": "https://api.imgbb.com/1/upload?key=553304cd513118a5ae948b8978f9743a",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };

                await $.ajax(settings).done((response) => {
                    var jx = JSON.parse(response);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
                    axios.post('https://socialccapi.azurewebsites.net/api/v1/PostAPI/CreaPost', {
                        media: String(jx.data.url),
                        contenuto: this.description
                    })
                    .then((response) => {
                    })
                    .catch((error) => {
                    });
                });
                await this.$router.push('/Profile/'+this.store.myusername)
            }
        },
        async getAll() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
            await axios.get('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/GetUtenteByToken', {
            }).then((response) => {
                this.user = response.data.result
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
        <div class="centro" style="position: relative;">
            <div class="container">
                <!-- Feeds -->
                <div class="feeds" id="contenitorepost" style="position: relative;">
                    <div class="feed" style="width: 100%;">
                        <div class="head">
                            <div class="user">
                                <div class="profile-picture">
                                    <img :src="this.store.immagineProfilo" alt="">
                                </div>
                                <div class="info">
                                    <h3>{{ user.userName }}</h3>
                                </div>
                            </div>
                            
                        </div>

                        <div class="feed-picture" @click="uploadImage">
                            <img id="chosen-image" src="../../assets/img/images.png" alt="" ref="chosenImage">
                        </div>
                        <input type="file" id="upload-button" accept="image/*" ref="uploadButton" @change="imagePreview">

                        <form class="create-post" action="">
                            <div class="container">
                                <div class="row">
                                    <span class="ms-1">
                                        <div class="input-errors" v-for="error of v$.description.$errors" :key="error.$uid">
                                            <div class="error-msg">{{ error.$message }}</div>
                                        </div>
                                    </span>
                                    <div class="col-md-9 col-12">
                                        <input type="text" placeholder="Inserisci la descrizione"
                                            id="descrizionePost" class="prova p-2" v-model="this.description">
                                    </div>
                                    <div class="col-md-3 col-12 justify-content-center" style="display: grid;">
                                        <button type="button" id="or" @click="Submit"
                                            class="btn btn-primary">Post</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.centro .create-post {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    background: var(--white-color);

    border-radius: var(--border-radius);
}

.create-post .row {
    display: flex;
    align-items: center;
}

.centro .create-post input[type="text"] {
    text-align: left;

    background-color: whitesmoke;
    /* padding: var(--btn-padding); */
    font-weight: 500;
    border-radius: var(--border-radius);
    width: 100%;
    transition: all 300ms ease;
    font-size: .9rem;
}

.imp {
    width: 3.7rem;
    height: 2.7rem;
    background-color: rebeccapurple;
    border-radius: 50%;
    overflow: hidden;
}

.imp img {
    width: 2.7rem;
    height: 2.7rem;
    object-fit: cover;
    object-position: center;
}

.centro .feeds .feed {
    background: var(--white-color);
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    font-size: .85rem;
    line-height: 1.5;
}

.centro .feeds .profile-picture img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
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
    border: 1px solid black;
    cursor: pointer;
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

input[type="file"] {
    display: none;
}
</style>