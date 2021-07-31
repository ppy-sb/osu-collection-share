<template>
  <profile-layout>
    <top-section-layout>
      <b-card no-body class="shadow card-profile mt--300 p-3">
        <b-card-title class="text-center py-4">
          {{ $t('upload.howToUpload') }}
        </b-card-title>
        <div class="d-flex">
          <b-button v-if="user" class="mr-auto" variant="primary" disabled @click="$router.push(localeLocation({ name: 'upload-my-collection'}))">
            {{ $t('upload.toMyAccount') }}
          </b-button>
          <b-button v-else class="mr-auto" variant="primary" disabled @click="$router.push(localeLocation({ name: 'login'}))">
            {{ $t('upload.afterLogin') }}
          </b-button>
          <b-button class="ml-auto" variant="dark" @click="$router.push(localeLocation({ name: 'upload-guest'}))">
            {{ $t('upload.asGuest') }}
          </b-button>
        </div>
      </b-card>
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
  },
  head () {
    return {
      title: `${this.$t('upload.upload')} - ${this.$t('landing.title')}`,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.$t('upload.description')
      }]
    }
  }
}
</script>
