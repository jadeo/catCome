// my_news.js
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
        newsList:[],
        start:0,
        loadingmore:true,
        status:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var start=this.data.start;
     //从缓存中取出  session3rd，并·请求数据
    wx.getStorage({        //从缓存中取出  session3rd
      key: 'session',
      success: function (res) {
        console.log(res.data)
        that.setData({
          session3rd: res.data
        })
        
        requestMyNews.call(that);

      }
    })
  },
  // onload结束

  //跳转到个人主页
  go_somebody: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../other/other?id=' + uid,
    })
  },
  
  //上拉加载
  scrollLowerEvent: function (e) {
    var that=this;
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      requestMyNews.call(that)
    
  },

  // 喵圈点赞
  diary_heart:function(e){
      var that=this;
      var id=e.currentTarget.dataset.id;
      var status = e.currentTarget.dataset.status;
      if (status==0){
        wx.showToast({
          title: '对不起，帖子已删除',
          image:'../../images/wrong.png'
        })
      }else{
        wx.navigateTo({
          url: '../circle_detail/circle_detail?id=' + id,
        })
      }
  },
  // 喵圈帖子收藏
  diary_collect: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    if (status==0){
      wx.showToast({
        title: '对不起，帖子已删除',
        image: '../../images/wrong.png'
      })
    }else{
      wx.navigateTo({
        url: '../circle_detail/circle_detail?id=' + id,
      })
    }
   
  },
  // 赞了你的评论
  rever_heart: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    if (status==0){
      wx.showToast({
        title: '对不起，帖子已删除',
        image: '../../images/wrong.png'
      })
    }else{
      wx.navigateTo({
        url: '../circle_detail/circle_detail?id=' + id,
      })
    }
  },
  // 喵圈帖子评论回复
  rever: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var dstatus = e.currentTarget.dataset.dstatus;  //喵圈状态
    var rstatus = e.currentTarget.dataset.rstatus;  //评论状态
    if (dstatus==0){
      wx.showToast({
        title: '对不起，帖子已删除',
        image: '../../images/wrong.png'
      })
    }
    if (rstatus == 0) {
      wx.showToast({
        title: '对不起，评论已删除',
        image: '../../images/wrong.png'
      })
    }
    if (dstatus > 0 && rstatus > 0){
      wx.navigateTo({
        url: '../circle_detail/circle_detail?id=' + id,
      })
    }
  },
  // 喵圈帖子评论
  diary_rever: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var dstatus = e.currentTarget.dataset.dstatus;  //喵圈状态
    var rstatus = e.currentTarget.dataset.rstatus;  //评论状态
    if(dstatus==0){
      wx.showToast({
        title: '对不起，帖子已删除',
        image: '../../images/wrong.png'
      })
    }
    if (rstatus==0){
      wx.showToast({
        title: '对不起，评论已删除',
        image: '../../images/wrong.png'
      })
    }
    if (dstatus>0&&rstatus>0){
      wx.navigateTo({
        url: '../circle_detail/circle_detail?id=' + id,
      })
    }
    
  },
  // 回答点赞
  answer_heart: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var astatus = e.currentTarget.dataset.astatus;
    var pstatus = e.currentTarget.dataset.pstatus;
    if (astatus==0){
      wx.showToast({
        title: '对不起，答案已删除',
        image: '../../images/wrong.png'
      })
    }
    if (pstatus==0){
      wx.showToast({
        title: '对不起，喵问已删除',
        image: '../../images/wrong.png'
      })
    }
    if (astatus > 0 && pstatus > 0){
      wx.navigateTo({
        url: '../answer_detail/answer_detail?aid=' + uid + '&&qid=' + id,
      })
    }
    
  },
  // 回答收藏
  answer_collect: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var astatus = e.currentTarget.dataset.astatus;
    var pstatus = e.currentTarget.dataset.pstatus;
    if (astatus == 0) {
      wx.showToast({
        title: '对不起，回答已删除',
        image: '../../images/wrong.png'
      })
    }
    if (pstatus == 0) {
      wx.showToast({
        title: '对不起，喵问已删除',
        image: '../../images/wrong.png'
      })
    }
    if (astatus > 0 && pstatus > 0) {
      wx.navigateTo({
        url: '../answer_detail/answer_detail?aid=' + uid + '&&qid=' + id,
      })
    }

  },
  // 喵问回答,跳转到回答详情
  answer: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var astatus = e.currentTarget.dataset.astatus;
    var pstatus = e.currentTarget.dataset.pstatus;
    if (astatus==0){
         wx.showToast({
           title: '对不起，答案已删除',
           image: '../../images/wrong.png'
         })
    }
    if (pstatus==0){
      wx.showToast({
        title: '对不起，喵问已删除',
        image: '../../images/wrong.png'
      })
    }
    if (astatus > 0 && pstatus > 0){
      wx.navigateTo({
      url: "../answer_detail/answer_detail?aid=" + uid + '&&qid=' + id,
    })
    }
  },
})

function requestMyNews() {
  var that = this;
  var newsList = this.data.newsList;
  var start = this.data.start;
  var status=this.data.status;
  wx.getStorage({
    key: 'session',
    success: function (res) {
      var session3rd = res.data;
      requests.requestMyMessage(
        {
          session3rd: session3rd,
          start: start,
        },
        function (res) {   //请求成功回调
          console.log(res)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res) {
            that.setData({
              newsList: newsList.concat(res),
              start: start +1,
            })
            console.log(that.data.status)
          } else {
            // console.log('没有更多帖子')
            // utils.showModal('提示','没有更多帖子',false);
            that.setData({
              loadingmore: false
            })
            console.log(loadingmore)
          }
        }, function () {    //请求失败
          console.log('请求失败')
        }, function () {    //请求完成

        }
      )
    }
  })

}