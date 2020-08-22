<template>
  <profile-layout>
    <top-section-layout>
      <card shadow class="card-profile mt--300" no-body>
        <div class="px-4">
          <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
              <div class="card-profile-image">
                <a :href="`https://osu.ppy.sh/users/${user.name}`">
                  <img v-lazy="avatarSrc" class="rounded-circle">
                </a>
              </div>
            </div>
            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center" style="visibility:hidden">
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
            <h3>
              {{ collectionDB.name }}
            </h3>
            <div class="h6 font-weight-300">
              {{ $t('user.uploadedBy') }} <i><a :href="`https://osu.ppy.sh/users/${user.name}`">{{ user.name }}</a></i>
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
      </card>
    </top-section-layout>
    <section-layout
      :contained="undefined"
      bg-variant="warning"
      skew
      shaped
      last
    >
      <b-card v-for="(collection) of compiledCollectionData" :key="collection.slug" no-body class="mb-1" :name="collection.slug">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle="collection.slug" block variant="info">
            {{ collection.name }}
          </b-button>
        </b-card-header>
        <b-collapse :id="collection.slug" accordion="my-accordion" role="tabpanel">
          <b-button-toolbar justify>
            <b-button-group>
              <b-button variant="primary" @click="() =>collectionSetIds(collection)">
                copy all set's id
              </b-button>
              <b-button variant="info" @click="() =>collectionSetLinks(collection)">
                copy all set's link
              </b-button>
              <b-button variant="warning" @click="() =>collectionBeatmapIds(collection)">
                copy all map's id
              </b-button>
              <b-button variant="danger" @click="() =>collectionBeatmapLinks(collection)">
                copy all map's link
              </b-button>
            </b-button-group>
            <b-button-group>
              <b-button variant="dark" @click="() =>copySomething(JSON.stringify(collection))">
                copy as JSON Format
              </b-button>
            </b-button-group>
          </b-button-toolbar>
          <beatmapset-list-item v-for="(set) of collection.mapsets" :key="`${collection.name}-${set.id}`" :set="set" />
        </b-collapse>
      </b-card>
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
// import BeatmapsetCard from '@/components/BeatmapsetCard'
import BeatmapsetListItem from '@/components/components/BeatmapsetListItem'
// import RecentCard from '@/components/sb-components/RecentCard'
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
export default {
  components: {
    BeatmapsetListItem,
    SectionLayout,
    ProfileLayout,
    TopSectionLayout
  },
  asyncData ({ params }) {
    return axios.get(`/api/collectionDB/get/${params.slug}`).then((res) => {
      return res.data
    })
  },
  // data () {
  //   return {
  //     compiledCollectionData: {
  //       type: Array,
  //       default: () => []
  //     }
  //   }
  // },
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
    collectionSetIds (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.id).join('\n')}`)
    },
    collectionBeatmapIds (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    },
    collectionSetLinks (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    },
    collectionBeatmapLinks (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
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
