<template>
  <profile-layout>
    <top-section-layout>
      <card shadow class="card-profile mt--300" no-body>
        <div v-if="collectionDB" class="px-4">
          <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
              <div class="card-profile-image">
                <a :href="uploaderLink(collectionDB)">
                  <img :src="avatarSrc" class="rounded-circle">
                </a>
              </div>
            </div>
            <div
              class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center"
            >
              <div class="card-profile-actions py-4 mt-lg-0">
                <b-button variant="info" size="sm" class="mr-4" :pressed="myVote.vote === 1" @click="voteUp">
                  <i class="far fa-thumbs-up" />
                </b-button>
                <b-button variant="danger" size="sm" class="float-right" :pressed="myVote.vote === -1" @click="voteDown">
                  <i class="far fa-thumbs-down" />
                </b-button>
              </div>
            </div>
            <div class="col-lg-4 order-lg-1">
              <div class="card-profile-stats d-flex justify-content-between">
                <div>
                  <span class="heading">{{ collectionDB.count.vote.up }}</span>
                  <span class="description"><i class="far fa-thumbs-up" /></span>
                </div>
                <div>
                  <span class="heading">{{ collectionDB.count.vote.down }}</span>
                  <span class="description"><i class="far fa-thumbs-down" /></span>
                </div>
                <div>
                  <span class="heading">{{ collectionDB.count.view }}</span>
                  <span class="description"><i class="fas fa-eye" /></span>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-5">
            <h3>{{ collectionDB.name }}</h3>
            <div class="h6 font-weight-300">
              {{ $t("user.uploadedBy") }}
              <i>
                <a :href="uploaderLink(collectionDB)">{{
                  uploaderName(collectionDB)
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
        <hr class="mb-0">
        <b-card-body>
          <collection-button-group
            :collection-d-b="collectionDB"
            :compiled-collection-data="compiledCollectionData"
            :user="user"
          />
        </b-card-body>
      </card>
    </top-section-layout>
    <!-- <section-layout skew :section-class="['py-0', 'my-0']" class="non-print">
      <card shadow>
      </card>
    </section-layout> -->
    <section-layout
      v-if="compiledCollectionData"
      :contained="undefined"
      bg-variant="warning"
      skew
      shaped
      last
    >
      <fullscreen :fullscreen.sync="fullscreen">
        <div v-if="!collectionDB.tournament">
          <collection-section
            v-for="collection of compiledCollectionData"
            :key="`collection-${collection.slug}`"
            style="border: 0"
            :collection="collection"
            :tournament="collectionDB.tournament"
          />
        </div>
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
import CollectionSection from '@/components/CollectionSection'
import CollectionButtonGroup from '@/components/CollectionButtonGroup'

import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
import mixin from '~universal/uploaderMixin'
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
  asyncData ({ params, $axios }) {
    return $axios.get(`/api/collectionDB/get/${params.slug}`).then((res) => {
      return res.data
    })
  },
  data () {
    return {
      fullscreen: false
    }
  },
  computed: {
    avatarSrc () {
      return mixin.uploaderAvatarSrc(this.collectionDB)
    }
  },
  methods: {
    ...mixin,
    async voteUp () {
      try {
        if (this.myVote.vote !== 1) {
          const result = await this.$axios.get(`/api/collectionDB/${this.collectionDB.slug}/vote/up`).then(res => res.data)
          if (result.success) { this.$set(this.collectionDB.count, 'vote', result.vote) }
          this.myVote.vote = 1
        } else {
          const result = await this.$axios.get(`/api/collectionDB/${this.collectionDB.slug}/vote/unvote`).then(res => res.data)
          if (result.success) { this.$set(this.collectionDB.count, 'vote', result.vote) }
          this.myVote.vote = 0
        }
      } catch (error) {
        console.error(error)
      }
    },
    async voteDown () {
      try {
        if (this.myVote.vote !== -1) {
          const result = await this.$axios.get(`/api/collectionDB/${this.collectionDB.slug}/vote/down`).then(res => res.data)
          if (result.success) { this.$set(this.collectionDB.count, 'vote', result.vote) }
          this.myVote.vote = -1
        } else {
          const result = await this.$axios.get(`/api/collectionDB/${this.collectionDB.slug}/vote/unvote`).then(res => res.data)
          if (result.success) { this.$set(this.collectionDB.count, 'vote', result.vote) }
          this.myVote.vote = 0
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  head () {
    return {
      title: `${this.collectionDB.name} - ${this.$t('landing.title')}`,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.$t('upload.description')
      }]
    }
  }
}
</script>
<style>
.fullscreen:fullscreen {
  overflow:scroll;
}
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
.mt--300 {
  margin-top: -400px !important;
}
</style>
