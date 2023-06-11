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
        
    }
};
</script>

<template>
    <NavbarComponent />
    <section class="home">
        <div class="container" style="min-width: 80%;">
            <div class="row" >
                <SideBarComponent />
                <ContentCreatePostComponent />
                <SideRightComponent /> 
            </div>
        </div>
    </section>
    <!-- <FooterComponent /> -->
</template>