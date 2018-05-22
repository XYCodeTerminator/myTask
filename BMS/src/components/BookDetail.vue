<template>
<v-card>
  <v-card-text>
    <v-container fluid text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>{{ book.name }}</h2>
          <span>
            <!-- <v-icon>book</v-icon>分类: {{ book.category }}  <v-icon>attach_money</v-icon>价格:{{ book.price }}  <v-icon>library_books</v-icon>库存:{{ book.stock }} 
            <v-icon>assignment_turned_in</v-icon>在库:{{ book.left }}  <v-icon>event</v-icon>发布时间:{{ book.publishTime }} -->
            <v-chip small label outline color="red">{{ book.category }}</v-chip>
            <v-chip small label outline color="green">价格:{{ book.price }}</v-chip>
            <v-chip small label outline color="pink">库存:{{ book.stock }}</v-chip>
            <v-chip small label outline color="blue">在库:{{ book.left }}</v-chip>
            <v-chip small label outline color="cyan">发布时间:{{ book.publishTime }}</v-chip>
          </span>
          <carousel-3d :height="200" :autoplay="true" :autoplay-timeout="2000" :display="carouselDisplay" 
            :border="0" :perspective="35" :inverseScaling="100">
            <slide v-for="(slide, index) in book.images" :key="index" :index="index">
              <img :src="slide.src">
            </slide>
          </carousel-3d>
        </v-flex>
      </v-layout>
    </v-container>

    <v-divider></v-divider>
    <v-tabs v-model="tabItem">
      <v-tab v-for="(tab, index) in tabs" :key="index" :href="`#tab-${tab}`">
        {{ tab }}
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tabItem">
      <v-tab-item id="tab-详情">
        <v-card-text v-html="book.content"></v-card-text>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex>
              <v-btn small flat color="red lighten-4"><v-icon>favorite</v-icon>收藏</v-btn>
            </v-flex>
            <v-flex>
              <v-btn small flat color="orange lighten-4"><v-icon>star</v-icon>订阅</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>
      <v-tab-item id="tab-评价">
        <v-card-text>
          <h1>😊😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍😘😗😙😚😋😛😝😜🤪🤨🧐</h1>
          <h1>😊😋😛😝😜🤪敬请期待😊😋😛😝😜🤪</h1>
          <h1>😊😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍😘😗😙😚😋😛😝😜🤪🤨🧐</h1>
        </v-card-text>
      </v-tab-item>
      <v-tab-item id="tab-推荐">
        <v-card-text>
          <h1>😊😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍😘😗😙😚😋😛😝😜🤪🤨🧐</h1>
          <h1>😊😋😛😝😜🤪敬请期待😊😋😛😝😜🤪</h1>
          <h1>😊😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍😘😗😙😚😋😛😝😜🤪🤨🧐</h1>
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
   
  </v-card-text>
</v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import { Carousel3d, Slide } from 'vue-carousel-3d';
export default {
  data: () =>({
    tabs: ['详情', '评价' ,'推荐'],
    tabItem: 'tab-详情'
  }),
  components: {
    Carousel3d,
    Slide
  },
  computed: {
    ...mapGetters([
      'book'
    ]),
    carouselDisplay: {
      get() {
        return this.book.images.length % 2 == 0 ? this.book.images.length - 1 : this.book.images.length;
      }
    }
  }
}
</script>

