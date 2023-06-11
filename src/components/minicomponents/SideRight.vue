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
      ads: []
    };
  },
  methods: {
    getAll(){
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.token
      axios.get('https://socialccapi.azurewebsites.net/api/v1/AnnuncioAPI/GetAnnunci', {
      }).then((response) => {
          this.ads = response.data.result
      })
      .catch((error) => {
      });
    }
  },
  beforeMount(){
    this.getAll()
  }
};
</script>

<template>
  <div class="col-lg-3 col-1" style="position: relative;">
    <div class="destra" style="overflow: hidden;">
      <div class="row" v-for="ad in ads">
        <div class="col-12">
          <div style="width: 100%; height: 150px; overflow:hidden ;">
            <img style="width: 100%;height: 150px; object-fit: cover; object-position: center;"
              :src="ad.media">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>