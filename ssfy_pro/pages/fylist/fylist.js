// pages/fylist/fylist.js
const utils = require("../../utils/util.js")
const config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fylist:[],
    currentpage:1,
    totalpage:1,
    avatarurl:''
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
    var url = wx.getStorageSync('userinfo').avatarUrl
    
    this.setData({
      avatarurl:url
    })
    // 初始化页面
    this.initdata()
  },

  /**
   * 初始化数据
   */
  initdata:function(){
    var _this = this
    var url = config.service.requesturl + "index/gethotlist?page=1"
    var parmas = []
    utils.setloading()
    utils.getData(url,parmas,function(res){
      utils.hidemyloading()
      if(res.data.code != 200){
        utils.showmymodal('哦哦，出错了！','请重试！')
        return 0
      }
      console.log(res)
      // 赋值操作
      _this.setData({
        fylist:res.data.content,
        currentpage: res.data.currentpage,
        totalpage: res.data.totalpage
      })
    })
  },

  /**
   * 加载更多
   */
  addmore:function(){

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