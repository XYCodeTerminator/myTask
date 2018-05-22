<template>
  <div>
    <v-alert v-model="authAlert" type="error" transition="scale-transition" dismissible >
      权限不足，请联系超级管理员！！！
    </v-alert>
    <v-card v-if="display">
      <v-card-title>
        <b style="font-size: 18px">图书管理</b>
        <v-btn icon @click="addBook">
            <v-icon medium>add</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
                append-icon="search"
                label="搜索"
                single-line
                hide-details
                v-model="search">
        </v-text-field>
      </v-card-title>
        <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :rows-per-page-text="pageText"
        :rows-per-page-items="pageItems"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.category }}</td>
          <td class="text-xs-center">{{ props.item.stock }}</td>
          <td class="text-xs-center">{{ props.item.left }}</td>
          <td class="text-xs-center">{{ props.item.publishTime }}</td>
          <td class="text-xs-center">{{ props.item.price }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editBook({ editedItem: props.item, router: $router })">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          没有查询到{{ search }}
        </v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
// import eventBus from '../eventBus'
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    authAlert: false,
    display: false,
    search: '',
    pageText: '每页显示行数',
    pageItems: [15, 25, 35, { "text": "所有", "value": -1 }],
    headers: [
      { text: "书名", value: "name", align: "center" },
      { text: "分类", value: "category", align: "center"},
      { text: "库存", value: "stock", align: "center" },
      { text: "在库", value: "left", align: "center" },
      { text: "出版时间", value: "publishTime", align: "center" },
      { text: "价格", value: "price", align: "center" },
      { text: "操作", value: "operation", align: "center" }
    ],
    items: [],
    editedIndex: -1,
    bookMenu: false
  }),
  computed: {
    ...mapGetters([
      'book'
    ])
  },
  created() {
    this.$http.get('/verify')
    // this.$http.get('/api/verify')
    .then(res => {
      if (res.data.user.role.roleName == 'user') {
        // console.log('axios');
        this.authAlert = true;
        setTimeout(() => {
          this.authAlert = false;
          this.$router.push('/main/bookDisplay');
        }, 2000);
      } else {
        this.display = true;
        this.fetchData();
      }
    })
    .catch(err => {
      console.log(err);
    })
  },
 
  // destroyed() {
  //   eventBus.$emit('addBookDetail', this.editedItem);
  // },
  methods: {
    ...mapActions([
      'editBook'
    ]),
    fetchData() {
      this.$http.get('/getBooks')
      // this.$http.get('/api/getBooks')
        .then(res => {
          // console.log(res);
          this.items = res.data.books;
        })
        .catch(err => {
          console.log(err);
        })
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm("确定要删除此图书吗？")) {
        this.$http.post("/deleteBook", { "_id": item._id })
        // this.$http.post("/api/deleteBook", { "_id": item._id })
          .then(res => {
            if (res.data.deleteBook) {
              this.items.splice(index, 1)
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    addBook() {
        // this.dialog = true;
      this.$store.commit('clearItem');
      this.$router.push('bookDetailEdit');
    }
  }
};
</script>
