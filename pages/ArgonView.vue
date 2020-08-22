<template>
  <profile-layout>
    <top-section-layout>
      <card shadow class="card-profile mt--300" no-body>
        <div class="px-4">
          <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
              <div class="card-profile-image">
                <a href="#">
                  <img v-lazy="'/argon/img/theme/team-4-800x800.jpg'" class="rounded-circle">
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
              Jessica Jones
              <span class="font-weight-light">, 27</span>
            </h3>
            <div class="h6 font-weight-300">
              <i class="ni location_pin mr-2" />Bucharest, Romania
            </div>
            <div class="h6 mt-4">
              <i class="ni business_briefcase-24 mr-2" />Solution Manager - Creative Tim Officer
            </div>
            <div><i class="ni education_hat mr-2" />University of Computer Science</div>
          </div>
          <div class="mt-5 py-5 border-top text-center">
            <div class="row justify-content-center">
              <div class="col-lg-9">
                <p>An artist of considerable range, Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.</p>
                <a href="#">Show more</a>
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
      <b-card v-for="(collection) of compiledCollectionData" :key="collection.id" no-body class="mb-1" :name="collection.id">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle="collection.id" block variant="info">
            {{ collection.name }}
          </b-button>
        </b-card-header>
        <b-collapse :id="collection.id" accordion="my-accordion" role="tabpanel">
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
  asyncData () {
    if (process.server) {
      const fs = require('fs')
      const OsuDBParser = require('osu-db-parser')
      const osuDBbuffer = Buffer.from(fs.readFileSync('/Users/kousakananako/Documents/GitHub/osu-collection-share/example_data/osu!.db'))
      const collectionBuffer = Buffer.from(fs.readFileSync('/Users/kousakananako/Documents/GitHub/osu-collection-share/example_data/collection.db'))
      const ultimateDB = new OsuDBParser(osuDBbuffer, collectionBuffer)

      const osuDBData = ultimateDB.getOsuDBData()
      const osuCollectionData = ultimateDB.getCollectionData()

      return { osuCollectionData, osuDBData }
    }
  },
  data () {
    return {
      compiledCollectionData: {
        type: Array,
        default: () => []
      }
    }
  },
  mounted () {
    const collections = this.osuCollectionData.collection.map((collection) => {
      return {
        name: collection.name,
        id: collection.name.replace(' ', '_'),
        maps: collection.beatmapsMd5.map(md5 => this.findMapInOsuDB({ md5 }) || { md5, unknown: true })
      }
    }).filter(collection => collection.maps.length)
    this.compiledCollectionData = collections.map((collection) => {
      return {
        name: collection.name,
        id: collection.id,
        mapsets: this.mapListToMapsetList(collection.maps)
      }
    })
    console.log(this.compiledCollectionData)
  },
  methods: {
    findMapInOsuDB (map) {
      return this.osuDBData.beatmaps.find(beatmap => beatmap.md5 === map.md5)
    },
    mapListToMapsetList (mapset) {
      return mapset.reduce((acc, beatmap) => {
        if (beatmap.unknown) {
          console.log('unknown beatmap', beatmap.md5)
          return acc
        }
        let set = acc.find(set => set.id === beatmap.beatmapset_id)
        if (!set) {
          set = {
            id: beatmap.beatmapset_id,
            artist: {
              name: beatmap.artist_name,
              unicodeName: beatmap.artist_name_unicode
            },
            song: {
              title: beatmap.song_title,
              unicodeTitle: beatmap.song_title_unicode
            },
            thread: beatmap.thread_id,
            maps: []
          }
          acc.push(set)
        }
        set.maps.push(beatmap)
        return acc
      }, [])
    },
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
