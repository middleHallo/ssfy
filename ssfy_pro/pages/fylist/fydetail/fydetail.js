// pages/fylist/fydetail/fydetail.js
const utils = require("../../../utils/util.js")
const config = require("../../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    htid:'',
    detail:{},
    page:1,
    totalpage:1,
    comments:[],
    scrollHeight:603,
    /**
     * 评论内容
     */
    mycomment:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      htid:options.htid
    })
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

    // 获取详细信息
    this.getdetail()
    this.initConfig()
    this.getmoreComments()
  },

  /**
   * 监听scrollview的触底事件
   */
  tolowser:function(){
    console.log('触底了');

    var mypage = this.data.page
    var total = this.data.totalpage
    if (mypage < total){
        this.setData({
          page: mypage + 1
        })
        this.getmoreComments()

        return 0
    }

    wx.showToast({
      title: '已无更多评论!',
      icon:'success'
    })

    
  },

  /**
   * 初始化配置信息
   */
  initConfig:function(){
    let scrollh = wx.getSystemInfoSync().windowHeight - 50

    this.setData({
      scrollHeight: scrollh
    })
  },

  /**
   * 话题点赞
   */
  goodcomment:function(event){
    var isAuth = wx.getStorageSync('isAuth')
    if (isAuth == false) {
      wx.navigateTo({
        url: '../../fytips/fytips',
      })
      return -1;
    }
    let that = this
    /**
     * 用于定位当前评论位置
     */
    var idx = event.currentTarget.dataset.idx
    /**
     * 获取所有评论，用于动态修改评论内容
     */
    var allcomments = this.data.comments
    /**
     * 当前选中的评论
     */
    var selectedcomments = allcomments[idx]
    /**
     * 获取点赞数
     */
    var goods = selectedcomments.goods + 1
    

     var commentid = event.currentTarget.dataset.commentid
     var fyuid = wx.getStorageSync('fyuid')
     var url = config.service.requesturl + "index/comment_setgoods?commentid=" + commentid + "&userid=" + fyuid

     console.log(url)
     var params = []
     utils.getData(url, params, function (res) {
       wx.hideLoading()
       let data = res.data

       // 如果重复点赞，则不刷新评论
       if (data.code != 200) {
         utils.myshowmodel(data.error_title, data.error_message)

         return 0
       }
      wx.showToast({
        title: '点赞成功!',
        icon:'success'
      })

      selectedcomments.fyuid = fyuid
      selectedcomments.goods = goods
      allcomments[idx] = selectedcomments
       that.setData({
         page:1,
         comments: allcomments
       })

     })
  },

  /**
   * 获取话题的详细信息
   */
  getdetail:function(){

    wx.showLoading({
      title: '加载中...',
    })
    var fyuid = wx.getStorageSync('fyuid')
    var htid = this.data.htid
    var url = config.service.requesturl + "index/getdetail?htid=" + htid + "&userid=" + fyuid
    var params = []
    var that = this
    utils.getData(url,params,function(res){
        wx.hideLoading()
        let data = res.data
        if (data.code != 200){
          utils.myshowmodel(data.error_title, data.error_message)
        }

        console.log('评论是=====')
        console.log(res.data)

        that.setData({
          detail:data.content
        })

    })
  },

  /**
   * 获取评论信息
   */
  getmoreComments:function(){
    
    var htid = this.data.htid
    var page = this.data.page
    var userid = wx.getStorageSync('fyuid')
    var url = config.service.requesturl + "index/getmorecomments?htid=" + htid + "&page=" + page + "&userid=" + userid

    var params = []
    var that = this
    var mycomments = this.data.comments
    utils.getData(url, params, function (res) {
      
      let data = res.data
      if (data.code != 200) {
        utils.myshowmodel(data.error_title, data.error_message)
      }

      console.log(data)

      var newcomments = mycomments.concat(data.contents);

      that.setData({
        comments: newcomments,
        totalpage: data.totalpage,
        page: data.currentpage
      })

    })
  },

  /**
   * 监听输入框输入及删除事件
   */
  inputcomment: function (e) {
    this.setData({
      mycomment: e.detail.value
    })
  },
  /**
   * 提交评论
   */
  say: function () {
    var isAuth = wx.getStorageSync('isAuth')
    if (isAuth == false) {
      wx.navigateTo({
        url: '../../fytips/fytips',
      })
      return -1;
    }
    var fyuid = wx.getStorageSync('fyuid')

    // 先判断mycomment是否为空,若为空则跳出当前方法
    var mycomment = this.data.mycomment
    var strlen = utils.isempty(mycomment)

    if (strlen == 0) {
      utils.myshowmodel('评论失败', '评论内容不能为空！')
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
    var that = this
    utils.post(url, params, function (res) {

      console.log(res)
      if(res.data.code != 200){
        utils.myshowmodel(res.data.error_title, res.data.error_message)
        return -1
      }

      that.setData({
        mycomment: "",
        comments:[]
      })

      that.getmoreComments()
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