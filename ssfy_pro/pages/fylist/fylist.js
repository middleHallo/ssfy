// pages/fylist/fylist.js
const utils = require("../../utils/util.js")
const config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hothtlist:[],
    currentdata:{},
    htlist:[],
    currentpage:1,
    totalpage:1,
    avatarurl:''
  },
  changehotlist: function (event){
    var hotlist = this.data.hothtlist[event.detail.current]
    this.setData({
      currentdata: hotlist
    })
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
    
    // 初始化页面
    this.gethothts()
    this.gethts()
   
  },

  /**
   * 初始化数据
   */
  gethothts:function(){
    var fyuid = wx.getStorageSync('fyuid')
    var url = config.service.requesturl + "index/gethothtlist?userid=" + fyuid
    this.getdata(url, 0)
  },

  gethts:function(){
    var fyuid = wx.getStorageSync('fyuid')
    var url = config.service.requesturl + "index/gethtlist?userid=" + fyuid
    this.getdata(url, 1)
  },

  getdata:function(url,datatype){
    utils.setloading()
    var _this = this
    var geturl = url
    var parmas = []
    utils.setloading()
    utils.getData(geturl, parmas, function (res) {
      wx.hideLoading()
      if (res.data.code != 200) {
        utils.myshowmodel('哦哦，出错了！', '请重试！')
        return 0
      }

      utils.showsuccess('加载成功 !')
      
      if( datatype == 0){
       
        
        // 赋值热门话题操作
        _this.setData({
          hothtlist: res.data.content,
          currentdata: res.data.content[0]
        })
      }else{
        
        // 赋值普通话题操作
        _this.setData({
          htlist: res.data.content,
          currentpage: res.data.currentpage,
          totalpage: res.data.totalpage
        })
      }
      
    })
  },

  /**
   * 点赞请求
   */
  goods:function(url,httype){
    var that = this
    var isAuth = wx.getStorageSync('isAuth')
    if (isAuth == false) {
      wx.navigateTo({
        url: '../fytips/fytips',
      })
      return -1;
    }
    var userid = wx.getStorageSync('fyuid')
    var myurl = url + "&myuserid=" + wx.getStorageSync('fyuid')

    
    var params = []
    utils.setloading()
    utils.getData(myurl, params, function (res) {
      utils.hidemyloading()
      if (res.data.code != 200) {
        utils.myshowmodel(res.data.error_title, res.data.error_message)
        
        return 0
      } else {
        if (httype == 0){
          that.gethts()
        }else{
          that.gethothts()
        }
      }
    })
  },

  /**
   * 普通话题点赞
   */
  setgoods: function(res){

    /**
     * 先判断是否授权
     * 授权了直接请求数据
     * 未授权则弹出提示框
     */
    
    wx.login({
      success:function(res){
        console.log(res)
      }
    })
    var htid = res.currentTarget.dataset.htid
    var url = config.service.requesturl + "index/ht_setgoods?htid=" + htid

    // 点赞请求
    this.goods(url,0)

  },
  /**
   * 热点话题点赞
   */
  hothtsetgoods:function(res){
    var htid = res.currentTarget.dataset.htid
    var url = config.service.requesturl + "index/ht_setgoods?htid=" + htid
    this.goods(url,1)
  },
  /**
   * 热点话题分享
   */
  hothtsetshare:function(res){
   
  },
  /**
   * 点击热点话题
   */
  taphotlist:function(){
    var htid = this.data.currentdata.htid

    this.goto(htid)
  },
  
  /**
   * 点击跳转详情页面
   */
  taplist: function(event){
    var htid = event.currentTarget.dataset.htid
    this.goto(htid)
  },

  /**
   * goto
   */
  goto:function(htid){
    let id = htid
    var url = "/pages/fylist/fydetail/fydetail?htid=" + id
    wx.navigateTo({
      url: url,
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
   * 
   * 下拉刷新
   */
  onPullDownRefresh: function () {

    var that = this
    var fyuid = wx.getStorageSync('fyuid')
    
    var myurl = config.service.requesturl + "index/gethtlist?userid=" + fyuid
    
    // 页数+1
    wx.request({
      url: myurl,
      method: "GET",
      // 请求头部
      success: function (res) {
        wx.stopPullDownRefresh()
        
        if (res.data.code != 200) {
          wx.showModal({
            title: '哦哦，出错了',
            content: '请重试！',
          })
          return 0
        }
        utils.showsuccess('加载成功 !')
        // 设置数据
        that.setData({
          htlist: res.data.content
        })
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   * 
   * 加载更多
   */
  onReachBottom: function () {
    var that = this;

    console.log(222)
    var fyuid = wx.getStorageSync('fyuid')
    var mypage = this.data.currentpage + 1
    var myurl = config.service.requesturl + "index/gethtlist?userid=" + fyuid + "&page=" + mypage
    // 显示加载图标
    wx.showLoading({
      title: '加载更多中...',
    })
    // 页数+1
    wx.request({
      url: myurl,
      method: "GET",
      // 请求头部
      success: function (res) {
        wx.hideLoading()
        if(res.data.code != 200){
          return 0
        }
        // 设置数据
        that.setData({
          htlist: res.data.content
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.currentdata['htcontent']
    var url = '/pages/home/home'
    return {
      title: title,
      path: url
    }
  }
})