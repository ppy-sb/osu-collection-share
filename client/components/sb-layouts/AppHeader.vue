<template>
  <header class="header-global">
    <base-nav
      transparent
      type
      effect="light"
      expand
      class="navbar-main pt-4"
    >
      <nuxt-link
        slot="brand"
        class="navbar-brand mr-lg-5"
        :to="localePath('index')"
      >
        <!-- <img src="img/brand/white.png" alt="logo"> -->
        <big>Ֆ</big> osu.ppy.sb
      </nuxt-link>

      <div
        slot="content-header"
        slot-scope="{closeMenu}"
        class="row"
      >
        <div class="col-6 collapse-brand">
          <nuxt-link :to="localePath('index')">
            <!-- <img src="img/brand/white.png" alt="logo"> -->
            <big>Ֆ</big> osu.ppy.sb
          </nuxt-link>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu" />
        </div>
      </div>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
        <b-navbar-nav>
          <b-nav-item :to="localePath({name: 'upload'})">
            {{ $t('upload.upload') }}
          </b-nav-item>
        </b-navbar-nav>
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
          >
            <i class="ni ni-collection d-lg-none" />
            <span class="nav-link-inner--text">{{ $t('navbar.inProgressTab') }}</span>
          </a>
          <b-dropdown-item
            :to="localePath({
              name: 'most-viewed'
            })"
          >
            {{ $t('navbar.item.mostViewed') }}
          </b-dropdown-item>
          <b-dropdown-item
            :to="localePath({
              name: 'download'
            })"
          >
            beatmap batch downloader
          </b-dropdown-item>
        </base-dropdown>
      </ul>
      <ul class="navbar-nav align-items-lg-center ml-lg-auto text-nowrap">
        <search-collection style="min-width:150px" />
        <!-- <li class="nav-item">
          <a
            class="nav-link nav-link-icon"
            href="https://www.facebook.com/creativetim"
            target="_blank"
            rel="noopener"
            data-toggle="tooltip"
            title="Like us on Facebook"
          >
            <i class="fa fa-facebook-square" />
            <span class="nav-link-inner--text d-lg-none">Facebook</span>
          </a>
        </li> -->
        <client-only>
          <switch-locale />
        </client-only>

        <!-- <li class="nav-item">
          <a
            class="nav-link nav-link-icon"
            href="https://www.instagram.com/creativetimofficial"
            target="_blank"
            rel="noopener"
            data-toggle="tooltip"
            title="Follow us on Instagram"
          >
            <i class="fa fa-instagram" />
            <span class="nav-link-inner--text d-lg-none">Instagram</span>
          </a>
        </li> -->
        <li class="nav-item">
          <a
            class="nav-link nav-link-icon"
            href="https://discord.gg/5qTPyDzmGk"
            target="_blank"
            rel="noopener"
            data-toggle="tooltip"
            :title="$t('navbar.discord.message')"
          >
            <i class="fab fa-discord" />
            <span class="nav-link-inner--text d-lg-none">{{ $t('navbar.discord.server') }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link nav-link-icon"
            href="https://github.com/ppy-sb/osu-collection-share"
            target="_blank"
            rel="noopener"
            data-toggle="tooltip"
            :title="$t('navbar.github.message')"
          >
            <i class="fa fa-github" />
            <span class="nav-link-inner--text d-lg-none">{{ $t('navbar.github.name') }}</span>
          </a>
        </li>
        <!-- <li class="nav-item d-none d-lg-block ml-lg-4">
                    <a href="https://www.creative-tim.com/product/vue-argon-design-system" target="_blank" rel="noopener"
                       class="btn btn-neutral btn-icon">
                <span class="btn-inner--icon">
                  <i class="fa fa-cloud-download mr-2"></i>
                </span>
                        <span class="nav-link-inner--text">Download</span>
                    </a>
                </li>-->
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from '@/components/argon/BaseNav'
import BaseDropdown from '@/components/argon/BaseDropdown'
import CloseButton from '@/components/argon/CloseButton'

import SwitchLocale from '@/components/sb-components/SwitchLocale'
import SearchCollection from '@/components/sb-components/SearchCollection'

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown,
    SwitchLocale,
    SearchCollection
  }
}
</script>
<style>
</style>
