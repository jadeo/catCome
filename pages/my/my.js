// mine.js
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd:'',
    mydata:{},
    msg:'',
    userstatus:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 取得缓存中的session
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        requsetMy.call(that);
      }
    })
  },
  //监听页面显示
  onShow: function () {        //监听页面显示
    var that = this;
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (res.windowWidth / 750) // rpx转px 屏幕宽度/750
        });
      }
    })
    console.log('监听mmm')
    requsetMy.call(that);
  },
  //去主页
  goIndex:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 我的消息
  myNews:function(e){
    wx.navigateTo({
      url: '../my_news/my_news',
    })
  },
  // 我的回答
  myAnswer: function (e) {
    wx.navigateTo({
      url: '../my_answer/my_answer',
    })
  },
  // 我的收藏
  mySave: function (e) {
    wx.navigateTo({
      url: '../my_save/my_save',
    })
  },
  // 我的发布
  myIssue: function (e) {
    wx.navigateTo({
      url: '../my_issue/my_issue',
    })
  },
  //关于我们
 myAbout:function(){
    wx.navigateTo({
      url: '../about/about',
    })
 } ,

  //跳转发帖页
  go_relese: function (e) {
    console.log(e)
    var status = this.data.userstatus;
    var session3rd = this.data.session3rd;
    console.log(status)
    if (session3rd == '') {
      console.log('没有session3rd 你得登录')
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '对不起，你还没有授权登录！请授权获取信息后重新打开该小程序!',
        success: function (res) {
          if (res.confirm) {

            console.log('用户点击确定')
            //调用授权登录
            getLoginAgain();

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      console.log('有session3rd 判断跳转')
      switch (status) {
        case '3':
          wx.navigateTo({
            url: '../release_offical/release',
          })
          break;
        case '2':
          wx.navigateTo({
            url: '../release/release',
          })
          break;
        case '1':
          wx.navigateTo({
            url: '../release/release',
          })
          break;
      }
    }

  },
})
//请求我的数据
function requsetMy() {
  var that = this;
  var mydata = this.data.mydata;
  // console.log('开始请求喵问详情数据')
  wx.getStorage({
    key: 'session',
    success: function (res) {
      console.log(res.data)
      var session3rd = res.data;
      requests.requestMy(
        {
          session3rd: session3rd,
        },
        function (res) {   //请求成功回调
          console.log(res)
          // console.log(circleList)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res) {
            console.log(res)
            that.setData({
              mydata: res,
              userstatus: res.userstatus,
            })
          } else {
            that.setData({
              loadingmore: false
            })
          }
        }, function () {    //请求失败
          // console.log('请求失败')
        }, function () {    //请求完成

        }
      )
    }
  })
}
