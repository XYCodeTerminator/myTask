<template>
  <div>
    <v-alert v-model="errorAlert" type="error" transition="scale-transition" dismissible >
      {{ errorMsg }}
    </v-alert>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="用户名" v-model="editedItem.username"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="密码" v-model="editedItem.password"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field name="phone" label="手机号" id="phone" v-model="editedItem.phone" :rules="phoneRules"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select label="选择角色" :items="roles" item-text="roleName" item-value="roleDescribe" v-model="editedItem.role" 
                  single-line prepend-icon="face" return-object>
                </v-select>
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
        <b style="font-size: 18px">用户管理</b>
        <v-btn icon @click="addUser">
            <v-icon medium>person_add</v-icon>
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
          <td class="text-xs-center">{{ props.item.username }}</td>
          <td class="text-xs-center">{{ props.item.password }}</td>
          <td class="text-xs-center">{{ props.item.phone }}</td>
          <td class="text-xs-center">{{ props.item.role.roleName }}</td>
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
      { text: "用户名", value: "username", align: "center" },
      { text: "密码", value: "password", align: "center" },
      { text: "电话", value: "phone", align: "center" },
      { text: "角色名称", value: "roleName", align: "center" },
      { text: "操作", value: "operation", sortable: false, align: "center" }
    ],
    items: [],
    roles: [],
    editedIndex: -1,
    phoneRules: [
        v => !!v || '电话不能为空',
        v => /^1\d{10}$/.test(v) || '手机号不否和规则！'
    ],
    editedItem: {
      username: "",
      password: "",
      phone: "",
      role: { roleName: '', roleDescribe: '' }
    },
    defaultItem: {
      username: "",
      password: "",
      phone: "",
      role: { roleName: '', roleDescribe: '' }
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新建用户" : "编辑用户";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  beforeCreate() {
    // console.log('beforeCreate', this.pageText);
  },
  created() {
    // console.log('created');
    this.$http.get('/verify')
    // this.$http.get('/api/verify')
    .then(res => {
      if (res.data.user.role.roleName != 'superAdmin') {
        // console.log('axios');
        this.errorAlert = true;
        this.errorMsg = "权限不足，请联系超级管理员！！！"
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
      // 获取用户列表数据
      this.$http.get('/getUsers')
      // this.$http.get('/api/getUsers')
        .then(res => {
          // console.log(res);
          if (res.data.getUsers) {
            this.items = res.data.users;
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
        })
    
      // 获取角色下拉列表数据
      this.$http.get('/getRoles')
      // this.$http.get('/api/getRoles')
        .then(res => {
          if (res.data.getRoles) {
            this.roles = res.data.roles;
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
        })
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm("确定要删除此用户吗？")) {
        this.$http.post("/deleteUser", item)
        // this.$http.post("/api/deleteUser", item)
          .then(res => {
            if (res.data.deleteUser) {
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
        this.$http.post("/updateUser", 
        // this.$http.post("/api/updateUser", 
          { "originalUser": this.items[this.editedIndex], "modifiedUser": this.editedItem })
        .then(res => {
          if (res.data.updateUser) {
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
        this.$http.post("/addUser", this.editedItem)
        // this.$http.post("/api/addUser", this.editedItem)
          .then(res => {
            if (res.data.addUser) {
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
    addUser() {
        this.dialog = true;
    }
  }
};
</script>
