
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({
  data: {
    navbar: ['喵圈', '喵问'],
    session3rd: '',
    currentNavbar: '0',
    circleList: [],     //喵圈列表
    questionList: [],   //喵问数据
    address: '',
    scrollTop: 0,
    scrollHeight: 0,    //scroll-view 的高度
    loadingmore: true,   //没有更多帖子了
    start: 0,
    circlestart: 0,
    questionstart: 0,
    loadingmore: true,
    circleisfirst: true,    //喵圈是否是第一次加载
    questionisfirst: true,  //喵问是否是是第一次加载
    status:null,           //判断帖子是否删除
  },
  onLoad() {
    var that = this;
    // 加载
    wx.showToast({
      icon: 'loading',
      duration: 1000,
    });

    // 登录
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        wx.getStorage({   //如果缓存中有 session3rd 取出给data赋值
          key: 'session',
          success: function (res) {    //缓存中  有session3rd
            that.setData({
              session3rd: res.data
            })
          },
          fail: function () {    //如果缓存中  没有session3rd
            //请求 普通帖
            console.log('没有session3rd')
            wxLogin.call(that);
          }
        })
      },
      fail: function () {
        //登录态过期
        wxLogin.call(that); //重新登录
      }
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
        requsetCircleList.call(that)
      }
    })

  },
  //跳转到个人主页
  go_somebody: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.redirectTo({
      url: '../other/other?id=' + uid,
    })
  },

  // 跳转晒图详情页
  goDetail: function (e) {
    // console.log(e);
    var detailId = e.currentTarget.dataset.id;
    var status  = e.currentTarget.dataset.status;
    console.log(status)
    if (!status==1){
        wx.showModal({
          title: '提示',
          content: '抱歉，您浏览的帖子已经删除',
        })
    }
    else{
      wx.navigateTo({
        url: '../circle_detail/circle_detail?id=' + detailId,
      })
    }
  },
  // 跳转回答详情
  qustionClick: function (e) {
    var qustionId = e.currentTarget.dataset.pid;
    var answerId = e.currentTarget.dataset.aid;
    var astatus = e.currentTarget.dataset.astatus;
    var pstatus = e.currentTarget.dataset.pstatus;
    if(astatus==0 || pstatus==0){
      wx.showToast({
        title: '对不起，帖子已删除',
        image:'../../images/wrong.png'
      })
    }else{
      wx.navigateTo({
        url: "../answer_detail/answer_detail?aid=" + answerId + '&&qid=' + qustionId,
      })
    }
   
  },
  // 上拉加载
  scrollLowerEvent: function (e) {
    var that=this;
    var curIndex=e.currentTarget.dataset.index;
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

  //喵圈下拉刷新
  circlePullDownRefresh: function (e) {
    var that = this;
    console.log("喵圈下拉刷新....")
    requsetCircleList.call(that);
    wx.stopPullDownRefresh()
  },
//喵问下拉刷新
  quetionPullDownRefresh:function(){
    var that = this;
    console.log("喵问下拉刷新....")
    requsetQuestionList.call(that);
    wx.stopPullDownRefresh()
  },

  // // 晒图点赞
  imgHeart: function (e) {
    var that = this;
    var showList = this.data.showList;           //获取晒图数据
    var to_uid = e.currentTarget.dataset.uid;        //用户发帖id  被赞者id
    var cont_id = e.currentTarget.dataset.id;    //点赞内容id
    var currentIndex = e.currentTarget.dataset.index;   //当前帖子下标
    var doo = '';    //点赞参数
    var heart_num = parseFloat(showList[currentIndex].heart_num);
    if (!showList[currentIndex].isheart) {
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
              ['showList[' + currentIndex + '].isheart']: true,
              ['showList[' + currentIndex + '].heart_num']: (heart_num + 1)
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
              ['showList[' + currentIndex + '].isheart']: false,
              ['showList[' + currentIndex + '].heart_num']: (heart_num - 1)
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
        requests.requestMyCircleCollect({
          session3rd: session3rd,
        }, (data) => {
          that.setData({
            circleList: data,
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
        requests.requestMyProblemCollect({
          session3rd: session3rd,
        }, (data) => {
          console.log(data)
          that.setData({
            questionList: data,
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
  //点击头像进入别人的主页
  go_somebody: function (e) {
    console.log(e)
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../other/other?id=' + uid,
    })
  },

})
// 请求我的收藏喵圈数据
function requsetCircleList() {
  var that = this;
  var circleList = this.data.circleList;
  var circlestart=this.data.circlestart;
  var start = this.data.start;
  console.log('开始请求喵圈数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestMyCircleCollect(
        {
          session3rd: session3rd,
          start: circlestart,
        },
        function (res) {   //请求成功回调
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res) {
            console.log(res)
            that.setData({
              circleList: circleList.concat(res),
              circlestart: circlestart + 1,
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
// 请求我的收藏喵问数据
function requsetQuestionList() {
  var that = this;
  var questionList = this.data.questionList;
  var questionstart = this.data.questionstart;
  var start = this.data.start;
  console.log('开始请求喵问数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestMyProblemCollect(
        {
          session3rd: session3rd,
          start: questionstart,
        },
        function (res) {   //请求成功回调
          console.log(res)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res) {
            that.setData({
              questionList: questionList.concat(res),
              questionstart: questionstart + 1,
            })
          } else {
            console.log('没有更多帖子')
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
                    // console.log(_this)
                    requsetShowList.call(_this);       //请求第一页帖子列表数据
                    // requsetQuestionList.call(_this);       //请求第一页帖子列表数据
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