
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({
  data: {
    ishshow:false,
    maskShow:false,
    navbar: ['晒图', '喵圈', '喵问'],
    session3rd: '',
    currentNavbar: 0,
    showList: [],       //晒图数据
    circleList: [],     //喵圈列表
    questionList: [],   //喵问数据
    address: '',
    scrollTop:0,
    scrollHeight:0,    //scroll-view 的高度
    loadingmore:true,   //没有更多帖子了
    start:0,
    circlestart:1,
    questionstart:1,
    loadingmore:true,
    circleisfirst:true,    //喵圈是否是第一次加载
    questionisfirst:true,  //喵问是否是是第一次加载
    miaoxingrenshow:true,  
    miaomourenshow:false,
    userstatus:null,
    isFrist:true,
    deslength:'',
  },
  onLoad(options) {
    console.log(options)
    var address=options.city;
    var that = this;
    var start = this.data.start;
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
          console.log(res.data)
            that.setData({
              session3rd: res.data,
              address:address,
            })  
            requests.requestShowDiary(
              {
                session3rd: res.data,
                start: start,
              },
              function (res) {   //请求成功回调
                console.log(res)
                setTimeout(function () {
                  wx.hideToast()
                }, 500)
                if (res) {
                  console.log(res)
                  that.setData({
                    showList: res.list,
                    userstatus: res.userstatus,
                    // start: start + 1,
                  })
                  // listenShowList.call(that);
                } else {
                  that.setData({
                    loadingmore: false
                  })
                }
              }, function () {    //请求失败
                console.log('请求失败')
                wxLogin.call(that);
              }, function () {    //请求完成

              }
            )   
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
  onShow: function () {        //监听页面显示
    var that = this;
    var questionisfirst = this.data.questionisfirst;
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (res.windowWidth / 750) // rpx转px 屏幕宽度/750
        });
      }
    })
      wx.getStorage({   //如果缓存中有 session3rd 取出给data赋值
         key: 'session',
        success: function (res) {    //缓存中  有session3rd
          console.log('onshow有session3rd')
          that.setData({
            session3rd: res.data
          })
          //请求 普通帖
          listenShowList.call(that);
          listenCircleList.call(that);
           listenQuestionList.call(that)
        },
        fail: function () {    //如果缓存中  没有session3rd
          //请求 普通帖
          console.log('没有session3rd')
          wxLogin.call(that);
        }
      })
  },
  //进入
  goIn:function(){
      var that=this;
      var maskShow = this.data.maskShow;
      that.setData({
        maskShow:false,
      })
  },

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

  //展现删除按钮
  showdel:function(e){
    console.log(e)
    var that=this;
    var dcurIndex=e.currentTarget.dataset.index;
    var circleList = this.data.circleList;
    var userstatus = this.data.userstatus;
    if (!circleList[dcurIndex].block && userstatus==3){
      that.setData({
        ['circleList[' + dcurIndex + '].block']: true,
        // ishshow:true
      })
    } else if (circleList[dcurIndex].block && userstatus == 3){
      that.setData({
        ['circleList[' + dcurIndex + '].block']: false,
      })
    } else if (userstatus !== 3){
       wx.showModal({
         title: '提示',
         content: '您不是管理员，暂时没有权限',
       })
    }
  },
 
  //删除帖子
  circleDel:function(e){
    console.log(e)
    var that=this;
    var dcurIndex = e.currentTarget.dataset.index;
    var session3rd=this.data.session3rd;
    var id = e.currentTarget.dataset.id;
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
            // 成功
            newcircleList.splice(dcurIndex, 1)
            that.setData({
              circleList: newcircleList
            })
          }, (data) => {
            //失败
            console.log('失败')
          }, (data) => {
            //完成
            console.log('完成')
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })
   
  },
  
  //喵圈帖子置顶
  circleTop:function(e){
    console.log(e)
    var that = this;
    var dcurIndex = e.currentTarget.dataset.index;
    var session3rd = this.data.session3rd;
    var id = e.currentTarget.dataset.id;
    var newcircleList = this.data.circleList;
    wx.showModal({
      title: '提示',
      content: '确认置顶吗',
      success: function (res) {
        if (res.confirm) {
          requests.requestCircleTop({
            session3rd: session3rd,
            id: id,
          }, (data) => {
            // 成功
            // console.log(data)
            // that.setData({
            //   circleList:data,
            // })
            console.log('成功')
          }, (data) => {
            //失败
            console.log('失败')
          }, (data) => {
            //完成
            console.log('完成')
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })

  },

  //跳转喵某人
  goMy:function(){
      wx.redirectTo({
        url: '../my/my',
      })
  },

  //跳转发帖页
  go_relese:function(e){
    console.log(e)
    var status = e.currentTarget.dataset.status;
    var session3rd=this.data.session3rd;
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
  //右滑
  // slide:function(){
  //   var that=this;
  //   var showList = this.data.showList;
  //   if (showList.length<7){
  //     console.log(1)
  //   }else{
  //     requsetShowList.call(that);
  //   }
  // },
  // 上拉加载
  scrollLowerEvent: function (e) {
    //  console.log(e)
     var that=this;
     var curIndex = e.currentTarget.dataset.index;
     console.log('上拉加载')
    if (curIndex == 1) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      requsetCircleList.call(that);
    };
    if (curIndex == 2) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      requsetQuestionList.call(that);
    };
  },
  //喵圈下拉刷新
  // circlePullDownRefresh: function (e) {
  //   var that=this;
  //   console.log("下拉刷新....")
  //   listenCircleList.call(that);
  //   wx.stopPullDownRefresh()
  // },
  //喵问下拉刷新
  // questionPullDownRefresh: function (e) {
  //   var that = this;
  //   console.log("下拉刷新....")
  //   listenQuestionList.call(that);
  //   wx.stopPullDownRefresh()
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
    var that=this;
    var circleisfirst=this.data.circleisfirst;
    var questionisfirst=this.data.questionisfirst;
    var session3rd=this.data.session3rd;
    console.log(e);
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    });
    if (e.currentTarget.dataset.idx == 1) {
          wx.showToast({
            icon: 'loading',
            duration: 1000,
          });
          if (circleisfirst==true){
            requests.requestCircleList({
              session3rd:session3rd,
            },(data) =>{
                that.setData({
                  circleList:data,
                })
            },(data) =>{

            },(data) =>{

            })
            that.setData({
              circleisfirst:false,
            })
          }else{
              return;
          }
    }else if (e.currentTarget.dataset.idx == 2) {
      wx.showToast({
        icon: 'loading',
        duration: 1000,
      });
      if (questionisfirst == true) {
        requests.requestQuestionList({
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
  go_somebody:function(e){
    console.log(e)
    var uid= e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../other/other?id=' + uid,
    })
  },
})

// 请求晒图数据
function requsetShowList() {
  var that = this;
  var showList = this.data.showList;
  var start = this.data.start;
  console.log('开始请求晒图数据', start)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestShowDiary(
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
            console.log(res)
            that.setData({
              showList: showList.concat(res.list),
              userstatus: res.userstatus,
              start:start+1,
            })
          } else {
            that.setData({
              loadingmore: false
            })
          }
        }, function () {    //请求失败
          console.log('请求失败')
           wxLogin.call(that);
        }, function () {    //请求完成

        }
      )
    }
  })
}


