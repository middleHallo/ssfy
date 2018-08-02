// pages/home/home.js
const utils = require("../../utils/util.js")
var config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheight:0,
    mengbanhidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    // 初始化图片
    this.initImage()
    
    // 判断是否为登录状态,没有登录则请求微信登录接口获取code,再将code来获取fyuid
    this.islogin()
  },

  /**
   * 判断是否登录
   */
  islogin: function () {

    let fyuid = wx.getStorageSync('fyuid')
    // 有fyuid这个字段了，则为已登录
    if (fyuid == '') {
      this.login()

      return 0
    }
    
    this.setmengbanhidden()
  },

  // 等获取用户信息完之后再让蒙版消失，避免出现不必要的麻烦
  setmengbanhidden:function(){
    this.setData({
      mengbanhidden: true
    })

    // 判断是否授权，若已授权则跳转首页，没有则不做任何操作
    this.isAuthUserInfo()
  },

  /**
   * 登录步骤1、微信接口登录，获取code
   */
  login: function () {
    utils.setloading()
    let that = this
    wx.login({
      success: function (res) {
        that.signin(res.code)
      },
      fail: function (res) {

        that.setmengbanhidden()
      }
    })
  },

  /***
   * 登录步骤2、将code传到服务器，进行登录
   */
  signin: function (code) {

    let that = this
    let url = config.service.requesturl + "index/login?code=" + code

    var pramas = []
    utils.post(url, pramas, function (res) {
      if (res.data.code == 200) {
        utils.hidemyloading()
        wx.setStorageSync('fyuid', res.data.fyuid)
      } else {
        
      }

      that.setmengbanhidden()
    })
  },

  /**
   * 判断是否授权
   */
  isAuthUserInfo:function(){
    
    var that = this
    var fyuid = wx.getStorageInfoSync('fyuid')
    wx.getSetting({
      success:function(res) {
        // 如果当前已授权并且存在fyuid则进入
        if (res.authSetting['scope.userInfo'] && fyuid ) {
          that.letsgo()
        }
      }
    })

  },

  /**
   * 初始化图片宽度（高度自动拉伸）
   */
  initImage:function(){
    var vw = wx.getSystemInfoSync().windowHeight
    this.setData({
      imgheight:vw
    })
  },

  backuserinfo:function(res){

    let that = this
    if (res.detail.errMsg == "getUserInfo:ok"){
      // 标记是否授权
      wx.setStorageSync('isAuth', true)
      // 缓存数据
      wx.setStorageSync('userinfo', res.detail.userInfo)
    
      // 更新数据库
      that.updateuserinfo(res.detail.userInfo)
      
    }else{
      // 标记是否授权
      wx.setStorageSync('isAuth', false)
      wx.showModal({
        title: '当前未收权',
        content:'不可进行点赞评论等操作！',
        showCancel:false,
        success: function (res) {
        },
        fail:function(){
        },
        complete:function(){
          that.letsgo()
        }
      })
    }
  },

  updateuserinfo:function(arr){

    utils.setloading()
    let url = config.service.requesturl + "index/updatefyuif"
    let fyuid = wx.getStorageSync('fyuid')
    let params = {
      fyuid: fyuid,
      nickname:arr.nickName,
      avatarurl: arr.avatarUrl,
      gender:arr.gender,
      country:arr.country,
      province:arr.province,
      city:arr.city
    }

    utils.post(url, params, function (res) {

      wx.hideLoading()
      if (res.data.code != 200) {
        utils.myshowmodel('哦哦，出错了','登录失败！')
      }
    })

    this.letsgo()
  },

  

  /**
   * 跳转首页
   */
  letsgo:function(){
    wx.redirectTo({
      url: '../fylist/fylist',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})