/* eslint-disable vue/require-prop-types */
<template>
  <section class="section-shaped my-0 section-hero">
    <div
      :class="[shaped!==undefined ? 'shape-skew' : '']"
      class="shape shape-style-1 shape-primary"
    >
      <span class="span-150" />
      <span class="span-50" />
      <span class="span-50" />
      <span class="span-75" />
      <span class="span-100" />
      <span class="span-75" />
      <span class="span-50" />
      <span class="span-100" />
      <span class="span-50" />
      <span class="span-100" />
    </div>
    <div class="container shape-container d-flex align-items-center">
      <slot />
    </div>
  </section>
</template>
<script>
export default {
  props: ['shaped']
}
</script>
<style>
</style>
