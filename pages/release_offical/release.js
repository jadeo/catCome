// release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd:'',
    status:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // console.log(options)
    // var status = options.status;
    this.setData({
      // status: status,
    })
    // console.log(status)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //关闭发送
  close:function(){
    wx.redirectTo({
      url:'../index/index'
    })
  },
  //发布喵圈
  relese_circle:function(){
    wx.redirectTo({
      url: '../relese_circle/relese_circle',
    })
  },
  //发布喵问
  relese_question:function(){
    wx.redirectTo({
      url: '../relese_question/relese_question',
    })
  },
  //发布官方
  relese_offical:function(){
    wx.redirectTo({
      url: '../relese_offical/relese_offical',
    })
  },
})
