<template>
  <card no-body>
    <b-list-group flush>
      <b-list-group-item v-for="collection in list" :key="collection._id">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            <nuxt-link :to="{name:'pools-slug', params: {slug: collection.slug}}">
              {{ collection.name }}
            </nuxt-link>
          </h5>
          <small>{{ moment(dateFromObjectId(collection._id)) | fromNow }}</small>
        </div>

        <p class="mb-1" v-html="bbcode(collection.description)" />

        <small>{{ $t('user.uploadedBy') }} <a :href="`https://osu.ppy.sh/users/${collection.user.name}`">{{ collection.user.name }}</a></small>
      </b-list-group-item>
    </b-list-group>
  </card>
</template>

<script>
export default {
  filters: {
    fromNow (moment) {
      return moment.fromNow()
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
    }
  }
}
</script>
