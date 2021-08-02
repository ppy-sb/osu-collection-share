<template>
  <div>
    <section-layout
      :section-class="['section-lg']"
      shaped
      bg-variant="dark"
    >
      <collection-list :list="list" />
    </section-layout>
    <!-- </profile-layout> -->
  </div>
</template>
<script>
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import CollectionList from '@/components/CollectionList'

export default {
  components: {
    SectionLayout,
    CollectionList
  },
  asyncData ({ $axios }) {
    return $axios.get('/api/collectionDB/top').then((res) => {
      return {
        list: res.data
      }
    })
  },
  head () {
    return {
      title: `${this.$t('mostViewed.collections')} - ${this.$t('landing.title')}`,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.$t('mostViewed.description')
      }]
    }
  }
}
</script>
<style scoped>
.nav-item {
    padding-top: 1rem;
}
</style>
