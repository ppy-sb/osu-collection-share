<template>
  <div>
    <section
      :class="[floatCover ?`section-profile-cover` :``]"
      class="section-shaped my-0 non-print"
    >
      <div
        :class="[`bg-${variant}`,useBootstrapColor ? '':`shape-${variant}` ]"
        class="shape shape-style-1 shape-skew"
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div
        v-if="!floatCover"
        class="container shape-container d-flex"
      >
        <slot />
      </div>
    </section>
    <section
      v-if="floatCover"
      class="section section-skew"
    >
      <b-container class="card-profile">
        <slot />
      </b-container>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    floatCover: {
      type: Boolean,
      default: true
    },
    variant: {
      type: String,
      default: 'primary'
    },
    useBootstrapColor: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
@media print {
  .non-print {
    display: none;
  }
}
</style>
