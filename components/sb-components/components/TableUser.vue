<template>
  <div class="d-flex">
    <!-- <div class="score-table-crop-img mr-2">
                        <lazy-image
                            :src="`https://a.ppy.sb/${user.id}`"
                            :src-placeholder="`https://a.ppy.sb/-1`"
                            style="width:100%"
                            :key="`score-avatar-${user.id}`"
                        />
        </div>-->
    <span :id="`table-user-${user.id}`">{{ user.username }}</span>
    <b-popover 
      :target="`table-user-${user.id}`" 
      triggers="hover" 
      placement="top"
    >
      <router-link
        :to="{ name: 'users', params:{handle:user.id, mode: mode ? mode : undefined, rx: rx ? rx : undefined}}"
      >
        <div class="d-flex">
          <div class="score-table-crop-img img-2x mr-2">
            <lazy-image
              :key="`score-avatar-${user.id}`"
              :src="`https://a.ppy.sb/${user.id}`"
              :src-placeholder="`https://a.ppy.sb/-1`"
              class
              style="width:100%"
            />
          </div>
          <div>
            <div v-if="user.username_aka !== ''">
              <span class="mr-2">aka</span>
              <h6 class="text-nowrap">
                {{ user.username_aka }}
              </h6>
            </div>
            <div v-else>
              <h6 class="text-nowrap">
                {{ user.username }}
              </h6>
            </div>
            <!-- <div>
                                    <span class="text-nowrap">
                                        当前
                                        <strong>在线</strong>
                                    </span>
                        </div>-->
          </div>
        </div>
      </router-link>
    </b-popover>
  </div>
</template>
<script>
import LazyImage from "@/components/sb-components/components/LazyImage";
export default {
    components: {
        LazyImage,
    },
    props:{
        user: {
            type: Object,
            default: () => ({
                id: -1,
                username: "Guest",
                username_aka: "",
            })
        },
        mode: {
            type: [String,Number],
            default: "std"
        },
        rx: {
            type: [String,Boolean],
            default: ""
        },
    }
}
</script>
<style scoped>
.score-table-crop-img {
    width: 24px;
    height: 24px;
}
.score-table-crop-img img {
    object-fit: cover;
}
.img-2x {
    width: 50px;
    height: 50px;
}
</style>