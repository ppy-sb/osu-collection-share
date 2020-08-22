/* eslint-disable vue/require-prop-types */
<template>
  <section
    :class="[
      topOverflowHidden !== undefined ? 'overflow-hidden' : '',
      shaped !== undefined ? 'section-shaped' : '',
      shaped == undefined && bgVariant !== undefined ? `bg-${bgVariant}` : '',
      //last !== undefined ? '' : 'mb-0'
      //contained !== undefined  ? '' : 'mb-0'
      sectionClass
    ]"
    class="section my-0"
  >
    <div
      v-if="shaped !== undefined"
      :class="[
        shapeClass ? shapeClass : 'shape-style-1',
        useBootstrapColor == undefined 
          ? bgVariant !== undefined ? `bg-gradient-${bgVariant}` : 'bg-gradient-secondary'
          : bgVariant !== undefined ? `shape-${bgVariant}` :'shape-secondary',
        skew !== undefined ? 'shape-skew' : ''
      ]"
      class="shape"
    >
      <span
        v-for="index in bubbleCount"
        :key="index"
      />
    </div>
    <b-container :class="[shaped !== undefined ? '' : 'fill-shaped-pt', containerClass]">
      <slot />
    </b-container>
  </section>
</template>
<script>
export default {
  props: {
    bubbleCount:{
      type: Number,
      default: 7,
    },
    shapeClass: {
      type: String,
      default: undefined
    },
    bgVariant: {
      type: String,
      default: undefined
    },
    skew: {
      type: String,
      default: undefined
    },
    contained: {
      type: String,
      default: undefined
    },
    shaped: {
      type: String,
      default: undefined
    },
    sectionClass: {
      type: String,
      default: undefined
    },
    containerClass: {
      type: String,
      default: undefined
    },
    middle: {
      type: String,
      default: undefined
    },
    topOverflowHidden: {
      type: String,
      default: undefined
    },
    useBootstrapColor: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      logger: false
    };
  }
};
</script>
<style scoped>
.fill-shaped-pt {
  padding-top: 6rem;
}
</style>