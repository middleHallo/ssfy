// pages/fytips/fytips.js
const utils = require("../../utils/util.js")
const config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    wx.showModal({
      title: '点赞失败！',
      content: '请先授权登录!',
      showCancel:false
    })
  },

  /**
   * 获取用户信息
   */
  getData:function(res){
    if (res.detail.errMsg == "getUserInfo:ok") {

      // 标记是否授权
      wx.setStorageSync('isAuth', true)
      // 缓存数据
      wx.setStorageSync('userinfo', res.detail.userInfo)

      // 更新数据库
      this.updateuserinfo(res.detail.userInfo)

    } else {
      // 标记是否授权
      wx.setStorageSync('isAuth', false)
      wx.showModal({
        title: '授权失败',
        content: '请先授权进行登录。',
        showCancel: false
      })
    }
  },

  /**
   * 更新用户数据、注册或者是重新登录
   */
  updateuserinfo: function (arr) {

    utils.setloading()
    let url = config.service.requesturl + "index/updatefyuif"
    let fyuid = wx.getStorageSync('fyuid')
    let params = {
      fyuid: fyuid,
      nickname: arr.nickName,
      avatarurl: arr.avatarUrl,
      gender: arr.gender,
      country: arr.country,
      province: arr.province,
      city: arr.city
    }

    utils.post(url, params, function (res) {

      wx.hideLoading()
      if (res.data.code != 200) {
        utils.myshowmodel('哦哦，出错了', '登录失败！')
      }

      wx.navigateBack({})
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