<template>
  <li class="nav-item">
    <model-list-select
      v-model="selectedUser"
      :list="users"
      :placeholder="$t('header.findUser')"
      option-value="id"
      option-text="username"
      class="shadow-sm"
      @searchchange="searchUser"
    />
  </li>
</template>
<script>
import "vue-search-select/dist/VueSearchSelect.css";

import { ModelListSelect } from "vue-search-select";
import axios from "axios";
// import { ajaxFindCountry } from "../data/countriesApi";

export default {
    components: {
        ModelListSelect
    },
    data() {
        return {
            searchText: "",
            users: [],
            selectedUser: {}
        };
    },
    watch: {
        selectedUser() {
            console.log(this.selectedUser);
            this.$router.push({
                name: "users",
                params: {
                    handle: this.selectedUser.id
                }
            });
        }
    },
    created() {
        // this.searchUser();
    },
    methods: {
        /**
         * api : https://qiita.com/AKB428/items/64938febfd4dcf6ea698
         */
        searchUser(searchText) {
            if (this.users.length === 0 || this.searchText !== searchText) {
                this.searchText = searchText;
                axios
                    .get(`${this.$root.rippleApiBase}/users/lookup`, {
                        params: {
                            name: this.searchText
                        }
                    })
                    // .then(res => {
                    //     console.log(res.data)
                    //     if (res.data.code != 200) throw Error()
                    //     else return res
                    // })
                    .then(response => {
                        if (response.data.users)
                            this.users = response.data.users;
                    })
                    .catch(error => {
                        /* eslint no-console: off */
                        console.error(error);
                    });
            }
        },
        optionDisplayText(user) {
            return `${user.title_short1} - ${user.twitter_account} - ${user.public_url}`;
        }
    },
};
</script>
<style scoped>

</style>