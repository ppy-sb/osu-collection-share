<template>
  <section-layout container-class="py-0">
    <h2>bignews</h2><br>
    <b-container fluid>
      <b-card-group columns>
        <b-card
          title="Card title that wraps to a new line"
          img-src="/img/meme/peppi.png"
          img-alt="Image"
          img-top
          class="shadow-sm pt-0 my-2"
        >
          <b-card-text>
            This is a wider card with supporting text below as a natural lead-in to additional content.
            This content is a little bit longer.
          </b-card-text>
        </b-card>

        <b-card
          header="Quote"
          class="shadow-sm pt-0 my-2"
        >
          <blockquote class="blockquote mb-0">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer class="blockquote-footer">
              Someone famous in
              <cite title="Source Title">Source Title</cite>
            </footer>
          </blockquote>
        </b-card>

        <b-card
          title="Title"
          img-src="/img/meme/legends.webp"
          img-alt="Image"
          img-top
          class="shadow-sm pt-0 my-2"
        >
          <b-card-text>This card has supporting text below as a natural lead-in to additional content.</b-card-text>
          <b-card-text class="small text-muted">
            Last updated 3 mins ago
          </b-card-text>
        </b-card>

        <b-card
          bg-variant="primary"
          text-variant="white"
          class="shadow-sm pt-0 my-2"
        >
          <blockquote class="card-blockquote">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer>
              <small>
                Someone famous in
                <cite title="Source Title">Source Title</cite>
              </small>
            </footer>
          </blockquote>
        </b-card>

        <b-card class="shadow-sm pt-0 my-2">
          <b-card-title>Title</b-card-title>
          <b-card-text>This card has supporting text below as a natural lead-in to additional content.</b-card-text>
          <b-card-text class="small text-muted">
            Last updated 3 mins ago
          </b-card-text>
        </b-card>

        <b-card
          img-src="/img/meme/date.jpg"
          img-alt="Image"
          overlay
          class="shadow-sm pt-0 my-2"
        />

        <b-card
          img-src="/img/meme/maxresdefault.jpg"
          img-alt="Image"
          img-top
          class="shadow-sm pt-0 my-2"
        >
          <b-card-text>
            This is a wider card with supporting text below as a natural lead-in to additional content.
            This card has even longer content than the first.
          </b-card-text>
          <template v-slot:footer>
            <small class="text-muted">Footer Text</small>
          </template>
        </b-card>
      </b-card-group>
    </b-container>
  </section-layout>
</template>
<script>
import SectionLayout from "@/components/sb-layouts/components/SectionLayout";
// import HeroSectionLayout from "@/components/sb-layouts/components/HeroSectionLayout";
export default {
  name: "NewsFeed",
  components: {
    SectionLayout
  }
};
</script>