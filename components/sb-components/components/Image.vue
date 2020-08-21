<template>
  <img
    :class="
      [
        avatar ? `rounded-circle` : '',
      ]"
    :src="src"
    :alt="alt"
    class="rounded"
  >
</template>
<script>
export default {
    props: ["src", "alt", "avatar"]
};
</script>
<style scoped>
img {
    height: 100%;
}
</style>