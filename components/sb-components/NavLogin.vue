<template>
  <li
    v-if="!SBLoggedIn()"
    class="nav-item"
  >
    <router-link
      :to="{name:'login'}"
      class="nav-link"
    >
      <span class="nav-link-inner--text">{{ $t('header.login') }}</span>
    </router-link>
  </li>
</template>