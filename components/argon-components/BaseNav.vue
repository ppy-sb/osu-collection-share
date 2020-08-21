<template>
  <nav 
    :class="[
      {'navbar-expand-lg': expand},
      {[`navbar-${effect}`]: effect},
      {'navbar-transparent': transparent},
      {[`bg-${type}`]: type},
      {'rounded': round}
    ]"
    class="navbar"
  >
    <div class="container">
      <slot name="container-pre" />
      <slot name="brand">
        <a 
          class="navbar-brand" 
          href="#" 
          @click.prevent="onTitleClick"
        >
          {{ title }}
        </a>
      </slot>
      <navbar-toggle-button 
        :toggled="toggled"
        :target="contentId"
        @click.native.stop="toggled = !toggled"
      />

      <slot name="container-after" />

      <div 
        :id="contentId" 
        v-click-outside="closeMenu" 
        :class="{show: toggled}" 
        class="collapse navbar-collapse"
      >
        <div class="navbar-collapse-header">
          <slot 
            :close-menu="closeMenu" 
            name="content-header"
          />
        </div>
        <slot :close-menu="closeMenu" />
      </div>
    </div>
  </nav>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import NavbarToggleButton from "./NavbarToggleButton";

export default {
  name: "BaseNav",
  components: {
    FadeTransition,
    NavbarToggleButton
  },
  props: {
    type: {
      type: String,
      default: "primary",
      description: "Navbar type (e.g default, primary etc)"
    },
    title: {
      type: String,
      default: "",
      description: "Title of navbar"
    },
    contentId: {
      type: [String, Number],
      default: Math.random().toString(),
      description:
        "Explicit id for the menu. By default it's a generated random number"
    },
    effect: {
      type: String,
      default: "dark",
      description: "Effect of the navbar (light|dark)"
    },
    round: {
      type: Boolean,
      default: false,
      description: "Whether nav has rounded corners"
    },
    transparent: {
      type: Boolean,
      default: false,
      description: "Whether navbar is transparent"
    },
    expand: {
      type: Boolean,
      default: false,
      description: "Whether navbar should contain `navbar-expand-lg` class"
    }
  },
  data() {
    return {
      toggled: false
    };
  },
  methods: {
    onTitleClick(evt) {
      this.$emit("title-click", evt);
    },
    closeMenu() {
      this.toggled = false;
    }
  }
};
</script>
<style>
</style>
