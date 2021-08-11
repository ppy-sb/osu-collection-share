<template>
  <card no-body>
    <b-list-group flush>
      <b-list-group-item v-for="collection in list" :key="collection._id">
        <div class="d-flex w-100 justify-content-between">
          <div class="d-flex flex-column flex-grow">
            <h5 class="mb-1">
              <nuxt-link :to="localePath({name:'collections-slug', params: {slug: collection.slug}})">
                {{ collection.name }}
              </nuxt-link>
            </h5>
            <p class="mb-1 no-b" v-html="bbcode(collection.description)" />
          </div>
          <div class="text-nowrap d-flex align-items-end flex-column">
            <div><small><i class="fas fa-cloud-upload-alt" /> {{ $dayjs(dateFromObjectId(collection._id)) | fromNow }}</small></div>
            <div><small><i class="fas fa-eye" /> {{ collection.count.view }}</small></div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <small>{{ $t('user.uploadedBy') }}
            <a :href="uploaderLink(collection)">{{ uploaderName(collection) }}</a>
          </small>
          <div>
            <b-progress
              class="m-0"
              height="2px"
              :max="collection.count.vote.up + collection.count.vote.down"
            >
              <b-progress-bar :value="collection.count.vote.up" :variant="primary" />
              <b-progress-bar :value="collection.count.vote.down" variant="danger" />
            </b-progress>
            <small><i class="far fa-thumbs-up" /> {{ collection.count.vote.up }} | <i class="far fa-thumbs-down" /> {{ collection.count.vote.down }}</small>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </card>
</template>

<script>
import mixin from '~universal/uploaderMixin'
export default {
  filters: {
    fromNow (m) {
      return m.fromNow()
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    dateFromObjectId (objectId) {
      return new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
    },
    bbcode (str) {
      return str
    },
    ...mixin
  }
}
</script>
<style lang="scss" scoped>
.card {
  .no-b {
    word-wrap: initial;
  }
}
</style>
