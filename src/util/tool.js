export default {
  toast (msg = '', time = 2000) {
    var toastDiv = document.createElement('div')
    toastDiv.className = 'toast'
    toastDiv.innerHTML = msg
    document.getElementsByClassName("common-toast")[0].appendChild(toastDiv)
    var timer = setTimeout(() => {
      document.getElementsByClassName("common-toast")[0].removeChild(toastDiv)
      clearTimeout(timer)
    }, time)
  },
  excPrompt (err) {
    let that = this;
    let res = err.response;
    console.log(err);
    if (res) {
      if(res.data.exception.indexOf('UserNotLoginException') > 0){
        sessionStorage.removeItem("userInfo");
        setTimeout(() => {
          location.href = '/login'
        }, 1000)
      }
      let errorMessage = res.data.message;
      let errors = res.data.errors;
      if(errors && errors[0]){
        errorMessage = errors[0].defaultMessage;
      }
      this.toast(errorMessage, 1000);
    } else {
      this.toast('操作异常', 1000)
    }
  },
  getErrorMessage(err){
    let that = this;
    let res = err.response;
    console.log(err);
    if (res) {
      let errorMessage = res.data.message;
      let errors = res.data.errors;
      if(errors && errors[0]){
        errorMessage = errors[0].defaultMessage;
      }
      if(res.data.exception.indexOf('UserNotLoginException') > 0){
        this.toast(errorMessage, 1000);
        setTimeout(() => {
          location.href = '/login'
        }, 1000)
      }
      return errorMessage;
    } else {
      return '操作异常';
    }
  },
  isInArr(obj,Arr){
    var i = Arr.length;
    while (i--) {
      if (Arr[i] === obj) {
        return true;
      }
    }
    return false;
  },
  removeFormArr(obj,arr){
    for(var i=0; i<arr.length; i++) {
      if(arr[i] == obj) {
        arr.splice(i, 1);
        break;
      }
    }
  },
  getPrice(price){
    var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
    if (re.test(price)) {
      return (price/100).toFixed(2);
    }else{
      return price;
    }
  },
  scrollTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  countDown(count,callBack){
    /*
     倒计时
     */
    let that = this;
    setTimeout(function(){
      count--;
      callBack(count);
      if(count>0){
        that.countDown(count,callBack);
      }
    },1000);
  },
  openNewPage(url){
    if(url){
      window.open(url);
    }
  },
  passwordTest(pass){
    //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
    return pPattern.test(pass)
  }
}
