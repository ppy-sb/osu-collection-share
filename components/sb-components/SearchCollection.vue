<template>
  <li class="nav-item">
    <model-list-select
      v-model="selected"
      :list="results"
      :placeholder="$t('header.findCollection')"
      option-value="slug"
      option-text="name"
      class="shadow-sm"
      @searchchange="search"
    />
  </li>
</template>
<script>
import 'vue-search-select/dist/VueSearchSelect.css'

import { ModelListSelect } from 'vue-search-select'
import axios from 'axios'
// import { ajaxFindCountry } from "../data/countriesApi";

export default {
  components: {
    ModelListSelect
  },
  data () {
    return {
      searchText: '',
      results: [],
      selected: {}
    }
  },
  watch: {
    selected () {
      this.$router.push({
        name: 'collections-slug',
        params: {
          slug: this.selected.slug
        }
      })
    }
  },
  methods: {
    /**
         * api : https://qiita.com/AKB428/items/64938febfd4dcf6ea698
         */
    search (searchText) {
      if (searchText === '') { return }
      if (this.results.length === 0 || this.searchText !== searchText) {
        this.searchText = searchText
        axios
          .get(`/api/pool/search/${searchText}`)
          .then((response) => {
            if (response.data) { this.results = response.data }
          })
          .catch((error) => {
            /* eslint no-console: off */
            console.error(error)
          })
      }
    },
    optionDisplayText (user) {
      return `${user.title_short1} - ${user.twitter_account} - ${user.public_url}`
    }
  }
}
</script>
<style scoped>

</style>
