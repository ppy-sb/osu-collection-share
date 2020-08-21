<template>
  <b-tabs 
    v-model="model" 
    class="nav-wrapper" 
    pills 
    fill
  >
    <b-tab>
      <span 
        slot="title" 
        class="nav-link-icon d-block"
      >{{ $t("mode.osu") }}</span>
    </b-tab>
    <b-tab>
      <span 
        slot="title" 
        class="nav-link-icon d-block"
      >{{ $t("mode.taiko") }}</span>
    </b-tab>
    <b-tab>
      <span 
        slot="title" 
        class="nav-link-icon d-block"
      >{{ $t("mode.catch") }}</span>
    </b-tab>
    <b-tab>
      <span 
        slot="title" 
        class="nav-link-icon d-block"
      >{{ $t("mode.mania") }}</span>
    </b-tab>
  </b-tabs>
</template>
<script>
export default {
    props: ['value'],
    computed: {
        model: {
            get(){
                return this.value
            },
            set(newValue){
                this.$emit('input', newValue)
            }
        }
    }
}
</script>