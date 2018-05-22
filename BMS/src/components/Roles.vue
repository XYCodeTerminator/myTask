<template>
  <div>
    <v-alert v-model="errorAlert" type="error" transition="scale-transition" dismissible >
      {{ errorMsg }}
    </v-alert>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field label="角色名称" v-model="editedItem.roleName"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="角色描述" v-model="editedItem.roleDescribe"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">取消</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="display">
      <v-card-title>
        <b style="font-size: 18px">角色管理</b>
        <v-btn icon @click="addRole">
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
          <td class="text-xs-center">{{ props.item.roleName }}</td>
          <td class="text-xs-center">{{ props.item.roleDescribe }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
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
export default {
  data: () => ({
    errorAlert: false,
    errorMsg: '',
    display: false,
    dialog: false,
    search: '',
    pageText: '每页显示行数',
    pageItems: [15, 25, 35, { "text": "所有", "value": -1 }],
    headers: [
      { text: "角色名称", value: "roleName", align: "center" },
      { text: "角色描述", value: "roleDescribe", align: "center" },
      { text: "操作", value: "operation", sortable: false, align: "center" }
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      roleName: "",
      roleDescribe: ""
    },
    defaultItem: {
      roleName: "",
      roleDescribe: ""
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新建角色" : "编辑角色";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.$http.get('/verify')
    // this.$http.get('/api/verify')
    .then(res => {
      if (res.data.user.role.roleName != 'superAdmin') {
        // console.log('axios');
        this.errorAlert = true;
        this.errorMsg = '权限不足，请联系超级管理员！！！';
        setTimeout(() => {
          this.errorAlert = false;
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
  methods: {
    fetchData() {
      this.$http.get('/getRoles')
      // this.$http.get('/api/getRoles')
        .then(res => {
          // console.log(res);
          if (res.data.getRoles) {
            this.items = res.data.roles;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm("确定要删除此角色吗？")) {
        this.$http.post("/deleteRole", item)
        // this.$http.post("/api/deleteRole", item)
          .then(res => {
            if (res.data.deleteRole) {
               this.items.splice(index, 1)
            } else {
              this.errorAlert = true;
              this.errorMsg = res.data.msg;
              setTimeout(() => {
                this.errorAlert = false;
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        this.$http.post("/updateRole",
        // this.$http.post("/api/updateRole", 
          { "originalRole": this.items[this.editedIndex], "modifiedRole": this.editedItem })
        .then(res => {
          if (res.data.updateRole) {
            Object.assign(this.items[this.editedIndex], this.editedItem);
          } else {
            this.errorAlert = true;
            this.errorMsg = res.data.msg;
            setTimeout(() => {
              this.errorAlert = false;
            }, 2000);
          }
        })
        .catch(err => {
          console.log(err);
        });
        
      } else {
        this.$http.post("/addRole", this.editedItem)
        // this.$http.post("/api/addRole", this.editedItem)
        .then(res => {
          if (res.data.addRole) {
            this.items.push(this.editedItem);
          } else {
            this.errorAlert = true;
            this.errorMsg = res.data.msg;
            setTimeout(() => {
              this.errorAlert = false;
            }, 2000);
            
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
      this.close();
    },
    addRole() {
        this.dialog = true;
    }
  }
};
</script>
