<!-- 表格分页组件 -->
<template>
  <div class="pagination-container">
    <template v-if="total !== 0">
      <div class="total-page">共 {{total}}条，每页{{number}}条 </div>
    <ul class="pagination ul">
      <li class="li-v" @click="setCurrent(1)"> &laquo;</li>
      <li class="li-v" @click="setCurrent(currentPage - 1)"> ‹ </li>
      <li class="li" v-for="p in grouplist" :class="{'active': currentPage == p.val}" @click="setCurrent(p.val)"> {{ p.text }} </li>
      <li class="li-v" @click="setCurrent(currentPage + 1)"> › </li>
      <li class="li-v" @click="setCurrent(page)"> &raquo; </li>
    </ul>
    <div class="page-num"><input type="text" class="page-input" v-model="pageNum" @blur="setCurrent(pageNum)" autocomplete="off">/{{ page }}页</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    total: {            // 数据总条数
      type: Number,
      default: 0
    },
    number: {            // 每页显示条数
      type: Number,
      default: 10
    },
    current: {            // 当前页码
      type: Number,
      default: 1
    },
    pagegroup: {        // 分页条数 -- 奇数
      type: Number,
      default: 5,
      coerce: function (v) {
        v = v > 0 ? v : 5
        return v % 2 === 1 ? v : v + 1
      }
    }
  },
  data () {
    return {
      currentPage: this.current,
      pageNum: this.current
    }
  },
  updated(){
    this.currentPage = this.current;
  },
  computed: {
    page: function () { // 总页数
      return Math.ceil(this.total / this.number)
    },
    grouplist: function () { // 获取分页页码
      let len = this.page
      let temp = []
      let list = []
      let count = Math.floor(this.pagegroup / 2)
      let center = this.currentPage
      if (len <= this.pagegroup) {
        while (len--) {
          temp.push({text: this.page - len, val: this.page - len})
        }
        return temp
      }
      while (len--) {
        temp.push(this.page - len)
      }
      ;
      var idx = temp.indexOf(center);
      (idx < count) && (center = center + count - idx);
      (this.currentPage > this.page - count) && (center = this.page - count)
      temp = temp.splice(center - count - 1, this.pagegroup)
      do {
        var t = temp.shift()
        list.push({
          text: t,
          val: t
        })
      } while (temp.length)
      if (this.page > this.pagegroup) {
        (this.currentPage > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
        (this.currentPage < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1})
      }
      return list
    }
  },
  methods: {
    setCurrent: function (idx) {
      if (parseInt(this.currentPage) !== parseInt(idx) && parseInt(idx) > 0 && parseInt(idx) < this.page + 1) {
        this.currentPage = parseInt(idx)
        this.pageNum = this.currentPage
        this.$emit('set-current', this.currentPage)
      } else {
        this.pageNum = this.currentPage
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .pagination-container{
    clear:both;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 16px;
    font-family: "Microsoft YaHei UI";
    color: #333333;
  }
  .pagination{
    display: flex;
  }
  .active{
    background-color: #e8d8b2;
    color: #ffffff;
  }
  .total-page{
    padding: 9px 15px;
    margin-left: 10px;
    /*border: 1px solid #dddddd;*/
  }
  .page-num{
    padding: 5px 10px;
    margin-left: 10px;
    border: 1px solid #dddddd;
  }
  .ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .li{
    cursor: pointer;
    padding: 9px 14px;
    margin: 3px;
    border: 1px solid #dddddd;
  }
  .li-v{
    cursor: pointer;
    padding: 9px 15px;
    margin: 3px;
    border: 1px solid #dddddd;
  }
  .page-input{
    width:40px;
    height:25px;
    margin-right: 5px;
    font-family: "Microsoft YaHei UI";
    font-size: 16px;
    text-align: center;
    border-radius: 2px;
    color: #333333;
    border: 1px solid #dadada;
    cursor: inherit;
    outline: none;
  }
  .page-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
  }
  .page-input::-webkit-input-placeholder:-moz-placeholder::-moz-placeholder:-ms-input-placeholder{
    color: #b7b7b7;
  }
</style>
