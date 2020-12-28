<template>
  <profile-layout>
    <top-section-layout>
      <card shadow class="card-profile mt--300" no-body>
        <div v-if="collectionDB" class="px-4">
          <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
              <div class="card-profile-image">
                <a :href="`https://osu.ppy.sh/users/${user.name}`">
                  <img v-lazy="avatarSrc" class="rounded-circle">
                </a>
              </div>
            </div>
            <div
              class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center"
              style="visibility:hidden"
            >
              <div class="card-profile-actions py-4 mt-lg-0">
                <base-button type="info" size="sm" class="mr-4">
                  Connect
                </base-button>
                <base-button type="default" size="sm" class="float-right">
                  Bancho profile
                </base-button>
              </div>
            </div>
            <div class="col-lg-4 order-lg-1" style="visibility:hidden">
              <div class="card-profile-stats d-flex justify-content-center">
                <div>
                  <span class="heading">22</span>
                  <span class="description">Collections</span>
                </div>
                <div>
                  <span class="heading">10</span>
                  <span class="description">Photos</span>
                </div>
                <div>
                  <span class="heading">89</span>
                  <span class="description">Comments</span>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-5">
            <h3>{{ collectionDB.name }}</h3>
            <div class="h6 font-weight-300">
              {{ $t('user.uploadedBy') }}
              <i>
                <a :href="`https://osu.ppy.sh/users/${user.name}`">{{ user.name }}</a>
              </i>
            </div>
          </div>
          <div class="mt-5 py-5 border-top text-center">
            <div class="row justify-content-center">
              <div class="col-lg-9">
                <p>{{ collectionDB.description || 'no description' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <b-card-body>
            <h2>{{ $t('viewer.collectionNonExists') }}</h2>
            <h4>{{ $t('viewer.somethingWentWrong') }}</h4>
          </b-card-body>
        </div>
      </card>
    </top-section-layout>
    <section-layout
      v-if="compiledCollectionData"
      :contained="undefined"
      bg-variant="warning"
      skew
      shaped
      last
    >
      <b-card class="shadow" no-body>
        <b-card-body>
          <collection-button-group
            :collection-d-b="collectionDB"
            :compiled-collection-data="compiledCollectionData"
            :user="user"
          />
        </b-card-body>
        <collection-card
          v-for="(collection) of compiledCollectionData"
          :key="`collection-${collection.slug}`"
          style="border: 0"
          :collection="collection"
        />
      </b-card>
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
import CollectionCard from '@/components/CollectionCard'
import CollectionButtonGroup from '@/components/CollectionButtonGroup'

import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
export default {
  watchQuery: ['slug'],
  components: {
    CollectionCard,
    CollectionButtonGroup,
    SectionLayout,
    ProfileLayout,
    TopSectionLayout
  },
  asyncData ({ params }) {
    if (process.server) {
      return axios.get(`http://localhost:3000/api/collectionDB/get/${params.slug}`).then((res) => {
        return res.data
      })
    }
    if (process.client) {
      return axios.get(`/api/collectionDB/get/${params.slug}`).then((res) => {
        return res.data
      })
    }
  },
  computed: {
    avatarSrc () {
      return `https://a.ppy.sh/${this.user.id}`
    }
  }
}
</script>
<style>
</style>
