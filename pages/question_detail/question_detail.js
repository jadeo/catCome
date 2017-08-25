// question_detail.js
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      session3rd:'',
      qustionDetail:'',
      answer:'',
      cardContent:'',
      title:'',
      questionId:'',
      isdisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var questionId=options.id;
    // var qustionDetail = this.data.qustionDetail;
    that.setData({
      questionId: questionId,
    })
    requsetQuestionDetail.call(that);
    wx.getStorage({
      key: 'session',
      success: function (res) {
        // console.log(res.data)
        var session3rd = res.data;
        that.setData({
          session3rd: session3rd,
        })
      
      }
    })
      
  },
  
  //onload结束

  // 监听页面显示
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
    requsetQuestionDetail.call(that);
  },
  //预览图片
  previewImage: function (e) {
    // console.log(e)
    var currentSrc = e.currentTarget.dataset.previewsrc;
    var previewImageArray = e.currentTarget.dataset.previewimgarray;
    var _this = this;
    wx.previewImage({
      current: currentSrc, // 当前显示图片的http链接
      urls: previewImageArray // 需要预览的图片http链接列表
    })
  },


  //跳转到回答详情
  go_answer_detail:function(e){
    console.log(e)
    var acurId = e.currentTarget.dataset.aid;
    var qcurId = e.currentTarget.dataset.qid;
      wx.navigateTo({
        url: "../answer_detail/answer_detail?aid=" + acurId + '&&qid=' + qcurId,
      })
  },
  //跳转到立即回答
  answer:function(e){
    console.log(e)
    var that=this;
    var pid = e.currentTarget.dataset.pid;
    var toid = e.currentTarget.dataset.toid;
    var is_problemanswer = e.currentTarget.dataset.ans;
    var isdisabled = this.data.isdisabled;
    var session3rd=this.data.session3rd;
    // var title=this.data.title;
    console.log(session3rd)
    requests.requestAnswer({
      session3rd: session3rd,
      id:pid,
    },(data) =>{
      console.log(data)
      that.setData({
        title:data.title,
      })
      if (is_problemanswer == true){
        wx.showModal({
          title: '提示',
          content: '您已回答过了，请勿重复回答',
        })
      }else{
        wx.redirectTo({
          url: "../question_huida/question_huida?pid=" + pid + '&&toid=' + toid + '&&title=' + this.data.title,
        })
      }
      
    },(data) =>{

    },(data) =>{

    })
  },
 
})

// 请求喵问详情数据
function requsetQuestionDetail() {
  var that = this;
  var qustionDetail = this.data.qustionDetail;
  var questionId = this.data.questionId;
  var answer=this.data.answer;
  console.log('开始请求喵问详情数据')
  wx.getStorage({
    key: 'session',
    success: function (res) {
      console.log(res.data)
      var session3rd = res.data;
      requests.requestQuestionDetail(
        {
          session3rd: session3rd,
          id: questionId,
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
              qustionDetail: res,
              answer: res.answer,
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
