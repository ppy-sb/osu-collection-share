<template>
  <b-embed
    :src="`/osu/preview.html?sid=${beatmapSetId}&bid=${beatmapId}`"
    style="border-radius: 0.25rem;"
    type="iframe"
    aspect="4by3"
    allowfullscreen
  />
</template>
<script>
export default {
    props: ["beatmapId", "beatmapSetId"]
};
</script>