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
            <h2>collection not exist.</h2>
            <h4>or something went (pretty badly) wrong!</h4>
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
      <card shadow>
        <b-button-toolbar>
          <b-button-group size="sm">
            <b-button variant="primary" @click="copyCollectionSummary">
              copy collection summary
            </b-button>
            <b-button
              variant="light"
              @click="saveCollectionSummary"
            >
              summary as text file (sayo compatible)
            </b-button>
            <b-button variant="success" @click="saveCollectionDB">
              generate collection.db
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </card>
      <collection-card
        v-for="(collection) of compiledCollectionData"
        :key="collection.slug"
        :collection="collection"
      />
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
import CollectionCard from '@/components/CollectionCard'

import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
const FileSaver = require('file-saver')
const osuColle = require('osucolle')
export default {
  components: {
    CollectionCard,
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
  },
  methods: {
    beatmapsetLink (set) {
      return `https://osu.ppy.sh/beatmapsets/${set.id}`
    },
    beatmapLink (beatmap) {
      return `https://osu.ppy.sh/b/${beatmap.beatmap_id}`
    },
    copyCollectionSummary () {
      this.copySomething(this.collectionSummary())
    },
    saveCollectionSummary () {
      const blob = new Blob([this.collectionSummary()], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, `collection-summary-${this.collectionDB.slug}.txt`)
    },
    collectionSummary () {
      const description = [
        `# creator: ${this.user.name}`,
        `# generated At: ${new Date()}`,
        '# ========',
        `# ${this.collectionDB.description.replace('\r', '\n').replace('\n', '\n# ')}`,
        '# ========'
      ].join('\n')
      const ids = this.compiledCollectionData.map(this.collectionSetIds).join('\n\n')
      return description + '\n\n' + ids
    },
    generateCollectionDB () {
      const db = new osuColle.Database()
      this.compiledCollectionData.map((collection) => {
        db.appendCollection(collection.name)
        collection.mapsets.map((set) => {
          set.maps.map(map => db.collection(collection.name).appendBeatmap(map.md5))
        })
      })
      return db
    },
    saveCollectionDB () {
      const db = this.generateCollectionDB()
      const buffer = db.toBuffer()
      const blob = new Blob([buffer], { type: 'application/octet-stream;charset=utf-8' })
      FileSaver.saveAs(blob, `collection-${this.collectionDB.slug}.db`)
    },
    collectionSetIds (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => set.id).join('\n')}`)
    },
    collectionBeatmapIds (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    },
    collectionSetLinks (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    },
    collectionBeatmapLinks (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
    },
    async copySomething (text) {
      try {
        await this.$copyText(text)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style>
.hover-big-shadow::before {
  content: "";
  height: 100%;
  width: 100%;
  /* display: inline-block; */
  position: absolute;
  background-image: linear-gradient(
    -90deg,
    #d077f3 0%,
    #009bff 47%,
    #2ac9db 100%
  );
  opacity: 0;
  border-radius: 100px;
  filter: blur(5em);
  z-index: -1;
  transition: all 0.15s ease;
}
.hover-big-shadow:hover::before {
  content: "";
  opacity: 0.3;
  transition: all 0.15s ease;
}
</style>
