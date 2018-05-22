<template>
  <v-container fluid grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg3 v-for="(book, index) in books" :key="index">
        <v-card height="330px" tile>
          <div @click="showBookDetail(book)">
            <v-card-media
              class="white--text"
              height="160px"
              :src="book.images[0].src"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">{{ book.name }}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
            <v-card-title>
              <div>
                <!-- <span class="grey--text">Number 10</span><br> -->
                {{ removeHTMLTag(book.content).length >= 55 ? removeHTMLTag(book.content).substr(0, 55) + "......" : removeHTMLTag(book.content) }}
              </div>
            </v-card-title>
          </div>
          <v-card-actions>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex>
                  <v-btn small flat :color="collectColor(book)" @click="collect(book)"><v-icon>favorite</v-icon>收藏{{ book.collectors.length > 0 ? book.collectors.length : '' }}</v-btn>
                </v-flex>
                <v-flex>
                  <v-btn small flat :color="subscribeColor(book)" @click="subscribe(book)"><v-icon>star</v-icon>订阅{{ book.subscribers.length > 0 ? book.subscribers.length : '' }}</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    books: [],
    user: {},
    isSubscribe: ''
  }),
  methods: {
    showBookDetail(book) {
      this.$store.commit('showBookDetail', book);
      this.$router.push('/main/bookDisplay/' + book._id);
    },
    collect(book) {
      if (!book.isCollect) {
        this.$http.post('/collect', { "_id": book._id, "collectors": book.collectors } )
        // this.$http.post('/api/collect', { "_id": book._id, "collectors": book.collectors } )
        .then(res => {
          if (res.data.collect) {
            book.collectors.push({ "username": this.user.username });
            // book = Object.assign({}, book, { "isCollect": true });
            this.$set(book, "isCollect", true);
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        this.$http.post('/removeCollect', { "_id": book._id, "collectors": book.collectors })
        // this.$http.post('/api/removeCollect', { "_id": book._id, "collectors": book.collectors })
        .then(res => {
          if (res.data.removeCollect) {
            // var collectors = JSON.stringify(book.collectors);
            // console.log(collectors);
            // var collector = JSON.stringify({ "username": this.user.username });
            // var removeIndex = collectors.indexOf(collector);
            var removeIndex = -1;
            for (var i=0; i<book.collectors.length; i++) {
              if (book.collectors[i].username == this.user.username) {
                removeIndex = i;
                break;
              }
            }
            console.log("removeIndex: ", removeIndex);
            book.collectors.splice(removeIndex, 1);
            book.isCollect = false;
          }
        })
        .catch(err => {
          console.log(err);
        })
       
      }
    },
    subscribe(book) {
      if (!book.isSubscribe) {
        this.$http.post('/subscribe', { "_id": book._id, "subscribers": book.subscribers } )
        // this.$http.post('/api/subscribe', { "_id": book._id, "subscribers": book.subscribers } )
        .then(res => {
          if (res.data.subscribe) {
            book.subscribers.push({ "username": this.user.username });
            this.$set(book, "isSubscribe", true);
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        this.$http.post('/removeSubscribe', { "_id": book._id, "subscribers": book.subscribers })
        // this.$http.post('/api/removeSubscribe', { "_id": book._id, "subscribers": book.subscribers })
        .then(res => {
          if (res.data.removeSubscribe) {
            var removeIndex = -1;
            for (var i=0; i<book.collectors.length; i++) {
              if (book.subscribers[i].username == this.user.username) {
                removeIndex = i;
                break;
              }
            }
            console.log("removeIndex: ", removeIndex);
            book.subscribers.splice(removeIndex, 1);
            book.isSubscribe = false;
          }
        })
        .catch(err => {
          console.log(err);
        })
       
      }
    },
    collectColor(book) {
      // for (var i=0; i<book.collectors.length; i++) {
      //   if (book.collectors[i].username == this.user.username) {
      //     book.isCollect = true;
      //     break;
      //   } else {
      //     book.isCollect = false;
      //   }
      // }
      if (book.isCollect) return 'red';
        else return 'red lighten-4';
    
    },
    subscribeColor(book) {
      if (book.isSubscribe) return 'orange';
        else return 'orange lighten-4';
    },
    fetchData() {
      this.$http.get('/getBooks')
      // this.$http.get('/api/getBooks')
        .then(res => {
          // console.log(res);
          if (res.data.getBooks) {
            this.books = res.data.books;
            for (var j=0; j<this.books.length; j++) {
              for (var i=0; i<this.books[j].collectors.length; i++) {
                if (this.books[j].collectors[i].username == this.user.username) {
                  this.books[j].isCollect = true;
                  break;
                } else {
                  this.books[j].isCollect = false;
                }
              }

              for (var k=0; k<this.books[j].subscribers.length; k++) {
                if (this.books[j].subscribers[k].username == this.user.username) {
                  this.books[j].isSubscribe = true;
                  break;
                } else {
                  this.books[j].isSubscribe = false;
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    removeHTMLTag(str) {
      str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
      str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
      str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
      str=str.replace(/\s/g,''); //将空格去掉
      return str;
    }
    // htmlEncode(html){  
    //   var div = document.createElement('div');  
    //   div.appendChild(document.createTextNode(html));  
    //   return div.innerHTML;  
    // },
    // htmlDecode(str){  
    //   var div = document.createElement('div');  
    //   div.innerHTML = str;  
    //   return div.innerText || div.textContent;  
    // }
  },
  computed: {
  
  },
  created() {
    this.$http.get('/verify')
    // this.$http.get('/api/verify')
    .then(res => {
      this.user = res.data.user;
    })
    .catch(err => {
      console.log(err);
    })
  },
  mounted() {
    this.fetchData();
  }
}
</script>
<style>
  
</style>

