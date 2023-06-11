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
    beforeMount(){
        this.store.isMyAccount = false
    }    
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
                <ContentExploreComponent />
                <SideRightComponent /> 
            </div>
        </div>
    </section>
    <!-- <FooterComponent /> -->
</template>