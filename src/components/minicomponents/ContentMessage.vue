<script>
import axios from 'axios'
import Paho from 'paho-mqtt'
import { useSessionStore } from '../../stores/sessionStore'

export default {
  setup() {
    const store = useSessionStore()
    return { store }
  },
  data() {
    return {
      messages: [],
      message: '',
      input: '',
      users: [],
      activebutton: false
    }
  },
  methods: {
    prendiUtenti() {
      if (this.input == '') {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
        axios.get('https://socialccapi.azurewebsites.net/api/v1/ChatApi/GetChat', {})
          .then((response) => {
            this.users = response.data.result.listaChat
          })
          .catch((response) => {
          })
      } else {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
        axios.get('https://socialccapi.azurewebsites.net/api/v1/UsersAuth/GetUtenteBySearch?search=' + this.input, {})
          .then((response) => {
            this.users = response.data.result
          })
          .catch((response) => {
          })
      }
    },
    avviaClientMqtt(user, dest, img) {
      this.store.immagineProfiloDest = img
      this.activebutton = true
      this.store.userforMess = dest
      this.apriChat(dest)
      const client = new Paho.Client('broker.hivemq.com',        // (4)
        8000, user);

      client.connect({
        onSuccess: () => {
          client.subscribe('socialvg' + user);
        }
      });
      client.onMessageArrived = (message) => {
        this.apriChat(dest);
      };
    },
    Publishe(user, dest, message) {
      const client = new Paho.Client('broker.hivemq.com', 8000, user);
      client.connect({
        onSuccess: () => {
          $.ajax({
            url: 'https://socialccapi.azurewebsites.net/api/v1/ChatApi/MandaMessaggio?usernameDestinatario=' + dest,
            type: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + this.store.token
            },
            data: JSON.stringify({ "contenuto": message }),
            dataType: 'json',
            success: (result) => {
              var imgprofile = this.store.immagineProfilo
              document.getElementById('chat').innerHTML = document.getElementById('chat').innerHTML + '<div class="d-flex flex-row justify-content-end"><div><p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">' + message + '</p></div><img src="' + imgprofile + '"alt="avatar 1" style="width: 45px; height: 100%;"></div>';
              client.publish("socialvg" + dest, "mandato", 1, false)
              this.scrolldown();
              this.avviaClientMqttNoC(user, dest)
              document.getElementById('in').value = ''
            },
            error: (result) => {  }
          });
        }
      });
    },
    apriChat(user) {
      $.ajax({
        url: 'https://socialccapi.azurewebsites.net/api/v1/ChatApi/GetMessaggiChat?usernameDest=' + user,
        type: 'GET',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('Authorization', 'Bearer ' + this.store.token);
        },
        data: {},
        success: (response) => {
          var innhtml = "";
          var imgprofile = this.store.immagineProfilo
          if (response.result != null) {
            for (let i = 0; i < response.result.length; i++) {
              if (response.result[i].mittente == true) {
                innhtml = innhtml + '<div class="d-flex flex-row justify-content-end"><div><p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">' + response.result[i].contenuto + '</p></div><img src="' + imgprofile + '"alt="avatar 1" style="width: 45px; height: 100%;"></div>';
              }
              else {
                innhtml = innhtml + ' <div class="d-flex flex-row justify-content-start"><img src="' + this.store.immagineProfiloDest + '"alt="avatar 1" style="object-fit: cover; border-radius: 50%; height: 40px; width: 40px;"><div><p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">' + response.result[i].contenuto + '</p></div></div>';
              }
            }
          }
          document.getElementById('chat').innerHTML = innhtml;
          this.scrolldown();
        },
        error: () => { },
      });
    },
    avviaClientMqttNoC(user, dest) {
      const client = new Paho.Client('broker.hivemq.com', 8000, user);
      client.connect({
        onSuccess: () => {
          client.subscribe('socialvg' + user);
        }
      });
      client.onMessageArrived = (message) => {
        this.apriChat(dest);
        this.scrolldown()
      };
    },
    scrolldown() {
      const element = document.getElementById('chat');
      element.scrollTop = element.scrollHeight;
    }
  },
  beforeMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
    axios.get('https://socialccapi.azurewebsites.net/api/v1/ChatApi/GetChat', {
    }).then((response) => {
      this.users = response.data.result.listaChat
    }).catch((response) => {
    })
  }
}
</script>

<template>
  <div class="col-lg-9 col-10" style="position: relative;">
    <div class="centro">
      <div class="container" data-mdb-perfect-scrollbar='true'>
        <div class="row">
          <div class="col-md-12">
            <div class="card" id="chat3" style="border-radius: 15px;">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                    <div class="p-3" id="userslist" >
                      <div class="input-group rounded mb-3">
                        <input type="search" class="form-control rounded" id="searchcus" placeholder="Search"
                          @input="prendiUtenti" aria-label="Search" aria-describedby="search-addon" v-model="input" />
                        <span class="input-group-text border-0" id="search-addon">
                          <i class="fas fa-search"></i>
                        </span>
                      </div>
                      <div id="user" data-mdb-perfect-scrollbar="true" style="position: relative; height: 80%">
                        <ul class="list-unstyled mb-0" id="users">
                          <li v-for="user in users" class="p-2 border-bottom"
                            @click="avviaClientMqtt(this.store.myusername, user.usernamePubblicante, user.immagineDiProfiloUser)">
                            <a class="d-flex justify-content-between">
                              <div class="d-flex flex-row">
                                <div class="contimg">
                                  <img :src="user.immagineDiProfiloUser" alt="avatar"
                                    class="d-flex align-self-center me-3" width="60" id="imgprof">
                                  <span class="badge bg-success badge-dot"></span>
                                </div>
                                <div class="pt-1">
                                  <p class="fw-bold mb-0">{{ user.usernamePubblicante }}</p>
                                  <p class="small text-muted">Scrivi al tuo amico</p>
                                </div>
                              </div>
                              <div class="pt-1"></div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-7 col-xl-8">
                    <div id="chat" class="pt-3 pe-3" data-mdb-perfect-scrollbar="true"
                      style="position: relative; height: 400px;">
                    </div>
                    <div id="btchat" class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                      <img :src="this.store.immagineProfilo"
                        alt="avatar 3" style="width: 40px; height: 100%;">
                      <input type="text" id="in" class="form-control form-control-lg" placeholder="Type message"
                        v-model="message">
                      <a v-if="this.activebutton == true" class="ms-3" style="cursor: pointer;"
                        @click="Publishe(this.store.myusername, this.store.userforMess, this.message)">
                        <i class="fas fa-paper-plane" style="color: blue;"></i></a>
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

<style src="../../assets/mdb.min.css" scoped></style>

<style scoped>
#userslist{
    max-height: 450px;
    overflow-y: scroll;
  }
@media screen and (max-width: 768px) {
  #userslist{
    max-height: 200px;
    overflow-y: scroll;
  }
}
#user {
  overflow-y: auto;
}

#chat {
  overflow-y: scroll;
}

#chat::-webkit-scrollbar {
  display: none;
}

#user::-webkit-scrollbar {
  display: none;
}

.input-group input {
  background-color: none;
}

#imgprof {
  border-radius: 50%;
  height: 60px;
  object-fit: cover;
}

.contimg {
  justify-content: center;
  align-items: center;
  display: grid;
}
</style>