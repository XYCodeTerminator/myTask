<template>
  <q-page class="row">
    <q-card inline class="col-xs-12">
      <q-card-media>
        <q-carousel
          color="white"
          arrows
          quick-nav
          quick-nav-icon="favorite"
          infinite
          autoplay
          height="170px"
        >
          <q-carousel-slide img-src="statics/banner01.jpg" />
          <q-carousel-slide img-src="statics/banner02.jpg" />
        </q-carousel>
      </q-card-media>
      <q-card-title>
        关于我们:
      </q-card-title>
      <q-card-main v-html="aboutUs"></q-card-main>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    aboutUs: '公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介'
  }),
  mounted() {
    // this.$http.get('/getContent', { params: { type: "aboutUs" } })
    this.$http.get('statics/data/aboutUs.data.json')
    .then(res => {
      this.aboutUs = res.data.aboutUs;
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }
}
</script>
