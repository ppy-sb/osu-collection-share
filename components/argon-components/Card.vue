<template>
  <div 
    :class="[
      {'card-lift--hover': hover},
      {'shadow': shadow},
      {[`shadow-${shadowSize}`]: shadowSize},
      {[`bg-gradient-${gradient}`]: gradient},
      {[`bg-${type}`]: type}
    ]"
    class="card"
  >
    <div 
      v-if="$slots.header" 
      :class="headerClasses" 
      class="card-header"
    >
      <slot name="header" />
    </div>
    <div 
      v-if="!noBody" 
      :class="bodyClasses" 
      class="card-body"
    >
      <slot />
    </div>

    <slot v-if="noBody" />

    <div 
      v-if="$slots.footer" 
      :class="footerClasses" 
      class="card-footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
<script>
export default {
  name: "Card",
  props: {
    type: {
      type: String,
      description: "Card type"
    },
    gradient: {
      type: String,
      description: "Card background gradient type (warning,danger etc)"
    },
    hover: {
      type: Boolean,
      description: "Whether card should move on hover"
    },
    shadow: {
      type: Boolean,
      description: "Whether card has shadow"
    },
    shadowSize: {
      type: String,
      description: "Card shadow size"
    },
    noBody: {
      type: Boolean,
      default: false,
      description: "Whether card should have wrapper body class"
    },
    bodyClasses: {
      type: [String, Object, Array],
      description: "Card body css classes"
    },
    headerClasses: {
      type: [String, Object, Array],
      description: "Card header css classes"
    },
    footerClasses: {
      type: [String, Object, Array],
      description: "Card footer css classes"
    }
  }
};
</script>
<style>
</style>
