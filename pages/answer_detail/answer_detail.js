// answer_detail.js
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
       sesseion3rd:'',
       answerDetail:'',
       qid:'',
       aid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var qid=options.qid;
    var aid=options.aid;
    // 取得缓存中的session
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
          qid:qid,
          aid:aid,
        })
        requests.requestAnswerDetail({
          session3rd: res.data,       //用户标识
          problem_id: qid,             //问题id
          answer_id: aid,              //答案id
        }, (data) => {
          console.log(data)
          that.setData({
            answerDetail: data
          }, () => {
            console.log('请求失败')
          }, () => {
            // console.log('请求完成')
          })
        })
      }
    })
  },
  //onload结束
  
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
  //跳转到个人主页
  go_somebody: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.redirectTo({
      url: '../other/other?id=' + uid,
    })
  },
  //下拉刷新
  // onPullDownRefresh: function () {
    
  //   wx.stopPullDownRefresh()
  // },

  // 分享
  onShareAppMessage: function () {
    var id = this.data.pageId;
    var acurId = this.data.aid;
    var qcurId = this.data.qid;
    console.log(acurId)
    return {
      title: '猫来了',
      path: '/pages/answer_detail/answer_detail?aid=' + acurId + '&qid=' + qcurId,
    }
  },

  // 点击点赞
  heart: function (e) {
    var that = this;
    var answerDetail = this.data.answerDetail;           //获取晒图数据
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var currentIndex = e.currentTarget.dataset.index;   //当前答案下标
    var doo = '';    //点赞参数
    var heart_num = parseFloat(answerDetail.answer.heart_num);
    if (!answerDetail.answer.isheart) {
      doo = 'add';
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data
          })
          var sesssion3rd = res.data
          requests.requestCircleDianzan({
            session3rd: sesssion3rd,
            cont_id: cont_id,
            type: 'problemanswer',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['answerDetail.answer.isheart']: true,
              ['answerDetail.answer.heart_num']: (heart_num + 1)
            })
          }, () => {
            // 请求失败
          }, () => {
            // 请求完成
          },
          )
        }
      })
    } else {
      doo = 'del';
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data
          })
          var sesssion3rd = res.data
          requests.requestCircleDianzan({
            session3rd: sesssion3rd,
            cont_id: cont_id,
            type: 'problemanswer',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['answerDetail.answer.isheart']: false,
              ['answerDetail.answer.heart_num']: (heart_num - 1)
            })
          }, () => {
            // 请求失败
          }, () => {
            // 请求完成
          },
          )
        }
      })
    }
  },
  // 点击收藏
  collect: function (e) {
    var that = this;
    console.log(e)
    var answerDetail = this.data.answerDetail;           //获取喵圈数据
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var currentIndex = e.currentTarget.dataset.index;   //当前帖子下标
    var doo = '';    //点赞参数
    var collect_num = parseFloat(answerDetail.answer.collect_num);
    if (!answerDetail.answer.iscollect) {
      doo = 'add';
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data
          })
          var sesssion3rd = res.data
          requests.requestCircleCollect({
            session3rd: sesssion3rd,
            cont_id: cont_id,
            type: 'problemanswer',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['answerDetail.answer.iscollect']: true,
              ['answerDetail.answer.collect_num']: (collect_num + 1)
            })
          }, () => {
            // 请求失败
          }, () => {
            // 请求完成
          },
          )
        }
      })
    } else {
      doo = 'del';
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data
          })
          var sesssion3rd = res.data
          requests.requestCircleCollect({
            session3rd: sesssion3rd,
            cont_id: cont_id,
            type: 'problemanswer',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['answerDetail.answer.iscollect']: false,
              ['answerDetail.answer.collect_num']: (collect_num - 1)
            })
          }, () => {
            // 请求失败
          }, () => {
            // 请求完成
          },
          )
        }
      })
    }
  },
  // 点击分享
  share:function(){

  },

})