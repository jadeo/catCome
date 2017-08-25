function isFunction(obj) {
  return typeof obj === 'function';
}

//弹窗
function showModal(titleTxt, contentTxt, showCancelVal, successCb) {
  wx.showModal({
    title: titleTxt,
    content: contentTxt,
    showCancel: showCancelVal,
    cancelText: "取消",
    confirmText: "确定",
    confirmColor: "#4797ca",
    success: function (res) {
      isFunction(successCb) && successCb(res);
    }
  })
}

//发帖、评论    上传图片
function upLoadImg(upLoadNum, filePath, type, imgLength, data) {
  wx.uploadFile({
    url: 'https://mll.sutuv.com/index.php?s=/addon/Diary/Diary/upimg',
    filePath: filePath[upLoadNum],
    name: 'file',
    formData: {
      'type': type
    },
    success: function (res) {
      if (!data.img) {
        data.img = res.data
      } else {
        data.img = data.img + ',' + res.data
      }
      upLoadNum++;
      console.log(upLoadNum, imgLength)
      if (upLoadNum <= imgLength) {
        upLoadImg(upLoadNum, filePath, type, imgLength, data)
      } else if (upLoadNum == (imgLength + 1)) {
        console.log(upLoadNum + '张图片上传完成')
        console.log(data)
        return data;
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


module.exports = {
  isFunction: isFunction,
  showModal: showModal,
  upLoadImg: upLoadImg,
  // wxLogin: wxLogin,
  

}
