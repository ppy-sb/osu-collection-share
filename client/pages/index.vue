<template>
  <hero-section-layout>
    <div class="col px-0">
      <div class="row justify-content-center align-items-center">
        <b-container :class="[blur ?'blur' :'blur active']">
          <b-col>
            <div class="main-block shadow justify-content-between">
              <div class="quaver" />
              <div
                class="content flex-grow-1 d-flex justify-content-center align-items-center"
              >
                <h1
                  class="text-white"
                  v-html="$t('landing.title')"
                />
                <p
                  class="lead text-white mt-4 mb-5"
                  v-html="$t('landing.subtitle')"
                />
                <div class="buttons">
                  <base-button
                    class="mb-3 mb-sm-0 text-capitalize"
                    type="info"
                    icon="ni ni-world"
                    @click="$router.push(localeLocation({ name: 'upload'}))"
                  >
                    <!-- <template v-slot:icon><font-awesome-icon icon="fa-chess-queen" /></template> -->
                    {{ $t('upload.upload') }}
                  </base-button>
                  <base-button
                    class="mb-3 mb-sm-0 text-capitalize"
                    type="white"
                    icon="ni ni-cloud-download-95"
                    @click="$router.push(localeLocation({ name: 'recent'}))"
                  >
                    {{ $t("recent.collections") }}
                  </base-button>
                </div>
              </div>
            </div>
          </b-col>
        </b-container>
      </div>
      <b-collapse v-model="show">
        <div class="row align-items-center pt-lg justify-content-around">
          <!-- <div class="btn-wrapper" /> -->
        </div>
        <div class="row align-items-center pt-lg justify-content-around">
          <div class="col mt-4">
            <span class="text-white alpha-7 ml-3">{{ $t('landing.title') }}</span>
          </div>
          <div class="col mt-4 mt-sm-0 text-right">
            <span class="text-white alpha-7">{{ $t("statements.testTitle") }}</span>
          </div>
        </div>
      </b-collapse>
    </div>
  </hero-section-layout>
</template>
<script>
import HeroSectionLayout from '~/components/sb-layouts/components/HeroSectionLayout'
export default {
  layout: 'hero',
  components: {
    HeroSectionLayout
  },
  data: () => ({
    blur: true,
    loading: true
  }),
  computed: {
    show: {
      get () {
        return !this.loading
      },
      set () {}
    }
  },
  mounted () {
    setTimeout(() => (this.blur = false), 0)
    setTimeout(() => (this.loading = false), 500)
  },
  head () {
    return {
      title: `${this.$t('landing.title')} - ${this.$t('landing.subtitle')}`,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.$t('landing.description')
      }]
    }
  },
  transition: 'bounce'
}
</script>
<style scoped>
.blur {
    filter: blur(8px);
    transition: all 0.3s ease;
}
.active {
    filter: none;
}
.main-block {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    margin-top: 110px;
    height: 260px;
    /* padding-right: 34px; */
    background: linear-gradient(87deg, #8c98dd53 0, #af9edd66 100%) !important;
    backdrop-filter: blur(15px);
}
.quaver {
    background-image: url(https://osu.ppy.sb/_ipx/w_1536&f_webp/mascot/riru.png);
    background-repeat: no-repeat;
    height: 420px;
    width: 450px;
    align-self: flex-end;
}
.content {
    display: flex;
    flex-direction: column;
    color: #fff;
    height: 100%;
    justify-content: center;
}
@media (max-width: 990px) {
    .quaver {
        display: none;
    }
}
</style>
