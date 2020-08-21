<template>
  <card 
    shadow 
    class="border-0 mt--300" 
    no-body 
    hover
  >
    <b-card-img
      :src="`https://assets.ppy.sh/beatmaps/${bsid}/covers/cover.jpg`"
      class="lighter"
    />

    <b-card-body class="card-img-overlay">
      <b-card-title>{{ songName }}</b-card-title>
    </b-card-body>
    <div class="switcher d-flex">
      <div class="mt-auto">
        <slot name="diff-switcher" />
      </div>
    </div>
    <!-- <b-card-footer>{{123}}</b-card-footer> -->
  </card>
</template>
<script>
import LazyImage from "@/components/sb-components/components/LazyImage";
// import ShadowImg from "@/components/sb-components/components/Image";

export default {
    // components: {
    //     ShadowImg
    // },
    // props: ["beatmap"],
    props:{
      beatmap: {
        type:Object,
        default: () => undefined
      }
    },
    computed: {
        bsid() {
            return this.beatmap.beatmapSetId;
        },
        songName() {
            return `${this.beatmap.artist} - ${this.beatmap.title}`;
        },
    }
};
</script>
<style scoped>
.card .card-img {
    opacity: 0.2;
    filter: blur(5px);
    transition: all 0.15s ease;
}

.card:hover .card-img {
    opacity: 1;
    filter: none;
    transition: all 0.15s ease;
}
.card .card-img-overlay {
    transition: all 0.15s ease;
    opacity: 1;
    height: auto;
}
.card:hover .card-img-overlay {
    transition: all 0.15s ease;
    opacity: 0;
}
.switcher {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 1.25rem;
}
@media (max-width: 768px) {
    .switcher {
        position: relative;
    }
}
</style>