<template>
  <q-page padding>
    <!-- content -->
    <q-list no-border>
      <q-infinite-scroll :handler="loadMore">
        <q-item separator link v-for="(item, index) in items" 
          :key="index" :to="{ name: '预约详情', params: { id: item.id } }"
        >
          <q-item-main>
            <q-item-tile label>鲁Y8888</q-item-tile>
            <q-item-tile sublabel>预约时间：05-21 09:00</q-item-tile>
          </q-item-main>
        </q-item>
        <div class="row justify-center" style="margin-bottom: 50px;">
          <q-spinner-dots slot="message" :size="40" />
        </div>
      </q-infinite-scroll>
    </q-list>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    items: []
  }),
  methods: {
    loadMore(index, done) {
      setTimeout(() => {
        let items = [];
        for (let i=0; i<9; i++) {
          items.push({ id: '1'})
        }
        this.items = this.items.concat(items);
        done();
      }, 1000);
    }
  }
}
</script>

<style>
</style>
