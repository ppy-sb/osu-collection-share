<template>
  <card no-body>
    <b-list-group flush>
      <b-list-group-item v-for="collection in list" :key="collection._id">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            <nuxt-link :to="localePath({name:'collections-slug', params: {slug: collection.slug}})">
              {{ collection.name }}
            </nuxt-link>
          </h5>
          <div class="text-nowrap d-flex align-items-end flex-column position-absolute pr-2 pt-2" style="right:0px; top: 0px; width:10%">
            <div><small><i class="fas fa-cloud-upload-alt" /> {{ $dayjs(dateFromObjectId(collection._id)) | fromNow }}</small></div>
            <div><small><i class="fas fa-eye" /> {{ collection.count.view }}</small></div>
            <div><small>6 <i class="far fa-thumbs-up" /> | <i class="far fa-thumbs-down" /> 727</small></div>
          </div>
        </div>

        <p class="mb-1" style="width:calc(90% - 1.5em)" v-html="bbcode(collection.description)" />

        <small>{{ $t('user.uploadedBy') }}
          <a :href="uploaderLink(collection)">{{ uploaderName(collection) }}</a>
        </small>
      </b-list-group-item>
    </b-list-group>
  </card>
</template>

<script>
import mixin from '~/../universal/uploaderMixin'
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
