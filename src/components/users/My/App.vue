<template>
  <div id="app" name="app">
    <el-container>
      <!-- 顶部导航栏 -->
      <div class="topbar">
        <div class="nav">
          <ul>
            <!-- 判断是否能获取到用户数据,如果能就显示 欢迎xx，不能就显示登录和注册按钮 -->
            <!-- 不知道这个getters能不能用。可能这里出问题 -->
            <li v-if="!this.$store.getters.getUser">
              <el-button type="text" @click="login">登录</el-button>
              <span class="sep">|</span>
              <el-button type="text" @click="register = true">注册</el-button>
            </li>
            <li v-else>
              欢迎
              <el-popover placement="top" width="180" v-model="visible">
                <p>确定退出登录吗？</p>
                <div style="text-align: right; margin: 10px 0 0">
                  <el-button size="mini" type="text" @click="visible = false"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini" @click="logout"
                    >确定</el-button
                  >
                </div>
                <el-button type="text" slot="reference">{{
                  this.$store.getters.getUser.username
                }}</el-button>
              </el-popover>
            </li>
            <li>
              <router-link to="/order">我的订单</router-link>
            </li>
            <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
              <router-link to="/shoppingCart">
                <i class="el-icon-shopping-cart-full"></i> 购物车
                <span class="num">({{ getNum }})</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- 顶部导航栏END -->

      <!-- 顶栏容器 -->
      <el-header>
        <!-- 默认开启标签页：activeIndex -->
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          active-text-color="#409eff"
          router
        >
          <div class="logo">
            <router-link to="/home">
              <img src="./logo.png" alt />
            </router-link>
          </div>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/goods">全部商品</el-menu-item>

          <!-- 搜索框框部分 -->
          <div class="so" style="display: flex">
            <el-input
              clearable
              placeholder="请输入搜索内容"
              v-model="search"
              style="width: 300px"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchClick"
                style="margin-right: 5px"
              ></el-button>
              <el-button
                slot="append"
                icon="el-icon-delete"
                @click="searchDelete"
              ></el-button>
            </el-input>
          </div>
          <!-- 搜索部分结束 -->
        </el-menu>
      </el-header>
      <!-- 顶栏容器END -->

      <!-- 登录模块 -->
      <MyLogin></MyLogin>
      <!-- 注册模块 -->
      <MyRegister :register="register" @fromChild="isRegister"></MyRegister>

      <!-- 主要区域容器 -->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <!-- 主要区域容器END -->

      <!-- 底栏容器 -->
      <el-footer>
        <div class="footer">
          <div class="ng-promise-box">
            <div class="ng-promise">
              <p class="text">
                <a class="icon1" href="javascript:;">7天无理由退换货</a>
                <a class="icon2" href="javascript:;">满99元全场免邮</a>
                <a class="icon3" style="margin-right: 0" href="javascript:;"
                  >100%品质保证</a
                >
              </p>
            </div>
          </div>
          <div class="github">
            <a
              href="https://github.com/TJhaitang/Shopping-System"
              target="_blank"
            >
              <div class="github-but"></div>
            </a>
          </div>
          <div class="mod_help">
            <p>
              <router-link to="/home">首页</router-link>
              <span>|</span>
              <router-link to="/goods">全部商品</router-link>
              <span>|</span>
              <router-link to="/about">关于我们</router-link>
            </p>
            <p class="coty">商城版权所有:李老师 &copy; 2012-2021</p>
          </div>
        </div>
      </el-footer>
      <!-- 底栏容器END -->
    </el-container>
  </div>
</template>

<script>
//引入mapActions和mapGetters
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
export default {
  beforeUpdate() {
    //这个不知道能不能用，就是获取当前路径
    this.activeIndex = this.$route.path;
  },
  data() {
    return {
      activeIndex: "", // 头部导航栏选中的标签
      search: "", // 搜索条件
      register: false, // 是否显示注册组件
      visible: false, // 是否退出登录
    };
  },
  created() {
    // 获取浏览器localStorage，判断用户是否已经登录

    if (localStorage.getItem("user")) {
      // 如果已经登录，设置vuex登录状态
      // 啊 为啥要用jason.parse呢

      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
  },
  computed: {
    ...mapGetters(["getUser", "getNum", "getShoppingCart"]),
  },
  watch: {
    // 获取vuex的登录状态
    getUser: function (val) {
      if (val === "") {
        // 用户没有登录，设置购物车为空
        this.setShoppingCart([]);
      } else {
        // 用户已经登录,获取该用户的购物车信息
        this.$http.get("/member/Shopping/getCarList.php").then((res) => {
          if (res.data.carNum > 0) {
            // 不为'fail'为成功, 更新vuex购物车状态
            this.setShoppingCart(res.data);
            this.setMerchants(res.data);
            console.log(res.data);
          } else {
            // 提示失败信息
            //this.$message.error("没获取到购物车信息 呜呜");
          }
        });
      }
    },
  },
  methods: {
    ...mapActions([
      "setUser",
      "setShowLogin",
      "setShoppingCart",
      "setMerchants",
    ]),
    login() {
      // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
      // 啊 状态里为啥要设置登录组件的开闭呀？这个有必要记录么
      // 这里的登录只是把登陆组件展示，登录的请求方法在MyLogin

      this.setShowLogin(true);
    },
    // 退出登录
    logout() {
      this.visible = false;
      // 清空本地登录信息
      localStorage.setItem("user", "");
      // 清空vuex登录信息
      this.setUser("");
      this.$message.success("成功退出登录");
    },
    // 接收注册子组件传过来的数据
    isRegister(val) {
      this.register = val;
    },
    // 点击搜索按钮
    searchClick() {
      console.log(this.search);
      if (
        this.search != "" &&
        (this.$route.path == "/home" || this.$route.path == "/goods")
      ) {
        // 跳转到全部商品页面,并传递搜索条件
        this.$router.push({ path: "/goods", query: { search: this.search } });
        this.search = "";
      } else if (this.search != "" && this.$route.path == "/merchant_detail") {
        this.$router.push({
          path: "/merchant_detail",
          query: { search: this.search },
        });
        this.search = "";
      }
    },
    searchDelete() {
      console.log(this.search);
      if (this.$route.path == "/home" || this.$route.path == "/goods") {
        // 跳转到全部商品页面,并传递搜索条件
        this.search = "";
        this.$router.push({ path: "/goods", query: { search: this.search } });
      } else if (this.$route.path == "/merchant_detail") {
        this.search = "";
        this.$router.push({
          path: "/merchant_detail",
          query: { search: this.search },
        });
      }
    },
  },
};
</script>

<style>
/* 全局CSS */
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}
/* 全局CSS END */
/* 顶部导航栏CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
}
.topbar .nav {
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.topbar .nav .shopCart-full a {
  color: white;
}
/* 顶部导航栏CSS END */
/* 顶栏容器CSS */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}
.el-header .logo {
  height: 60px;
  width: 189px;
  float: left;
  margin-right: 100px;
}
.el-header .so {
  margin-top: 10px;
  float: right;
}
/* 顶栏容器CSS END */
/* 底栏容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box {
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box .ng-promise p a {
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("./us-icon.png") no-repeat left 0;
}
.footer .github {
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
}
.footer .github .github-but {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: url("./github.png") no-repeat;
}
.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}
.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
.footer .mod_help p span {
  padding: 0 22px;
}
/* 底栏容器CSS END */
</style>