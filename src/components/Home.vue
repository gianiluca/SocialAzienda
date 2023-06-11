<script>
import axios from 'axios'
import { useSessionStore } from '../stores/sessionStore'

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

    },
    mounted() {
        (function (d, m) {
            var kommunicateSettings = { "appId": "3dde25aeca462de52fdedbfe2551f2e94", "popupWidget": true, "automaticChatOpenOnNavigation": true };
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            window.kommunicate = m; m._globals = kommunicateSettings;
        })(document, window.kommunicate || {});
    },
};
</script>


<template>
    <PopupImageComponent />
    <PopupStoriaComponent />
    <PopupComponent />
    <NavbarComponent :key="$route.fullPath + this.store.key"/>
    <section class="home">
        <div class="container" style="min-width: 80%;">
            <div class="row">
                <SideBarComponent :key="$route.fullPath + this.store.key"/>
                <ContentComponent :key="$route.fullPath + this.store.key"/>
                <SideRightComponent />  
            </div>
        </div>
    </section>
    <!-- <FooterComponent /> -->
</template>

<style>
    /* Adjust the width and height as per your requirements */
    #kommunicate-widget-iframe {
        width: 400px;
        height: 500px;
        margin-bottom: 1%;
        z-index: 0;
    }
</style>