
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({
  data: {
    navbar: ['喵圈', '喵问'],
    session3rd: '',
    currentNavbar: '0',
    fans:'',            //头像信息
    circleList: [],     //喵圈列表
    questionList: [],   //喵问数据
    scrollTop: 0,
    scrollHeight: 0,    //scroll-view 的高度
    loadingmore: true,   //没有更多帖子了
    circlestart: 0,
    questionstart:0,
    start:0,
    loadingmore: true,
    circleisfirst: true,    //喵圈是否是第一次加载
    questionisfirst: true,  //喵问是否是是第一次加载
  },
  onLoad() {
    var that = this;
    var fans=this.data.fans;
    var start=this.data.start;
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
            wx.getStorage({
              key: 'session',
              success: function (res) {
                // console.log(res.data)
                var session3rd = res.data;
                requests.requestMyCircleRelease(
                  {
                    session3rd: session3rd,
                    start: start,
                  },
                  function (res) {   //请求成功回调
                    setTimeout(function () {
                      wx.hideToast()
                    }, 500)
                    if (res) {
                      console.log(res)
                      that.setData({
                        fans: res.fans,
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

  //喵圈删除
  del_circle: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var session3rd = this.data.session3rd;
    var newcircleList = this.data.circleList;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          requests.requestCircleDel({
          session3rd: session3rd,
          id: id,
         }, (data) => {
        newcircleList.splice(index, 1)
        that.setData({
        circleList: newcircleList,
        })
      }, (data) => {
        console.log('失败')
      }, (data) => {
        console.log('完成')
      })
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },


  //喵问删除
  del_question:function(e){
     var that=this;
     var id=e.currentTarget.dataset.id;
     var index = e.currentTarget.dataset.index;
     var session3rd=this.data.session3rd;
     var newquestionList=this.data.questionList;
     wx.showModal({
       title: '提示',
       content: '确认删除吗',
       success: function (res) {
         if (res.confirm) {
           requests.requestQuestionDel({
             session3rd: session3rd,
             id: id,
           }, (data) => {
             newquestionList.splice(index, 1)
             that.setData({
               questionList: newquestionList,
             })
           }, (data) => {
             console.log('失败')
           }, (data) => {
             console.log('完成')
           })
         } else {
           console.log('用户点击取消')
         }

       }
     })
     

  },

  // 跳转晒图详情页
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
    var that=this;
    var curIndex = e.currentTarget.dataset.index;
    console.log(curIndex)
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
    var fans=this.data.fans;
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
        requests.requestMyCircleRelease({
          session3rd: session3rd,
        }, (data) => {
          that.setData({
            circleList: data.diary,
            fans:data.fans,
          })
          console.log(data)
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
        requests.requestMyQuestionRelease({
          session3rd: session3rd,
        }, (data) => {
          console.log(data)
          that.setData({
            questionList: data.pro,
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
// 请求我的发布喵圈数据
function requsetCircleList() {
  var that = this;
  var circleList = this.data.circleList;
  var start = this.data.start;
  var fans=this.data.fans;
  var circlestart = this.data.circlestart;
  console.log('开始请求喵圈数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestMyCircleRelease(
        {
          session3rd: session3rd,
          start: circlestart,
        },
        function (res) {   //请求成功回调
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res.diary) {
            console.log(res)
            that.setData({
              circleList: circleList.concat(res.diary),
              fans:res.fans,
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
// 请求我的发布喵问数据
function requsetQuestionList() {
  var that = this;
  var questionList = this.data.questionList;
  var start = this.data.start;
  var questionstart=this.data.questionstart;
  console.log('开始请求喵问数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestMyQuestionRelease(
        {
          session3rd: session3rd,
          start: questionstart,
        },
        function (res) {   //请求成功回调
          console.log(res)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res.pro) {
            that.setData({
              questionList: questionList.concat(res.pro),
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
                    // requsetShowList.call(_this);       //请求第一页帖子列表数据
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