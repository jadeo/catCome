// my_answer.js
var requests = require('../../request/request.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      session3rd:'',
      answerList:'',
      proinfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  that=this;
    wx.getStorage({        //从缓存中取出  session3rd
      key: 'session',
      success: function (res) {
        console.log(res.data)
        that.setData({
          session3rd: res.data
        })
        requests.requestMyAnswer(       //请求回答内容数据
          {
            session3rd: res.data,
          },
          (data) => {       //请求成功
            console.log(data)
            that.setData({
              answerList: data,
            })
          }, () => {
            console.log('请求失败')
          }, () => {
            // console.log('请求完成')
          }
        )
        // requestCommentsData.call(that);  //请求评论数据 第一页
      }
    })
  },
  //onload结束

  //跳转到回答详情
  qustionClick: function (e) {
    console.log(e)
    var acurId = e.currentTarget.dataset.aid;
    var qcurId = e.currentTarget.dataset.qid;
    var proinfo = e.currentTarget.dataset.pro;
    console.log(proinfo)
    if (proinfo==false){
      wx.showToast({
        title: '对不起，您回答的帖子已删除',
        image: '../../images/wrong.png'
      })
    }else{
      wx.navigateTo({
        url: "../answer_detail/answer_detail?aid=" + acurId + '&&qid=' + qcurId,
      })
    }
    
  },

  // 删除操作
  del:function(e){
      var that=this;
      var session3rd=this.data.session3rd;
      var id=e.currentTarget.dataset.id;
      var currentIndex = e.currentTarget.dataset.index;
      var newanswerList = this.data.answerList;
      console.log(e)
      wx.showModal({
        title: '提示',
        content: '确认删除吗',
        success: function (res) {
          if (res.confirm) {
            requests.requestMyAnswerDel(       //请求回答内容数据
              {
                session3rd: session3rd,
                id: id,                        //喵问问题答案id
              },
              (data) => {       //请求成功
                newanswerList.splice(currentIndex, 1)
                that.setData({
                  answerList: newanswerList,
                })

              }, () => {
                console.log('请求失败')

              }, () => {
                // console.log('请求完成')
              }
            )
          } else {
            console.log('用户点击取消')
          }

        }
      })
      

      
  },
 
})