<script>
import axios from 'axios'
import { useSessionStore } from '../../stores/sessionStore'

export default {
    setup() {
        const store = useSessionStore()
        return { store }
    },
    data() {
        return {

        };
    },
    methods: {
        chiudipopImg() {
            this.$refs.ppupImg.style.display = "none";
            this.store.activeImgChange = false;
        },
        caricaImmagine() {
            this.$refs.uploadbut.click();
        },
        imagePrew() {
            let reader = new FileReader();
            reader.readAsDataURL(this.$refs.uploadbut.files[0]);
            reader.onload = () => {
                this.$refs.chosenimg.setAttribute("src", reader.result);
            }
        },
        ChangeImg() {
            var form = new FormData();
            form.append("image", this.$refs.uploadbut.files[0])
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
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
                axios.put('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/AggiornaFotoProfilo?fotoProfilo=' + jx.data.url, {})
                    .then((response) => {
                        this.chiudipopImg()
                        this.store.key++
                        this.$router.push('/')
                    })
                    .catch((error) => {
                    });
            });
        }
    },
    computed: {
        isActive() {
            return this.store.activeImgChange == true ? 'block' : 'none'
        }
    },
}
</script>

<template>
    <div class="popupesfondoImage" ref="ppupImg" :style="{ display: isActive }">
        <div class="sfondopop" @click="chiudipopImg">
        </div>
        <div class="pop-upManage">
            <div class="container">
                <div class="row">
                    <div class="col-12" style="position: relative;">
                        <input type="file" ref="uploadbut" id="upload-button" style="display: none;" accept="image/*"
                            @change="imagePrew">
                        <div class="immagineUser" @click="caricaImmagine">
                            <img ref="chosenimg" id="chosen-image"
                                src="https://icons-for-free.com/iconfiles/png/512/cloud+upload+file+storage+upload+icon-1320190558968694328.png">
                        </div>
                        <div class="bottonefoto">
                            <button @click="ChangeImg" class="btn btn-primary" style="width: 100%; height: 100%;">
                                Applica
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pop-upManage{
    position: absolute;
    overflow: hidden;
    left: 40%;
    top: 25%;
    border-radius: 25px;
    width: 20%;
    background-color: white;

    z-index: 99999;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.528);
}
.pop-upManage .immagineUser{
  position: absolute;
  cursor: pointer;
  left: 20%;
  top:10%;
  border-radius: 50%;
  height: 60%;
  overflow: hidden;
  width: 60%;
  border: solid black 2px;
}
.pop-upManage .immagineUser img{
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  border: solid black 2px;
}
.pop-upManage .bottonefoto
{
  position: absolute;
  bottom: 8%;
  left: 20%;
  border-radius: 25px;
  overflow: hidden;
  width: 60%;
  height: 14%;
}
.pop-upManage .bottonefoto button
{
  background-color: #3586ff;
  font-weight: 20px;
  font-weight: bold;
  color: white;

}
  .sfondoinv{
    position: absolute;
    display: none;
    background-color: transparent;
    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}
.sfondopop{
    position: absolute;
    background-color: transparent;
    backdrop-filter: blur(10px) brightness(0.8);


    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}


.popupesfondoImage{
display: none;
    position: absolute;
    background-color: transparent;
  display: none;
    height: 100%;
    width: 100%;
    z-index: 3;
    transition: 0.2s;
}
.pop-upManage .row .col-12
{
    height: 40vh;
    position: relative;
}
</style>