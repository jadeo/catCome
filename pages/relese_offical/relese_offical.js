
// var api = require('../../request/api.js');
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
// 获取应用实例
var app = getApp()
Page({
  data: {
    //帖子标题
    cardContent: '',   //帖子内容
    cardTitle: '', //帖子标题
    addImages: [],      //添加的图片的数组
    session3rd: '',        //登录态
    pid: '',             //帖子id
    isDisabled: false,
    addimg: false,      //默认发送按钮可点击状态
    images: '',
    countlength: '',    //内容长度
    titlelength: '',   //标题长度
  },
  onLoad: function () {
    var _this = this;
    wx.getStorage({      //获取登录态  提交数据时用
      key: 'session',
      success: function (res) {
        console.log(res.data)
        _this.setData({
          session3rd: res.data
        })
      }
    })
  },
  //点击返回  显示弹窗
  showModal: function () {
    utils.showModal(
      '提示',
      '退出此次编辑？',
      true,
      (data) => {
        console.log(data)
        if (data.confirm) {
          wx.navigateBack({
            // url: '../index/index'
            delta: 1
          })
        }
      }
    )
  },
  //帖子标题
  setCardTitle: function (e) {
    var that = this;
    var cardTitle = this.data.cardTitle;
    var titlelength = this.data.titlelength;
    that.setData({
      cardTitle: e.detail.value,
      titlelength: e.detail.value.length,
    })
   
    console.log(length)
  },
  //帖子内容
  setCardContent: function (e) {
    var that = this;
    var cardContent = this.data.cardContent;
    var countlength = this.data.countlength;
    that.setData({
      cardContent: e.detail.value,
      countlength: e.detail.value.length,
    })
   
    console.log(length)
  },
  //选择图片
  addImages: function (e) {
    var _this = this;
    wx.chooseImage({
      success: function (res) {
        // console.log(res);
        var addImages = _this.data.addImages;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths.concat(addImages);
        console.log(tempFilePaths)
        //判断是否超过6张
        if (tempFilePaths.length > 9) {
          utils.showModal(
            '错误提示',
            '上传图片不能超过9张',
            false,
            (data) => {
              if (data.confirm) {
                console.log('重新选择图片');
              }
            }
          )
        } else {
          _this.setData({
            addImages: tempFilePaths
          })
          // 照片的路径：tempFilePaths
          // console.log(tempFilePaths)
        }
      }
    })
  },
  //删除图片
  delAddImage: function (e) {
    var delIndex = e.currentTarget.dataset.index;  //需要删除的图片的下标
    var arryAddImg = this.data.addImages;
    arryAddImg.splice(delIndex, 1);   //新数组
    this.setData({
      addImages: arryAddImg
    })
  },
  //点击发送按钮
  postCard: function () {
    var that = this;
    var cardTitle = this.data.cardTitle;
    var cardContent = this.data.cardContent;
    var addImages = this.data.addImages;
    var session3rd = this.data.session3rd;
    var isDisabled = this.data.isDisabled;
    if (cardTitle.length < 5  || cardContent== '') {
      utils.showModal(
        '提示',
        '标题请超过5个字',
        false,
        (data) => {
          if (data.confirm) {
            console.log('重新内容或添加图片');
          }
        }
      )
    }
    else {
      that.setData({
        addimg: true,
        isDisabled: true,
      })
      if (that.data.addImages.length < 1) {
        // 直接发布没有图片
        that.setData({
          isDisabled: true,
        })
        requests.requestCircleRelese({
          session3rd: session3rd,
          title: cardTitle,
          cont: cardContent,
        }, (data) => {
          wx.showToast({
            icon: 'success',
            duration: 1000,
          });
          wx.redirectTo({
            url: '../index/index',
          }, (data) => {
            //失败
          }, (data) => {
            //完成
          }, )
        })
      } else {
        var Imagearray = that.data.addImages;
        var upLoadNum = 0;
        var imgLength = Imagearray.length - 1;
        upLoadImgs(upLoadNum, Imagearray, 'get', imgLength, that);
        console.log(that.data)
      }
    }
  },
})



// 上传照片
function upLoadImgs(upLoadNum, filePath, type, imgLength, that) {
  wx.uploadFile({
    url: 'https://mll.sutuv.com/index.php?s=/addon/Diary/Diary/upload',
    filePath: filePath[upLoadNum],
    name: 'file',
    formData: {
      'type': type
    },
    success: function (res) {
      if (that.data.images == '') {
        that.setData({
          images: parseInt(res.data)
        })
      } else {
        that.setData({
          images: that.data.images + ',' + parseInt(res.data)
        })

      }
      upLoadNum++;
      if (upLoadNum <= imgLength) {
        upLoadImgs(upLoadNum, filePath, type, imgLength, that)
      } else if (upLoadNum == (imgLength + 1)) {
        console.log('图片上传完毕');
        var img = that.data.images;
        var session3rd = that.data.session3rd;
        var cont = that.data.cardContent;
        var title = that.data.cardTitle;
        var isDisabled = that.data.isDisabled;
        // console.log(cont)
        // console.log(session3rd);
        // console.log(img);
        that.setData({
          isDisabled: true,
        })
        wx.request({
          url: 'https://mll.sutuv.com/index.php?s=/addon/Diary/Diary/add_diary',
          type: 'get',
          data: {
            images: img,
            session3rd: session3rd,
            cont: cont,
            title: title,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.showToast({
              icon: 'success',
              duration: 1000,
            });
            wx.redirectTo({
              url: '../index/index',
            })
          }
        })
      }
    },
    fail: function (res) {
      console.log(res)
      console.log('上传接口调用失败')
    },
    complete: function () {
      console.log('上传接口调用完成')
    }
  })
}


