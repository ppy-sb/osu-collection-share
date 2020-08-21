<template>
  <section
    :class="[
      topOverflowHidden ? 'overflow-hidden' : ''
    ]"
    class="section section-shaped"
  >
    <div
      :class="[
        shapeClass ? shapeClass : 'shape-style-1',
        bgVariant ? `bg-gradient-${bgVariant}` : 'bg-gradient-primary' ,
        skew !== undefined ? 'shape-skew' : '',
      ]"
      class="shape"
    >
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <b-container class="">
      <slot />
    </b-container>
  </section>
</template>
<script>
export default {
    props: ["shapeClass", "bgVariant", "skew"]
};
</script>