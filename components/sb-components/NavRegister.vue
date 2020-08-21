<template>
  <li
    v-if="!SBLoggedIn()"
    class="nav-item"
  >
    <router-link
      :to="{name:'register'}"
      class="nav-link"
    >
      <span class="nav-link-inner--text">{{ $t('header.register') }}</span>
    </router-link>
  </li>
</template>