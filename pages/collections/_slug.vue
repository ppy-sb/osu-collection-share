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
              style="visibility: hidden"
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
            <div class="col-lg-4 order-lg-1" style="visibility: hidden">
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
              {{ $t("user.uploadedBy") }}
              <i>
                <a :href="`https://osu.ppy.sh/users/${user.name}`">{{
                  user.name
                }}</a>
              </i>
            </div>
          </div>
          <div class="mt-5 py-4 border-top text-center">
            <div class="row justify-content-center">
              <div class="col-lg-9">
                <p>{{ collectionDB.description || "no description" }}</p>
              </div>
            </div>
          </div>
          <template v-if="collectionDB.tournament">
            <h1 class="tournament">
              <b-badge>tournament</b-badge>
            </h1>
          </template>
        </div>
        <div v-else>
          <b-card-body>
            <h2>{{ $t("viewer.collectionNonExists") }}</h2>
            <h4>{{ $t("viewer.somethingWentWrong") }}</h4>
          </b-card-body>
        </div>
      </card>
    </top-section-layout>
    <section-layout skew :section-class="['py-0', 'my-0']" class="non-print">
      <card shadow>
        <collection-button-group
          class="pb-3"
          :collection-d-b="collectionDB"
          :compiled-collection-data="compiledCollectionData"
          :user="user"
        />
      </card>
    </section-layout>
    <section-layout
      v-if="compiledCollectionData"
      :contained="undefined"
      bg-variant="warning"
      skew
      shaped
      last
    >
      <fullscreen :fullscreen.sync="fullscreen">
        <template v-if="!collectionDB.tournament">
          <collection-section
            v-for="collection of compiledCollectionData"
            :key="`collection-${collection.slug}`"
            style="border: 0"
            :collection="collection"
            :tournament="collectionDB.tournament"
          />
        </template>
        <template v-else>
          <b-card class="shadow border-0 overflow-hidden" no-body>
            <sheet :collections="compiledCollectionData" :small="!fullscreen" />
            <b-button variant="light" squared @click="() => fullscreen = !fullscreen">
              fullscreen
            </b-button>
          </b-card>
        </template>
      </fullscreen>
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
import CollectionSection from '@/components/CollectionSection'
import CollectionButtonGroup from '@/components/CollectionButtonGroup'

import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
import Sheet from '~/components/tournament/Sheet.vue'
export default {
  watchQuery: ['slug'],
  components: {
    CollectionSection,
    CollectionButtonGroup,
    SectionLayout,
    ProfileLayout,
    TopSectionLayout,
    Sheet
  },
  asyncData ({ params }) {
    if (process.server) {
      return axios
        .get(`http://localhost:3000/api/collectionDB/get/${params.slug}`)
        .then((res) => {
          return res.data
        })
    }
    if (process.client) {
      return axios.get(`/api/collectionDB/get/${params.slug}`).then((res) => {
        return res.data
      })
    }
  },
  data () {
    return {
      fullscreen: false
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
.tournament {
  position: absolute;
  top: -0.3em;
  right: -1em;
  transform: rotate(12deg);
}
</style>
<style lang="scss">
@media print {
  .non-print {
    display: none;
  }
  .mt--300 {
    margin-top: 140px !important;
  }
}
</style>
