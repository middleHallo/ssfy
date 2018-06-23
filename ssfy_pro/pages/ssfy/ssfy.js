// pages/ssfy/ssfy.js
const utils = require("../../utils/util.js")
var config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // image的宽度和text以及Input的宽度
    vw:320,
    textw:320,
    inputw:320,
    scrollH:100,
    comments:[],
    htcontent:[],
    moreword:"加载更多...",
    moreclass:"addmorecomment",
    currentpage:1,
    totalpage:1,
    htid:"",
    mycomment:""
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

    this.initConfig()
    this.getHotHtAndComments()
    this.coveruserinfo()
  },

  /**
   * 初始化text和图片大小
   */
  initConfig:function(){
    var vw = wx.getSystemInfoSync().windowWidth
    var sH = wx.getSystemInfoSync().windowHeight

    this.setData({
      vw: vw,
      textw:vw-10,
      inputw: vw - 130,
      scrollH: sH - 60
    })
  },

  /**
   * 获取最热话题及评论
   */
  getHotHtAndComments:function(){
    var that = this
    var url = config.service.requesturl + "index/gethot"
    utils.getData(url,[],function(res){
      console.log(res)
      var data = res.data
      if (data.totalpage <= data.currentpage){
        that.setData({
          moreword: "已无更多数据!",
          moreclass: "addmorecomment2"
        })
      }
      that.setData({
          htcontent: res.data.content,
          comments: res.data.comments,
          totalpage:res.data.totalpage,
          htid:res.data.content.htid
      })
    })
  },
  /**
   * 覆盖本地数据
   */
  coveruserinfo:function(){

    wx.getSetting({
      success: function (res) {
        // 覆盖当前userinfo的缓存
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('userinfo', res.userInfo)
            }
          })
        }
      },
      fail: function (res) {

      }
    })
    
  },

  /**
   * 根据htid来获取更多评论
   */
  getMoreComments:function(htid,page){

    var totalpage = this.data.totalpage
    var htlength = utils.isempty(htid)
    if ((htlength <= 0) || (totalpage<=page)){

      utils.myshowmodel('请求失败','已无更多数据!')

      return 0
    }

    var url = config.service.requesturl + "index/getmorecomments";
    var parmas = {
      htid: htid,
      page:page
    }
    utils.getData(url,parmas,function(res){
      console.log(res)
    })

  },

  /**
   * 监听输入框输入及删除事件
   */
  inputcomment:function(e){
    this.setData({
      mycomment:e.detail.value
    })
  },
  /**
   * 提交评论
   */
  say:function(){

    // 先判断是否存在fyuid
    var fyuid = wx.getStorageSync('fyuid')
    if(!fyuid){
      utils.myshowmodel('出错了','没授权登录!')
    }

    // 先判断mycomment是否为空,若为空则跳出当前方法
    var mycomment = this.data.mycomment
    var strlen = utils.isempty(mycomment)

    if (strlen == 0){
      utils.myshowmodel('评论失败','评论内容不能为空！')
      return 0
    }

    // 评论内容不为空时执行以下代码
    var htid = this.data.htid
    
    var params = {
      comment: mycomment,
      fyuid: fyuid,
      htid: htid
    }
    var url = config.service.requesturl + "index/addcomment"
    // 其次带上当前user信息进行POST请求
    utils.post(url, params,function(res){
      console.log(res)
    })
  },

  /**
   * 点击跳转到相应的列表
   */
  goList:function(){
    wx.navigateTo({
      url: '../fylist/fylist?title=122',
    })
  },

  /**
   * 点击加载更多评论内容
   */
  addmore:function(){
    var page = this.data.currentpage + 1
    var htid = this.data.htid
    this.getMoreComments(htid,page)
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