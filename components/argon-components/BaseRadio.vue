<template>
  <div 
    :class="[inlineClass, {disabled: disabled}]" 
    class="custom-control custom-radio"
  >
    <input 
      :id="cbId"
      v-model="model"
      :disabled="disabled"
      :value="name"
      class="custom-control-input"
      type="radio"
    >
    <label 
      :for="cbId" 
      class="custom-control-label"
    >
      <slot />
    </label>
  </div>
</template>
<script>
import { randomString } from "./stringUtils";
export default {
  name: "BaseRadio",
  props: {
    name: {
      type: [String, Number],
      description: "Radio label"
    },
    disabled: {
      type: Boolean,
      description: "Whether radio is disabled"
    },
    value: {
      type: [String, Boolean],
      description: "Radio value"
    },
    inline: {
      type: Boolean,
      description: "Whether radio is inline"
    }
  },
  data() {
    return {
      cbId: ""
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    inlineClass() {
      if (this.inline) {
        return `form-check-inline`;
      }
      return "";
    }
  },
  mounted() {
    this.cbId = randomString()
  }
};
</script>
