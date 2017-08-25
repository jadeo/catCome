
// var api = require('../../request/api.js');
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
// 获取应用实例
var app = getApp()
Page({
  data: {
    count: '',   //评论内容
    addImages: [],      //添加的图片的数组
    session3rd: '',        //登录态
    addimg: false,      //默认发送按钮可点击状态
    to_uid:'',               //被评论者ID
    did:'',                   //帖子id
    images:'',
    length:'',
    isDisabled:false,
    
  },
  onLoad: function (options) {
    console.log(options)
    var id=options.id;         //帖子id
    var to_uid = options.uid;  //被评论者id
    var _this = this;
    // setCardContent.call(_this);
    wx.getStorage({      //获取登录态  提交数据时用
      key: 'session',
      success: function (res) {
        console.log(res)
        _this.setData({
          session3rd: res.data,
          to_uid: to_uid,
          did:id,
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

  //评论内容
  setCardContent: function (e) {
    var that=this;
    var count=this.data.count;
    var length=this.data.length;
    that.setData({
      count: e.detail.value,
      length: e.detail.value.length,
    })
  },
  //选择图片
  addImages: function (e) {
    var _this = this;
    // this.setData({
    //   addimg: true,
    // })
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
    var count = this.data.count;
    var addImages = this.data.addImages;
    var session3rd = this.data.session3rd;
    var to_uid=this.data.to_uid;
    var id=this.data.did;
    var isDisabled = this.data.isDisabled;
    if (count == '' && addImages.length < 1) {
      utils.showModal(
        '提示',
        '内容不能为空',
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
        });
        requests.requestCircleComment({
          session3rd: session3rd,
          count: count,
          to_uid: to_uid,
          did: id,
        },(data) =>{
            console.log('成功')
            wx.showToast({
            icon: 'success',
            duration: 1000,
             });
             wx.redirectTo({
               url: '../circle_detail/circle_detail?id=' + id,
             })
        },(data) =>{
          console.log('失败')
        },(data) =>{
          console.log('完成')
        })
      } else {
        var Imagearray = that.data.addImages;
        var upLoadNum = 0;
        var imgLength = Imagearray.length - 1;
        upLoadImgs(upLoadNum, Imagearray, 'get', imgLength, that);
        console.log()
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
        var cont = that.data.count;
        var to_uid = that.data.to_uid;
        var id=that.data.did;
        // console.log(cont)
        // console.log(session3rd);
        console.log(img);
        that.setData({
          isDisabled: true,
        })
        wx.request({
          url: 'https://mll.sutuv.com/index.php?s=/addon/Diary/Diary/comment_diary',
          type: 'get',
          data: {
            images: img,
            session3rd: session3rd,
            count: cont,
            to_uid: to_uid,
            did:id,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            wx.showToast({
              icon: 'success',
              duration: 1000,
            });
            wx.redirectTo({
              url: '../circle_detail/circle_detail?id=' + id,
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