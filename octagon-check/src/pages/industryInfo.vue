<template>
  <q-pull-to-refresh :handler="refresher">
  <q-page padding>
    <!-- content -->
    <q-list no-border>
      <q-infinite-scroll :handler="loadMore">
        <q-item separator link v-for="(item, index) in items" 
          :key="index" :to="{ name: '行业资讯详情', params: { id: item.id } }"
        >
          <q-item-main>
            <q-item-tile label>标题</q-item-tile>
            <q-item-tile sublabel v-html="removeHTMLTag(content).substr(0, 50)"></q-item-tile>
          </q-item-main>
        </q-item>
        <div class="row justify-center" style="margin-bottom: 50px;">
          <q-spinner-dots slot="message" :size="40" />
        </div>
      </q-infinite-scroll>
    </q-list>
  </q-page>
  </q-pull-to-refresh>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    items: [ { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' } ],
    content: ''
  }),
  methods: {
    loadMore(index, done) {
      // this.$http.get('getContent', { params: { type: "industryInfo", pageIndex: index, pageAmount: 9 } })
      console.log("pageIndex: ", index);
      setTimeout(() => {
        let items = [];
        for (let i=0; i<9; i++) {
          items.push({ id: '1'})
        }
        this.items = this.items.concat(items);
        done();
      }, 1000);
    },
    refresher (done) {
      setTimeout(() => {
        done()
        this.items.push({ id: this.items.length })
        this.$q.notify('Item #' + this.items.length + ' is new.')
      }, 1000)
    },
    removeHTMLTag(str) {
      str = str.replace(/<\/?[^>]*>/g,''); // 去除HTML tag
      str = str.replace(/[ | ]*\n/g,'\n'); // 去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g,'\n'); // 去除多余空行
      str=str.replace(/&nbsp;/ig,'');// 去掉&nbsp;
      str=str.replace(/\s/g,''); // 将空格去掉
      return str;
    }
  },
  mounted() {
    // this.$http.get('/getContent', { params: { type: "industryInfo" } })
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
