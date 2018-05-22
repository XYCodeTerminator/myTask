<template>
<div>
  <v-alert v-model="authAlert" type="error" transition="scale-transition" dismissible >
    权限不足，请联系超级管理员！！！
  </v-alert>
  <v-card v-if="display">
    <v-card-title>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" lazy-validation>
      <v-container grid-list-md text-xs-center>
        <v-layout wrap>
          <v-flex xs6 sm4 md3>
            <v-text-field label="书名" v-model="book.name" prepend-icon="book"></v-text-field>
          </v-flex>
          <v-flex xs6 sm4 md3>
            <v-text-field label="分类" v-model="book.category" prepend-icon="class"></v-text-field>
          </v-flex>
          <v-flex xs6 sm4 md3>
            <v-text-field label="库存" v-model="book.stock" type="number" prepend-icon="library_books"></v-text-field>
          </v-flex>
          <v-flex xs6 sm4 md3>
            <v-text-field label="在库" v-model="book.left" type="number" prepend-icon="assignment_turned_in"></v-text-field>
          </v-flex>
          <v-flex xs6 sm4 md3>
            <v-menu
              ref="BookMenu"
              lazy
              :close-on-content-click="false"
              v-model="bookMenu"
              transition="scale-transition"
              offset-y
              full-width
              :return-value.sync="book.publishTime"
            >
              <v-text-field
              slot="activator"
              label="出版时间"
              v-model="book.publishTime"
              prepend-icon="event"
              readonly
              ></v-text-field>
              <v-date-picker v-model="book.publishTime" no-title scrollable locale="zh-cn">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="beginMenu = false">取消</v-btn>
              <v-btn flat color="primary" @click="$refs.BookMenu.save(book.publishTime)">确定</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6 sm4 md3>
            <v-text-field label="价格" v-model="book.price" prepend-icon="¥"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-subheader style="font-size: 16px;">图片简介：</v-subheader>
            <vue-dropzone ref="myVueDropzone" id="dropzone" name="files" :options="dropzoneOptions" @vdropzone-success-multiple="successUpload"></vue-dropzone>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-subheader style="font-size: 16px;">内容介绍：</v-subheader>
            <quill-editor v-model="book.content"
                  ref="myQuillEditor"
                  :options="editorOption"
            >
            </quill-editor>
            <!-- <div class="html ql-editor" v-html="book.content"></div> -->
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-btn class="warning" @click="clearBook">清除</v-btn>
            <v-btn class="success" @click="saveBook" :disabled="!saveBookValid" :loading="loading">登记</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      </v-form>
    </v-card-text>

    <!-- <v-card-actions>
      <v-btn class="warning">清除</v-btn>
      <v-btn class="success">登记</v-btn>
    </v-card-actions> -->

  </v-card>
</div>
</template>

<script>

  // import eventBus from '../eventBus'
  import { mapGetters, mapActions } from 'vuex'
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  
  export default {
    data() {
      return {
        authAlert: false,
        display: false,
        valid: true,
        bookMenu: false,
        saveBookValid: true,
        loading: false,
        // 图片上传组件配置项
        dropzoneOptions: {
          paramName: 'files',
          // url: '/api/upload',
          url: '/upload',
          thumbnailWidth: 200,
          thumbnailHeight: 200,
          timeout: 1000 * 60 * 10,
          maxFilesize: 10000,
          autoProcessQueue: false,
          uploadMultiple: true,
          parallelUploads: 9,
          maxFiles: 9,
          addRemoveLinks: true,
          dictCancelUpload: '取消上传',
          dictCancelUploadConfirmation: '确定要取消上传吗？',
          dictRemoveFile: '移除',
          dictDefaultMessage: "<div text-align='center'><i class='fa fa-cloud-upload fa-3x'></i><br>拖拽上传</div>",
          headers: { "My-Awesome-Header": "header value" }
        },
        // 富文本编辑期组件配置项
        editorOption: {
          placeholder: "输入图书简介。。。",
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction

              [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],

              ['clean']                                         // remove formatting button
            ]
          }
        }
      }
    },
    components: {
      vueDropzone: vue2Dropzone,
      quillEditor
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
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    methods: {
      successUpload(file, response) {
        console.log(response);
        if (response.upload) {
          this.book.images = response.images;
          if (!this.book._id) {
            this.$http.post('/addBook', this.book) // 正式环境
            // this.$http.post('/api/addBook', this.book) // 开发环境
            .then(res => {
              if (res.data.addBook) {
                this.loading = false;
                this.valid = true;
                this.clearBook();
              } else {

              }
            })
            .catch(err => {
              console.log(err);
            });
          } else {
              this.$http.post('/updateBook', { "_id": this.book._id , "modifiedBook": this.book })
            // this.$http.post('/api/updateBook', { "_id": this.book._id , "modifiedBook": this.book })
            .then(res => {
              if (res.data.updateBook) {
                this.loading = false;
                this.valid = true;
                this.clearBook();
              }
            })
            .catch(err => {
              console.log(err);
            });
          }
        }
        
      },
      clearBook() {
        this.$refs.myVueDropzone.removeAllFiles();
        this.$store.dispatch('clearBook');
      },
      saveBook() {
        this.loading = true;
        this.valid = false;
        this.$refs.myVueDropzone.processQueue();
      }
    },
    // mounted() {
    //   if (this.book._id) {
    //     this.editFlag = 'editBook';
    //   } else {
    //     this.editFlag = 'addBook';
    //   }
    // },
    computed: {
      ...mapGetters([
        'book'
      ])
    },
    // created() {
    //   eventBus.$on('addBookDetail', data => {
    //     // console.log(data);
    //     // console.log(this.editedItem);
    //     Object.assign(this.editedItem, data);
    //   })
    // }
  }
</script>

<style>
 
  .ql-container .ql-editor {
        min-height: 20em;
        padding-bottom: 1em;
        max-height: 25em;
  }
  /* .html {
      overflow-y: auto;
      border: 1px solid #ccc;
      border-top: none;
      resize: vertical;
      height: 16em;
  } */
  
</style>