//  监听晒图数据请求
function listenShowList() {
  var showList = this.data.showList;
  console.log('监听晒图')
  var session3rd = this.data.session3rd;
  var start=this.data.start;
  var that = this;
  requests.requestShowDiary(
    {
      session3rd: session3rd,
    },
    function (res) {   //请求成功回调
      console.log('ll' + res)
      if (res.list) {
        that.setData({
          showList: res.list,
          start: start,
        })
      } else {
        console.log('没有更多帖子')
        // utils.showModal('提示','没有更多帖子',false);
      }
    }, function () {    //请求失败
      console.log('请求失败')
    }, function () {    //请求完成

    }
  )
}


// 请求喵圈数据
function requsetCircleList() {
  var that = this;
  var circleList = this.data.circleList;
  var circlestart = this.data.circlestart;
  var start = this.data.start;
  console.log('开始请求喵圈数据', circlestart)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestCircleList(
        {
          session3rd: session3rd,
          start: circlestart,
        },
        function (res) {   //请求成功回调
        // console.log(res)
        // console.log(circleList)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res) {
            console.log(res)
            that.setData({
              circleList: circleList.concat(res),
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

//  监听喵圈数据
function listenCircleList() {
  var circleList = this.data.circleList;
  var circlestart = this.data.circlestart;
  var session3rd = this.data.session3rd;
  console.log('监听喵圈')
  var that = this;
  requests.requestCircleList(
    {
      session3rd: session3rd,
      // circlestart: circlestart,
    },
    function (res) {   //请求成功回调
      console.log(res)
      if (res) {
        that.setData({
          circleList: res,
          // circlestart: circlestart+1,
        })
      } else {
        console.log('没有更多帖子')
        // utils.showModal('提示','没有更多帖子',false);
      }
    }, function () {    //请求失败
      console.log('请求失败')
    }, function () {    //请求完成

    }
  )
}
// 请求喵问数据
function requsetQuestionList() {
  var that = this;
  var questionList = this.data.questionList;
  var questionstart = this.data.questionstart;
  var start=this.data.start;
  console.log('开始请求喵问数据', questionstart)
  wx.getStorage({
    key: 'session',
    success: function (res) {
      // console.log(res.data)
      var session3rd = res.data;
      requests.requestQuestionList(
        {
          session3rd: session3rd,
          start: questionstart,
        },
        function (res) {   //请求成功回调
          // console.log(res)
          setTimeout(function () {
            wx.hideToast()
          }, 500)
          if (res) {
            that.setData({
              questionList: questionList.concat(res),
              questionstart: questionstart+1,
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

//  监听喵问数据
function listenQuestionList() {
  var questionList = this.data.questionList;
  var questionstart = this.data.questionstart;
  // var pageSize = this.data.pageSize;
  var session3rd = this.data.session3rd;
  // console.log(session3rd)
  var that = this;
  requests.requestQuestionList(
    {
      session3rd: session3rd,
      // pagesize: pageSize
    },
    function (res) {   //请求成功回调
      console.log(res)
      console.log('监听喵问')
      if (res !== null) {
        that.setData({
          cardlist: res,
          // questionstart: questionstart,
        })
      } else {
        console.log('没有更多帖子')
        // utils.showModal('提示','没有更多帖子',false);
      }
    }, function () {    //请求失败
      console.log('请求失败')
    }, function () {    //请求完成

    }
  )
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
              "encryptData": encryptData,
              'iv': iv,
              'encryptedData': encryptedData
            },
            success: function (res) {
              console.log(res)
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              } else {
                var session = res.data.session3rd;
                _this.setData({
                  session3rd: session,
                  maskShow: true,
                })
                wx.setStorage({    //session3rd存入微信缓存
                  key: "session",
                  data: session,
                  success: function () {
                    requsetShowList.call(_this);       //请求第一页帖子列表数据
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


//再次获取授权
function getLoginAgain() {
  wx.openSetting({
    success: function (res) {
      if (!res.authSetting["scope.userInfo"]) {
        applyNotice()
      }
    }
  })
}