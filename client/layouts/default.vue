<template>
  <div id="wrapper" class="d-flex flex-column">
    <app-header />

    <main class="flex-fill position-relative">
      <nuxt />
    </main>

    <app-footer class="has-cards" />
  </div>
</template>

<script>
import AppHeader from '~/components/sb-layouts/AppHeader'
import AppFooter from '~/components/sb-layouts/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style>
body, #wrapper {
   min-height:100vh;
}
</style>
