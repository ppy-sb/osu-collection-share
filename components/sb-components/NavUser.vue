<template>
  <base-dropdown
    v-if="SBLoggedIn()"
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
      <!-- <i class="ni ni-ui-04 d-lg-none" /> -->
      <div>
        <b-avatar
          :src="avatar"
          class="shadow-sm"
          size="1.8rem"
        />
        <span class="pl-1 nav-link-inner--text">{{ user.name }}</span>
      </div>
    </a>
    <router-link 
      :to="{
        name:'users',
        params:{
          handle: SBUserData().id
        }}" 
      class="dropdown-item"
    >
      {{ SBUserData().name }}'s userpage
    </router-link>
    <a
      href="#"
      class="dropdown-item"
      @click.prevent="logOut()"
    >{{ $t('user.logout') }}</a>
    <!-- <div class="dropdown-menu-inner">
      <a
        href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
        class="media d-flex align-items-center"
        @click.prevent="logOut()"
      >
        <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
          <i class="ni ni-spaceship" />
        </div>
        <div class="media-body ml-3">
          <h6 class="heading text-primary mb-md-1">Log Out</h6>
          <p class="description d-none d-md-inline-block mb-0">
            Get started with Bootstrap, the
            world's most popular framework for building responsive sites.
          </p>
        </div>
      </a>
      <a
        href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
        class="media d-flex align-items-center"
      >
        <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
          <i class="ni ni-ui-04" />
        </div>
        <div class="media-body ml-3">
          <h5 class="heading text-warning mb-md-1">Components</h5>
          <p class="description d-none d-md-inline-block mb-0">
            Learn how to use Argon
            compiling Scss, change brand colors and more.
          </p>
        </div>
      </a>
    </div> -->
  </base-dropdown>
</template>
<script>
// import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/argon-components/BaseDropdown";
// import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseDropdown
  },
  computed: {
    user() {
      return this.SBUserData();
    },
    avatar() {
      return `https://a.ppy.sb/${this.user.id}`;
    }
  }
};
</script>