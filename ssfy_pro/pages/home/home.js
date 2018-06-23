// pages/home/home.js
const utils = require("../../utils/util.js")
var config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vwidth:0,
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
    // 判断是否为登录状态,没有登录则登录,获取fyuid
    this.islogin()


    // 判断是否授权，若已授权则跳转首页，没有则不做任何操作
    this.isAuthUserInfo()

  },

  /**
   * 判断是否授权
   */
  isAuthUserInfo:function(){
    
    var that = this
    wx.getSetting({
      success:function(res) {
        // 覆盖当前userinfo的缓存
        if (res.authSetting['scope.userInfo']) {
          that.letsgo()
        }
        
      },
      fail:function(res){
        
      }
    })

  },

  /**
   * 初始化图片宽度（高度自动拉伸）
   */
  initImage:function(){
    var vw = wx.getSystemInfoSync().windowWidth
    this.setData({
      vwidth:vw
    })
  },

  backuserinfo:function(res){
    if (res.detail.errMsg == "getUserInfo:ok"){

      // 标记是否授权
      wx.setStorageSync('isAuth', true)
      // 缓存数据
      wx.setStorageSync('userinfo', res.detail.userInfo)
    
      // 更新数据库
      this.updateuserinfo(res.detail.userInfo)
      

    }else{
      // 标记是否授权
      wx.setStorageSync('isAuth', false)
      wx.showModal({
        title: '无权限',
        content:'请先授权进行登录。',
        showCancel:false
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

  islogin:function(){
    let that = this
    let fyuid = wx.getStorageSync('fyuid')
    // 有fyuid这个字段了，则为已登录
    if(fyuid == ''){
      this.login()
    }
  },

  /**
   * 登录步骤1、微信接口登录，获取code
   */
  login:function(){
    
    let that = this
    wx.login({
      success:function(res){
        let result = that.signin(res.code)
        if(result == 0){
          utils.myshowmodel('哦哦，出错了','登录失败，但不影响您继续操作！')
        }
      },
      fail:function(res){
        
      }
    })
  },

  /***
   * 登录步骤2、将code传到服务器，进行登录
   */
  signin:function(code){
    
    utils.setloading()

    let url = config.service.requesturl + "index/login"

    let params = {
      code: code
    }
    
    utils.post(url, params,function(res){
      if(res.data.code == 200){
        wx.hideLoading()
        wx.setStorageSync('fyuid', res.data.fyuid)
        return 1
      }else{
        return 0
      }
    })
  },

  /**
   * 跳转首页
   */
  letsgo:function(){
    wx.redirectTo({
      url: '../ssfy/ssfy',
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