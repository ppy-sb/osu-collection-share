<template>
  <base-dropdown
    tag="li"
    class="nav-item"
  >
    <a
      slot="title"
      href="#"
      class="nav-link"
      data-toggle="dropdown"
      role="button"
      @click.prevent
    >
      <i class="ni ni-collection d-lg-none" />
      <span class="nav-link-inner--text">{{ $t("locale") }}(Set Locale)</span>
    </a>
    <a
      href="#"
      class="dropdown-item"
      @click.prevent="switchLocale('zh-CN')"
    >
      <gb-flag
        code="CN"
        size="small"
        icon-path="/assets/flags"
        class="mr-1"
      />中文(中国)
    </a>
    <!-- <a
      class="dropdown-item"
      href="#"
      @click.prevent="switchLocale('zh-TW')"
    >
      <gb-flag
        code="TW"
        size="small"
        icon-path="/assets/flags"
        class="mr-1"
      />中文(台灣)
    </a> -->
    <a
      class="dropdown-item"
      href="#"
      @click.prevent="switchLocale('en-GB')"
    >
      <gb-flag
        code="GB"
        size="small"
        icon-path="/assets/flags"
        class="mr-1"
      />English(International)
    </a>
    <a
      href="#"
      class="dropdown-item"
      @click.prevent="switchLocale('en-US')"
    >
      <gb-flag
        code="US"
        size="small"
        icon-path="/assets/flags"
        class="mr-1"
      />English(US)
    </a>
    <!-- <a
      href="#"
      class="dropdown-item"
      @click.prevent="switchLocale('ko')"
    >
      <gb-flag
        code="KR"
        size="small"
        icon-path="/assets/flags"
        class="mr-1"
      />한국어
    </a>
    <a
      href="#"
      class="dropdown-item"
      @click.prevent="switchLocale('th')"
    >
      <gb-flag
        code="TH"
        size="small"
        icon-path="/assets/flags"
        class="mr-1"
      />ภาษาไทย
    </a> -->
  </base-dropdown>
</template>
<script>
import BaseDropdown from '@/components/argon/BaseDropdown'
export default {
  components: {
    BaseDropdown
  },
  created () {
    let l
    if (localStorage) {
      l = localStorage.getItem('locale')
    }
    this.switchLocale(l)
  },
  methods: {
    switchLocale (locale) {
      if (!locale) { return }
      if (localStorage) {
        locale = locale || localStorage.getItem('locale')
      }
      console.log(locale, 'locale')
      this.$root.locale = locale
      this.setLocale()
    },
    setLocale () {
      if (!this.$root.locale) { return }
      this.$root.$i18n.locale = this.$root.locale
      if (localStorage) {
        localStorage.setItem('locale', this.$root.locale)
      }
    }
  }
}
</script>
