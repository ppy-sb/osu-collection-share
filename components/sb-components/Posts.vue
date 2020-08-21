<template>
  <section-layout
    v-show="posts.length"
    bg-variant="primary"
    skew
    shaped
    class="mt-300"
  >
    <card
      v-for="post in posts"
      :key="post.id"
      shadow
    >
      <template v-slot:header>
        <vue-markdown>{{ post.title }}</vue-markdown>
      </template>
      <vue-markdown>{{ post.md }}</vue-markdown>
    </card>
  </section-layout>
</template>

<script>
import axios from "axios";
import SectionLayout from "@/components/sb-layouts/components/SectionLayout";
import VueMarkdown from "vue-markdown";
export default {
  components: { SectionLayout, VueMarkdown },
  data: () => ({
    posts: [],
  }),
  watch:{
    '$root.locale'(){
      this.init()
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.posts = []
      const listPost = await axios({
        url: `/posts/${this.$root.locale}/list.json`,
      })
        .then((res) => res.data)
        .catch((e) => ([]));
      const posts = await Promise.all(
        listPost.map(async (post, index) => {
          let md = await axios.get(post.url).then((res) => res.data);
          if (!post.title) {
            post.title = md.split("\n", 1)[0];
            md = md.substring(md.indexOf("\n") + 1);
          }
          if (!post.id) post.id = index;
          post.md = md;
          return post;
        })
      );
      if (posts.length) this.posts = posts;
    },
  }
};
</script>
