<script>
import axios from 'axios'
import { useSessionStore } from '../stores/sessionStore'
import PopupImage from './minicomponents/PopupImage.vue';

export default {
    setup() {
        const store = useSessionStore();
        return { store };
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<template>
    <PopupImageComponent />
    <PopupComponent />
    <NavbarComponent />
    <section class="home">
        <div class="container" style="min-width: 80%;">
            <div class="row">
                <SideBarComponent />
                <ContentProfileComponent :key="$route.fullPath + this.store.key" />
                <SideRightComponent /> 
            </div>
        </div>
    </section>
    <!-- <FooterComponent /> -->
</template>

