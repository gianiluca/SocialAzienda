import { defineStore } from "pinia";

export const useSessionStore = defineStore("store", {
  state: () => {
    return { 
      token: '',
      immagineProfilo: '',
      myusername: '',
      active: false,
      activeStories: false,
      idForPopup: 0,
      usernameForPopupStories: 0,
      usernameForPopup: '',
      isMyAccount: true,
      userforMess: '',
      key: 0,
      immagineProfiloDest: '',
      activeImgChange: false,
      isMyStory: false,
     };
  },
  actions: {                        
    setToken(value) {
      this.token = value;
      return this.token
    },
    clearToken(){
      this.token = ''
    }, 
    setImmagineProfilo(value){
      this.immagineProfilo = value;
      return this.immagineProfilo
    },
    clearImmagineProfilo(){
      this.immagineProfilo = ''
    },
    trueActive() {
      this.active = true;
    },
    falseActive(){
      this.active = false
    }, 
  },
  getters: {
    isAuthenticated: (state) => state.token !== '',
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
});