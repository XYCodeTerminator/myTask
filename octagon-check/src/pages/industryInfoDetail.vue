<template>
  <q-page>
    <!-- content -->
    <q-card inline class="col-xs-12">
      <q-card-media>
      </q-card-media>
      <q-card-title>
        行业资讯详情:
      </q-card-title>
      <q-card-main v-html="content"></q-card-main>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    content: ''
  }),
  mounted() {
    // this.$http.get('/getContent', { params: { type: "aboutUs" } })
    this.$http.get('statics/data/aboutUs.data.json')
    .then(res => {
      this.content = res.data.industryInfo;
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }
}
</script>

<style>
</style>
