// pages/ssfy/ssfy.js
const utils = require("../../utils/util.js")
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
    word:"'吃鸡'",
    mycomment:'',
    comments:[
      {
        nickname:"后米米米米",
        gender:1,
        language:"zh_CN",
        city:"成都",
        province:"四川",
            avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment:"湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      },
      {
        nickname: "后米米米米",
        gender: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/tWs2GslLYqfak7x0AWVrhOicoJrngKjR7G7pmRCDuE63zjRNibDptIWyLJnlPYiaMicVONEKFx0wPZFbdcSuP1evkQ/132",
        comment: "湖南话 期鸡"
      }
    ]
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
    this.initImageAndTextWidth()

    wx.login({
      success:function(res){
        console.log(res)
      }
    })
  },

  /**
   * 初始化text和图片大小
   */
  initImageAndTextWidth:function(){
    var vw = wx.getSystemInfoSync().windowWidth
    var sH = wx.getSystemInfoSync().windowHeight
    wx.getSystemInfoSync().screenHeight
    this.setData({
      vw: vw,
      textw:vw-10,
      inputw: vw - 130,
      scrollH: sH - 320
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
    // 先判断mycomment是否为空,若为空则跳出当前方法
    var mycomment = this.data.mycomment
    var strlen = utils.isempty(mycomment)

    if (strlen == 0){
      utils.showmymodel('评论失败','评论内容不能为空！')
      return
    }

    // 评论内容不为空时执行以下代码
    var useri = wx.getStorageSync('userInfo')
    var params = []

    params['avatarurl'] = useri.avatarUrl
    params['nickname'] = useri.nickName
    params['comment'] = mycomment

    // 其次带上当前user信息进行POST请求
    utils.post('http://localhost/ssfy/z',params,function(res){
      console.log('hhh')
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