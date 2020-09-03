<template>
  <div>
    <section-layout
      section-class="section-lg"
      shaped
      bg-variant="dark"
    >
      <collection-list :list="list" />
    </section-layout>
    <!-- </profile-layout> -->
  </div>
</template>
<script>
import axios from 'axios'
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import CollectionList from '@/components/CollectionList'

export default {
  components: {
    SectionLayout,
    CollectionList
  },
  asyncData () {
    if (process.server) {
      return axios.get('http://localhost:3000/api/collectionDB/top').then((res) => {
        return {
          list: res.data
        }
      })
    }
    if (process.client) {
      return axios.get('/api/collectionDB/top').then((res) => {
        return {
          list: res.data
        }
      })
    }
  }
}
</script>
<style scoped>
.nav-item {
    padding-top: 1rem;
}
</style>
