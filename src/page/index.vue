<template>
  <div class="index-layer">
    <el-container>
      <el-header>
        <div class="logo">供应商管理平台</div>
        <div class="user-info">
          <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo.name}}
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loginout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'64px':'150px'">
          <div class="arrow" :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" @click="isCollapse = !isCollapse"></div>
          <el-scrollbar>
            <el-menu
              :default-active="activeMenu"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :collapse="isCollapse"
              text-color="#bfcbd9"
              backgroundColor="#324157"
              active-text-color="#ffd04b" >
              <template v-for="(menu,index) in menuData">
                <el-submenu :key="index" :index="menu.index" v-if="menu.subMenu">
                  <template slot="title">
                    <img class="menuImg" :src="'/static/image/menu/icon-'+ menu.index +'-0.png'" />
                    <span>{{menu.menuName}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item  :key="subIndex" :index="subMenu.index" v-for="(subMenu,subIndex) in menu.subMenu"  @click="doOption(subMenu)" :disabled="!subMenu.option" >
                      {{subMenu.menuName}}
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item  :key="index" :index="menu.index" v-else @click="doOption(menu)" :disabled="!menu.option" >
                  <img class="menuImg" :src="menu.isOpen ? '/static/image/menu/icon-'+ menu.index +'-1.png':'/static/image/menu/icon-'+ menu.index +'-0.png'" />
                  <span slot="title">{{menu.menuName}}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main :class="{small:isCollapse}">
          <el-scrollbar>
            <div class="container" v-if="optionList.length>0">
              <el-tabs v-model="editableTabsValue" type="card"
                       @tab-remove="removeTab"
                       @tab-click="handleTabClick" >
                <el-tab-pane
                  v-for="(item, index) in optionList"
                  :key="item.name"
                  :label="item.title"
                  :name="item.name"
                  :closable=' item.name != "0" '
                >{{item.orderSn}}
                  <component :is="item.components" v-if="item.components" :orderGoodsId="item.orderGoodsId" @showOrderDetail="showOrderDetail"></component>
                  <div class="container-box" v-else>
                    {{item.content}}
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
      <el-footer class="hide"></el-footer>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import indexPage from '../components/index/indexPage.vue'
  import productEdit from '../components/product/productEdit.vue'
  import specList from '../components/product/specList.vue'
  import orderEdit from '../components/order/orderEdit.vue'
  import orderDetail from '../components/order/orderDetail.vue'
  import supplierService from '../components/service/supplierService.vue'
  import entDetail from '../components/enterprise/entDetail.vue'
  import modifyPassword from '../components/enterprise/modifyPassword.vue'

  export default{
    computed: {
      // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
        'userInfo'
      ])
    },
    created () {
      if(!this.userInfo.id){
        this.$router.push('/login')
      }
    },
    mounted(){
    },
    components:{
      productEdit,
      orderEdit,
      entDetail,
      orderDetail,
      supplierService
    },
    data () {
      return {
        isCollapse:false,
        activeMenu:'',
        menuData:[
          {
            index:'1',
            menuName: '商品信息',
            subMenu: [
              {
                index:'1-1',
                menuName: '所有商品',
                option: 'productEdit',
                components:productEdit
              }
            ]
          },
          {
            index:'2',
            menuName: '订单信息',
            subMenu: [
              {
                index:'2-1',
                menuName: '所有订单',
                option: 'orderEdit',
                components:orderEdit
              }
            ]
          },
          {
            index:'8',
            menuName: '售后',
            option: 'supplierService',
            components:supplierService
          },
          {
            index:'7',
            menuName: '企业信息',
            option: 'getEnterprise',
            components:entDetail
          },
          {
            index:'9',
            menuName: '修改密码',
            option: 'modifyPassword',
            components:modifyPassword
          }
        ],
        editableTabsValue:0,
        optionList:[
          {
            title: "首页",
            name: '0',
            content: ' content',
            components:indexPage
          }
        ]
      }
    },
    methods: {
      ...mapMutations({
        setUserInfo: 'setUserInfo' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      }),
      handleOpen:function(){
        console.log("handleOpen")
      },
      handleClose:function(){
        console.log("handleClose")
      },
      handleCommand(command) {
        if(command == 'loginout'){
          this.$router.push('/login');
        }
      },
      handleTabClick:function(tab){
        this.activeMenu = tab.name;
      },
      doOption:function(menu){
        let hasTarget = false;
        // 判断当前选择菜单是否已存在
        this.optionList.forEach((tab, index) => {
          if (tab.name === menu.index) {
            hasTarget = true;
          }
        });
        // 如果不存在 添加一个
        if(!hasTarget){
          let option = {
            title: menu.menuName,
            name: menu.index,
            content: menu.menuName+' content',
            components:menu.components
          };
          if(menu.orderGoodsId){
            option.orderGoodsId = menu.orderGoodsId;
          }
          this.optionList.push(option);
        }
        this.editableTabsValue = menu.index;
      },
      removeTab:function(targetName) {
        let tabs = this.optionList;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.optionList = tabs.filter(tab => tab.name !== targetName);
      },
      showOrderDetail:function(orderGoodsId){
        let option = {
          index:'orderGoodsId_'+orderGoodsId,
          orderGoodsId:orderGoodsId,
          menuName: '订单详情',
          option: 'orderDetail',
          components:orderDetail
        };
        this.doOption(option);
      }
    }
  }
