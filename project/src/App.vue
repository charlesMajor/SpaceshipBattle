<template>
  <header>
    <div>
      <NavigationBar />
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script>
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
export default {
  name: 'App',
  components: {
    NavigationBar,
    RouterView
  }
}
</script>
