<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant.sync="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="'static/images/' + headIcon" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ this.currentUser.username }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="miniVariant = !miniVariant">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-toolbar>
      <v-list>
        <v-divider v-if="sysDisplay"></v-divider>
        <v-subheader v-if="sysDisplay">系统管理</v-subheader>
        <v-list-tile
          v-for="(item, i) in systemItems"
          :key="'systemItem-' + i"
          :to="item.href"
          v-if="item.display"
          @click="setSession(item)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>
        <v-subheader>账户设置</v-subheader>
        <v-list-tile
            v-for="(item, i) in accountSettingItems"
            :key="'accountSettingItem-' + i"
            :to="item.href"
            @click="setSession(item)"
          >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <!-- <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list> -->
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      // miniVariant: false,
      clipped: false,
      drawer: true,
      fixed: false,
      sysDisplay: false,
      headIcon: '',
      systemItems: [{
        display: false,
        icon: 'fa fa-users',
        title: '用户管理',
        href: '/main/users'
      },{
        display: false,
        icon: 'face',
        title: '角色管理',
        href: '/main/roles'
      },{
        display: false,
        icon: 'fa fa-book',
        title: '图书管理',
        href: '/main/bookManage'
      },{
        display: false,
        icon: 'fa fa-edit',
        title: '图书登记',
        href: '/main/bookDetailEdit'
      }],
      accountSettingItems: [{
        display: true,
        icon: 'fa fa-book',
        title: '图书一览',
        href: '/main/bookDisplay'
      },{
        display: true,
        icon: 'favorite',
        title: '我的收藏',
        href: '/main/myCollectBooks'
      },{
        display: true,
        icon: 'star',
        title: '我的订阅',
        href: '/main/mySubscribeBooks'
      },{
        display: true,
        icon: 'fa fa-sign-out',
        title: '注销',
        href: '/'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '图书管理系统',
      currentUser: {}
    }
  },
  name: 'App',
  created() {
    this.$http.get('/verify')
    // this.$http.get('/api/verify')
    .then(res => {
      if (res.data.isLogin) {
        this.currentUser = res.data.user;
        if (res.data.user.role.roleName == 'superAdmin') {
          this.sysDisplay = true;
          this.headIcon = 'superAdmin.png';
          for (var i=0; i<this.systemItems.length; i++) {
            this.systemItems[i].display = true;
          }
        } else if (res.data.user.role.roleName == 'admin') {
          this.sysDisplay = true;
          this.headIcon = 'admin.png';
          this.systemItems[2].display = true;
          this.systemItems[3].display = true;
        } else {
          this.headIcon = 'user.png';
        }
      } else {
        this.$router.push('/');
      }
    })
    .catch(err => {
      console.log(err);
    })
  },
  methods: {
    setSession(item) {
      if (item.title == '注销') {
        this.$http.get('/clearSession')
        // this.$http.get('/api/clearSession')
        .then(res => {
          this.$router.push('/');
        })
        .catch(err => {
          console.log(err);
        })
      } else if (item.title == '图书登记') {
        this.$store.commit('clearItem');
      }
    }
  }
}
</script>