</script>
<style lang="stylus">
  .el-aside
    .el-scrollbar__bar
      display:none !important;
  .el-scrollbar__wrap
    overflow: auto;
  .el-select-dropdown
    .el-scrollbar
      padding-bottom: 17px;
  .el-select-dropdown__list
    max-height:100px;
  .el-input-group__append
    cursor:pointer;
</style>
<style lang="stylus" scoped>
  @import "../style/config.styl";
  .index-layer
    color:FONT_COLOR;
    height: 100%;
    overflow:hidden;
    .el-container
      width: 100%;
      height: 100%;
      overflow: hidden;
      .el-header
        position: relative;
        line-height: 60px;
        color:#fff;
        background: #2E363F;
        .logo
          float: left;
          font-size:24px;
          padding-left:90px;
          background: url(/static/image/logo.png) center left no-repeat;
          background-size: auto 30px;

        .user-info
          float: right;
          padding-right: 50px;
          font-size: 16px;
          color: #fff;

        .user-info .el-dropdown-link
          position: relative;
          display: inline-block;
          color: #fff;
          cursor: pointer;
          vertical-align: middle;

        .el-dropdown-menu__item
          text-align: center;


      .el-aside
        position: absolute;
        top:60px;
        left:0;
        max-width:200px;
        height: 100%;
        background: #324157;
        overflow: hidden;
        >.arrow
          position:absolute;
          top:0;
          right:0;
          width:30px;
          height:30px;
          line-height:30px;
          text-align:center;
          color:rgb(255, 208, 75);
          background: #324157;
          cursor:pointer;
          z-index:9;
        .el-menu
          padding: 30px 0;
          border: none;
          &:not(.el-menu--collapse)
            width: 150px;
        .menuImg
          float: left;
          width:1.5em;
          margin-top: 1.3em;
          margin-right:0.25em;
          object-fit:contain;
      .el-main
        padding:0 0 0 170px;
        min-width:1250px;
        height: 100%;
        &.small
          padding:0 0 0 70px;
        .el-scrollbar
          height:100%;
        .container
          margin:20px;
          box-shadow:1px 1px 5px #eee;
          .container-box
            height:100%;
  .row
    clear:both;
    height:3em;
    line-height:3em;
    margin-bottom:10px;
    >div
      float:left;
    .label
      margin-right:10px;
      width:4em;
      line-height:3em;
      text-align:right;
    .el-select
      margin-right:10px;
    .el-input
      width:300px;
    .el-textarea
      width:300px;
    .el-checkbox-group
      display:inline-block;
      width:600px;
    .file-upload
      height:3em;
</style>
