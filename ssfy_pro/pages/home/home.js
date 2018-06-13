// pages/home/home.js
const utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vwidth:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo = wx.getStorageSync('userInfo')

    console.log(userinfo)
    if (userinfo){
      this.letsgo()
    }
    
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

  /**
   * 跳转首页
   */
  letsgo:function(){
    wx.redirectTo({
      url: '../ssfy/ssfy',
    })
  },

  /**
   * 获取用户信息回调函数
   */
  onGotUserInfo:function(e){
    var errmsg = e.detail.errMsg
    
    // 授权失败
    if(errmsg != "getUserInfo:ok"){
      utils.myshowErrorToast()
    }else{
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.letsgo()
    }

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