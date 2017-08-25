//app.js
App({
  onLaunch: function () {
    var that = this;

    //先判断缓存中有没有 session3rd  若有，给后台验证；若没有，调用登录

  }
})


function wxLogin(func) {
  // console.log(this)
  var _this = this;
  //调用登录接口
  //1.小程序调用wx.login得到code.
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
          //  _this.globalData.getUserInfo = info.userInfo;   //设置用户信息为全局变量

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
              // console.log(res)
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              } else {
                var session = res.data.session3rd;
                // console.log(res)
                wx.setStorage({    //session3rd存入微信缓存
                  key: "session",
                  data: session
                })
                // console.log(_this,session)
                _this.globalData.session3rd = session;  // 把session3rd设置为全局变量
              }
              typeof func == "function" && func(res.data);
            }
          });
        }
      });
      // console.log(_this)
    }
  });
}