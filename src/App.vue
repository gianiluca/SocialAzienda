<script>
import { useSessionStore } from './stores/sessionStore'

export default {
  setup() {
    const store = useSessionStore()
    return { store }
  },
  data() {
    return {
      key: this.store.key
    };
  },
};
</script>


<template>
    <div>
      <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<!-- without scoped styiling is global, otherwise is local -->
<style scoped>
</style>
