<template>
  <profile-layout>
    <top-section-layout>
      <b-card no-body class="shadow card-profile mt--300 p-3">
        <b-card-title class="text-center py-4">
          how you want to upload your collection?
        </b-card-title>
        <div class="d-flex">
          <b-button v-if="user" class="mr-auto" variant="primary" disabled @click="$router.push(localeLocation({ name: 'upload-my-collection'}))">
            Upload to my account
          </b-button>
          <b-button v-else class="mr-auto" variant="primary" disabled @click="$router.push(localeLocation({ name: 'login'}))">
            Upload after Login
          </b-button>
          <b-button class="ml-auto" variant="dark" @click="$router.push(localeLocation({ name: 'upload-guest'}))">
            As Guest
          </b-button>
        </div>
      </b-card>
      <div>
        123
      </div>
    </top-section-layout>
  </profile-layout>
</template>

<script>
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'

export default {
  components: {
    TopSectionLayout,
    ProfileLayout
  },
  data () {
    return {
      user: undefined
    }
  }
}
</script>
