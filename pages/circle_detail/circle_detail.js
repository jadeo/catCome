// circle_detail.js
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({
  data:{
      session3rd:'',
      pageId:'',
      detailList:[],
      reverseList:[],
  },
  onLoad: function (options) {
      var that=this;
      // console.log(options)
      var curId=options.id;
      that.setData({
        pageId:curId,
      })
      // 取得缓存中的session
      wx.getStorage({
        key:'session',
        success:function(res){
          that.setData({
            session3rd:res.data,
          })
          requests.requestCircleDetail({
            session3rd:res.data,
            id:curId,
          },(data) => {
            console.log(data)
              that.setData({
                detailList:data,
                reverseList: data.reverse,
              })
          })
        },
        fail:function(){
            console.log('没有session3rd')
        }
      })
  },
  // onload结束
  onShow: function () {
    var that = this;
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (res.windowWidth / 750) // rpx转px 屏幕宽度/750
        });
        // requsetShowList.call(that)
      }
    })
  },
  //预览帖子图片
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
  // 评论点赞
  detailLike: function (e) {
    var that = this;
    var reverseList = this.data.reverseList;           //评论列表
    console.log(reverseList)
    var to_uid = e.currentTarget.dataset.did;        //用户发帖id  被赞者id
    console.log(to_uid)
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var currentIndex = e.currentTarget.dataset.index;   //当前帖子下标
    var doo = '';    //点赞参数
    var heart_num = parseFloat(reverseList[currentIndex].heart_num);
    
    if (!reverseList[currentIndex].isheart) {
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
            type: 'reverse',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['reverseList[' + currentIndex + '].isheart']: true,
              ['reverseList[' + currentIndex + '].heart_num']: (heart_num + 1)
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
            type: 'reverse',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['reverseList[' + currentIndex + '].isheart']: false,
              ['reverseList[' + currentIndex + '].heart_num']: (heart_num - 1)
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

  // 帖子点赞
  answerLike: function (e) {
    var that = this;
    var detailList = this.data.detailList;           //获取喵圈数据
    console.log(detailList)
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var doo = '';    //点赞参数
    var heart_num = parseFloat(detailList.heart_num);

    if (!detailList.isheart) {
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
            type: 'diary',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['detailList.isheart']: true,
              ['detailList.heart_num']: (heart_num + 1)
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
            type: 'diary',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['detailList.isheart']: false,
              ['detailList.heart_num']: (heart_num - 1)
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
  // 帖子收藏
  answerCollect: function (e) {
    var that = this;
    var detailList = this.data.detailList;           //获取喵圈数据
    console.log(detailList)
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var doo = '';    //点赞参数
    if (!detailList.iscollect) {
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
            type: 'diary',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['detailList.iscollect']: true,
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
            type: 'diary',
            to_uid: to_uid,
            do: doo,
          }, (data) => {
            console.log(data)
            that.setData({
              ['detailList.iscollect']: false,
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


  // 评论
  comment:function(e){
    var uid = e.currentTarget.dataset.uid  //被评论者id
    var id = e.currentTarget.dataset.id  //喵圈帖子id
    wx.redirectTo({
      url: '../circle_comment/circle_comment?uid=' + uid + '&&id=' + id,
    })

  },
  //回复评论
  reply_comment:function(e){
    console.log(e)
    var uid = e.currentTarget.dataset.uid  //被评论者id
    var id = e.currentTarget.dataset.id  //喵圈帖子id
    var name = e.currentTarget.dataset.name;
    wx.redirectTo({
      url: '../circle_reply_comment/circle_reply_comment?uid=' + uid + '&id=' + id + '&name='+ name,
    })
  },
  // 分享
  onShareAppMessage: function () {
    var id = this.data.pageId;
    console.log(id);
    return {
      title: '猫来了',
      path: '/pages/detail/detail?id=' + id
    }
  },

  //跳转到个人主页
  go_somebody:function(e){
    var uid = e.currentTarget.dataset.uid;
    wx.redirectTo({
      url: '../other/other?id='+uid,
    })
  },
})
