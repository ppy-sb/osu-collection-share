<template>
  <header class="header-global">
    <base-nav 
      transparent 
      type 
      effect="light" 
      expand 
      class="navbar-main pt-4"
    >
      <router-link 
        slot="brand" 
        class="navbar-brand mr-lg-5" 
        to="/"
      >
        <!-- <img src="img/brand/white.png" alt="logo"> -->
        <big>Ֆ</big> osu.ppy.sb
      </router-link>

      <div 
        slot="content-header" 
        slot-scope="{closeMenu}" 
        class="row"
      >
        <div class="col-6 collapse-brand">
          <router-link to="/">
            <!-- <img src="img/brand/white.png" alt="logo"> -->
            <big>Ֆ</big> osu.ppy.sb
          </router-link>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu" />
        </div>
      </div>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
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
            <span class="nav-link-inner--text">pages</span>
          </a>
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
        <switch-locale />

        <!-- <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://www.instagram.com/creativetimofficial"
                       target="_blank" rel="noopener" data-toggle="tooltip" title="Follow us on Instagram">
                        <i class="fa fa-instagram"></i>
                        <span class="nav-link-inner--text d-lg-none">Instagram</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://twitter.com/creativetim" target="_blank" rel="noopener"
                       data-toggle="tooltip" title="Follow us on Twitter">
                        <i class="fa fa-twitter-square"></i>
                        <span class="nav-link-inner--text d-lg-none">Twitter</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://github.com/creativetimofficial/vue-argon-design-system"
                       target="_blank" rel="noopener" data-toggle="tooltip" title="Star us on Github">
                        <i class="fa fa-github"></i>
                        <span class="nav-link-inner--text d-lg-none">Github</span>
                    </a>
                </li>-->
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
import BaseNav from "@/components/argon-components/BaseNav";
import BaseDropdown from "@/components/argon-components/BaseDropdown";
import CloseButton from "@/components/argon-components/CloseButton";

import SwitchLocale from "@/components/sb-components/SwitchLocale";
import SearchCollection from "@/components/sb-components/SearchCollection";

export default {
    components: {
        BaseNav,
        CloseButton,
        BaseDropdown,
        SwitchLocale,
        SearchCollection,
    },
};
</script>
<style>
</style>
