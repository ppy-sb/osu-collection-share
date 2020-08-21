/* eslint-disable vue/require-default-prop */
<template>
  <component 
    :is="tag"
    v-click-outside="closeDropDown"
    :class="[{show: isOpen}, {'dropdown': direction === 'down'}, {'dropup': direction ==='up'}]"
    :aria-expanded="isOpen"
    class="dropdown"
    aria-haspopup="true"
    @click="toggleDropDown"
  >
    <slot name="title">
      <a 
        :class="{'no-caret': hideArrow}"
        class="dropdown-toggle nav-link"
        data-toggle="dropdown"
      >
        <i :class="icon" />
        <span class="no-icon">{{ title }}</span>
      </a>
    </slot>
    <ul 
      :class="[{'dropdown-menu-right': position === 'right'}, {show: isOpen}, menuClasses]"
      class="dropdown-menu"
    >
      <slot />
    </ul>
  </component>
</template>
<script>
export default {
  name: "BaseDropdown",
  props: {
    direction: {
      type: String,
      default: "down"
    },
    title: {
      type: String,
      description: "Dropdown title"
    },
    icon: {
      type: String,
      description: "Icon for dropdown title"
    },
    position: {
      type: String,
      description: "Position of dropdown menu (e.g right|left)"
    },
    menuClasses: {
      type: [String, Object],
      description: "Dropdown menu classes"
    },
    hideArrow: {
      type: Boolean,
      description: "Whether dropdown arrow should be hidden"
    },
    tag: {
      type: String,
      default: "li",
      description: "Dropdown html tag (e.g div, li etc)"
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleDropDown() {
      this.isOpen = !this.isOpen;
      this.$emit("change", this.isOpen);
    },
    closeDropDown() {
      this.isOpen = false;
      this.$emit("change", this.isOpen);
    }
  }
};
</script>
<style>
.dropdown {
  list-style-type: none;
}

.dropdown .dropdown-toggle {
  cursor: pointer;
}
</style>
