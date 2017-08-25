
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({
  data: {
    navbar: ['喵圈', '喵问'],
    session3rd: '',
    currentNavbar: '0',
    scrollTop: 0,
    circleList:[],
    questionList:[],
    scrollHeight: 0,    //scroll-view 的高度
    loadingmore: true,   //没有更多帖子了
    start: 0,
    circlestart:0,
    questionstart:0,
    circleisfirst:true,
    questionisfirst:true,
    uid:null,
    other:'',
  },
  onLoad: function (options) {
    var that = this
    var uid = options.id;
    var start=this.data.start;
    // 加载
    wx.showToast({
      icon: 'loading',
      duration: 1000,
    });
    wx.getStorage({
      key: 'session',
      success: function (res) {

        that.setData({
          session3rd: res.data,
          uid:uid,
        })
        requsetCircleList.call(that)
      },
      fail:function(){
          console.log('没有session3rd')
      },
    })
  },
  //onload结束

  // 监听页面显示
  onShow: function () {
    var that = this;
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (res.windowWidth / 750) // rpx转px 屏幕宽度/750
        });
      }
    })

  },

  // 跳转喵圈详情页
  goDetail: function (e) {
    // console.log(e);
    var detailId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../circle_detail/circle_detail?id=' + detailId,
    })

  },
  // 跳转喵问详情
  qustionClick: function (e) {
    var qustionId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../question_detail/question_detail?id=' + qustionId,
    })
  },
  // 上拉加载
  scrollLowerEvent: function (e) {
    //  console.log(e)
    var that = this;
    var curIndex = e.currentTarget.dataset.index;
    if (curIndex == 0) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      requsetCircleList.call(that);
    };
    if (curIndex == 1) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      requsetQuestionList.call(that);
    };
  },
  //下拉刷新
  // onPullDownRefresh: function () {
  //   var that = this;
  //   requests.requsetCircleList(
  //     {}, (data) => {
  //       console.log(data)
  //       setTimeout(function () {
  //         wx.hideToast()
  //       }, 1000)
  //       that.setData({
  //         circleList: data
  //       })
  //     }, () => {
  //       //请求失败
  //     }, () => {
  //       //请求完成
  //       wx.stopPullDownRefresh() //停止下拉刷新
  //     }
  //   )

  // },

  
  // 喵圈点赞
  circleHeart: function (e) {
    var that = this;
    console.log(e)
    var circleList = this.data.circleList;           //获取喵圈数据
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var currentIndex = e.currentTarget.dataset.index;   //当前帖子下标
    var doo = '';    //点赞参数
    var heart_num = parseFloat(circleList[currentIndex].heart_num);
    if (!circleList[currentIndex].isheart) {
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
              ['circleList[' + currentIndex + '].isheart']: true,
              ['circleList[' + currentIndex + '].heart_num']: (heart_num + 1)
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
              ['circleList[' + currentIndex + '].isheart']: false,
              ['circleList[' + currentIndex + '].heart_num']: (heart_num - 1)
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
  // 喵圈收藏
  circleCollect: function (e) {
    var that = this;
    console.log(e)
    var circleList = this.data.circleList;           //获取喵圈数据
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var currentIndex = e.currentTarget.dataset.index;   //当前帖子下标
    var doo = '';    //点赞参数
    if (!circleList[currentIndex].iscollect) {
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
              ['circleList[' + currentIndex + '].iscollect']: true,
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
              ['circleList[' + currentIndex + '].iscollect']: false,
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
  // 喵圈评论
  circleComment: function (e) {
    var curId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../circle_detail/circle_detail?id=' + curId,
    })
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '猫来了的喵星球',
      path: '/pages/index/index'
    }
  },

  /**
   * 切换 navbar
   */
  swichNav(e) {
    var that = this;
    var circleisfirst = this.data.circleisfirst;
    var questionisfirst = this.data.questionisfirst;
    var session3rd = this.data.session3rd;
    var questionstart = this.data.questionstart;
    var uid = this.data.uid;
    console.log(e);
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    });
    if (e.currentTarget.dataset.idx == 0) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      if (circleisfirst == true) {
        requests.requestMyCenter({
          session3rd: session3rd,
        }, (data) => {
          console.log(data)
          that.setData({
            otherdata: data,
          })
        }, (data) => {

        }, (data) => {

        })
        that.setData({
          circleisfirst: false,
        })
      } else {
        return;
      }
    } else if (e.currentTarget.dataset.idx == 1) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      if (questionisfirst == true) {
        requests.requestOtherProblem({
          session3rd: session3rd,
          start: questionstart,
          uid: uid,
        }, (data) => {
          console.log(data)
          that.setData({
            questionList:data.pro,
          })
        }, (data) => {

        }, (data) => {

        })
        that.setData({
          questionisfirst: false,
        })
      } else {
        return;
      }
    }
  },
})

// 请求喵圈数据
function requsetCircleList() {
  var that = this;
  var circleList = this.data.circleList;
  var start = this.data.start;
  var circlestart=this.data.circlestart;
  var uid=this.data.uid;
  console.log('开始请求喵圈数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestOtherCircle(
        {
          session3rd: session3rd,
          start: circlestart,
          uid:uid,
        },
        function (res) {   //请求成功回调
          console.log(res)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res.diary) {
            that.setData({
              other:res.fans,
              circleList: circleList.concat(res.diary),
              circlestart: circlestart+1,
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
// 请求喵问数据
function requsetQuestionList() {
  var that = this;
  var questionList = this.data.questionList;
  var start = this.data.start;
  var questionstart=this.data.questionstart;
  var uid=this.data.uid;
  console.log('开始请求喵问数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestOtherProblem(
        {
          session3rd: session3rd,
          start: questionstart,
          uid:uid,
        },
        function (res) {   //请求成功回调
          // console.log(res)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res.pro) {
            that.setData({
              questionList:questionList.concat(res.pro),
              questionstart: questionstart+1,
            })
          } else {
            // console.log('没有更多帖子')
            // utils.showModal('提示','没有更多帖子',false);
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

//登录
function wxLogin(func) {
  // console.log(this)
  //调用登录接口
  //1.小程序调用wx.login得到code.
  var _this = this;
  wx.login({
    success: function (res) {
      var code = res['code'];
      //2.小程序调用wx.getUserInfo得到rawData, signatrue, encryptData.
      wx.getUserInfo({
        success: function (info) {
          // console.log(info);
          var rawData = info['rawData'];
          var signature = info['signature'];
          var encryptData = info['encryptData'];
          var encryptedData = info['encryptedData']; //注意是encryptedData不是encryptData...坑啊
          var iv = info['iv'];

          //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
          wx.request({
            url: 'https://mll.sutuv.com/index.php?s=/addon/Fans/Fans/login',
            data: {
              "code": code,
              "rawData": rawData,
              "signature": signature,
              // "encryptData": encryptData,
              'iv': iv,
              'encryptedData': encryptedData
            },
            success: function (res) {
              // console.log(res)
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              } else {
                var session = res.data.session3rd;
                // console.log(res)
                _this.setData({
                  session3rd: session
                })
                wx.setStorage({    //session3rd存入微信缓存
                  key: "session",
                  data: session,
                  success: function () {
                   
                  }
                })
              }
              typeof func == "function" && func(res.data);
            }
          });
        }
      });
    }
  });
}