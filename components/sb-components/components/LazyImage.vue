<template>
  <img
    v-lazy="src"
    :src-placeholder="srcPlaceholder"
    :alt="alt"
    :class="
      [
        avatar ? `rounded-circle` : '',
      ]"
    class="rounded shadow"
  >
</template>
<script>
export default {
    props: ["src", "alt", "avatar", "srcPlaceholder"]
};
</script>
<style scoped>
img {
    height: 100%;
}
</style>