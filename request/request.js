var api = require('api.js');
var utils = require('../utils/util.js');

// 网络请求
function request(url, type, data, successCb, errorCb, completeCb) {
  wx.request({
    url: url,
    method: type,
    data: data,
    success: function (res) {
      // console.log(res)
      if (res.statusCode == 200) {
        utils.isFunction(successCb) && successCb(res.data);
      } else if (res.data.error_code == 40001) {
        console.log('session3rd失效')
        // console.log(errorCb)
        utils.isFunction(errorCb) && errorCb();
      } else {
        console.log('其他请求异常')
      }
    },
    error: function () {
      utils.isFunction(errorCb) && errorCb();
    },
    complete: function () {
      utils.isFunction(completeCb) && completeCb();
    }
  });
}

  // 喵圈发布
function requestCircleRelese(data, successCb, errorCb, completeCb) {
  request(api.API_relese_circle, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵问问题列表
function requestQuestionList(data, successCb, errorCb, completeCb) {
  request(api.API_question_list, 'GET', data, successCb, errorCb, completeCb);
}


// 喵圈评论
function requestCircleComment(data, successCb, errorCb, completeCb) {
  request(api.API_circle_comment, 'GET', data, successCb, errorCb, completeCb);
}
// 喵某人
function requestMy(data, successCb, errorCb, completeCb) {
  request(api.API_my, 'GET', data, successCb, errorCb, completeCb);
}
 // 个人中心
function requestMyCenter(data, successCb, errorCb, completeCb) {
  request(api.API_mycenter, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵圈、问答收藏 取消收藏
function requestCircleCollect(data, successCb, errorCb, completeCb) {
  request(api.API_circle_collect, 'GET', data, successCb, errorCb, completeCb);
}
 // 我的消息
function requestMyMessage(data, successCb, errorCb, completeCb) {
  request(api.API_my_message, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵圈详情
function requestCircleDetail(data, successCb, errorCb, completeCb) {
  request(api.API_circle_detail, 'GET', data, successCb, errorCb, completeCb);
}
// 喵问回答
function requestQuestionHuida(data, successCb, errorCb, completeCb) {
  request(api.API_question_huida, 'GET', data, successCb, errorCb, completeCb);
}
  // 我的回答
function requestMyAnswer(data, successCb, errorCb, completeCb) {
  request(api.API_myanswer, 'GET', data, successCb, errorCb, completeCb);
}
// 我的收藏
function requestMyCollection(data, successCb, errorCb, completeCb) {
  request(api.API_my_collection, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵圈、问答点赞 取消点赞
function requestCircleDianzan(data, successCb, errorCb, completeCb) {
  request(api.API_circle_dianzan, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵圈列表显示
function requestCircleList(data, successCb, errorCb, completeCb) {
  request(api.API_circle_list, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵图显示
function requestShowDiary(data, successCb, errorCb, completeCb) {
  request(api.API_show_diary, 'GET', data, successCb, errorCb, completeCb);
}
  // 我的发布
function requestMyRelese(data, successCb, errorCb, completeCb) {
  request(api.API_my_relese, 'GET', data, successCb, errorCb, completeCb);
}
 // 登录
function requestLogin(data, successCb, errorCb, completeCb) {
  request(api.API_login, 'GET', data, successCb, errorCb, completeCb);
}
// 喵问发布
function requestQuestionRelese(data, successCb, errorCb, completeCb) {
  request(api.API_question_relese, 'GET', data, successCb, errorCb, completeCb);
}
 // 上传图片
function requestUpload(data, successCb, errorCb, completeCb) {
  request(api.API_upload, 'GET', data, successCb, errorCb, completeCb);
}
 // 喵问详情
function requestQuestionDetail(data, successCb, errorCb, completeCb) {
  request(api.API_question_detail, 'GET', data, successCb, errorCb, completeCb);
}
// 喵问回答删除
function requestMyAnswerDel(data, successCb, errorCb, completeCb) {
  request(api.API_my_answer_del, 'GET', data, successCb, errorCb, completeCb);
}
// 喵问问题删除
function requestQuestionDel(data, successCb, errorCb, completeCb) {
  request(api.API_question_del, 'GET', data, successCb, errorCb, completeCb);
}
//喵问回答详情
function requestAnswerDetail(data, successCb, errorCb, completeCb) {
  request(api.API_answer_detail, 'GET', data, successCb, errorCb, completeCb);
}
//我的喵圈收藏
function requestMyCircleCollect(data, successCb, errorCb, completeCb) {
  request(api.API_my_circleCollect, 'GET', data, successCb, errorCb, completeCb);
}
//我的喵问收藏
function requestMyProblemCollect(data, successCb, errorCb, completeCb) {
  request(api.API_my_problemCollect, 'GET', data, successCb, errorCb, completeCb);
}
//个人中心的喵圈
function requestOtherCircle(data, successCb, errorCb, completeCb) {
  request(api.API_other_circle, 'GET', data, successCb, errorCb, completeCb);
}
//个人中心的喵问
function requestOtherProblem(data, successCb, errorCb, completeCb) {
  request(api.API_other_problem, 'GET', data, successCb, errorCb, completeCb);
}
//喵圈帖子删除
function requestCircleDel(data, successCb, errorCb, completeCb) {
  request(api.API_circle_del, 'GET', data, successCb, errorCb, completeCb);
}
//喵问立即回答
function requestAnswer(data, successCb, errorCb, completeCb) {
  request(api.API_answer, 'GET', data, successCb, errorCb, completeCb);
}
//我的喵圈发布
function requestMyCircleRelease(data, successCb, errorCb, completeCb) {
  request(api.API_mycircle_relese, 'GET', data, successCb, errorCb, completeCb);
}
//我的喵问发布
function requestMyQuestionRelease(data, successCb, errorCb, completeCb) {
  request(api.API_myquestion_relese, 'GET', data, successCb, errorCb, completeCb);
}
//喵圈置顶
function requestCircleTop(data, successCb, errorCb, completeCb) {
  request(api.API_circle_top, 'GET', data, successCb, errorCb, completeCb);
}
module.exports = {

  requestCircleRelese: requestCircleRelese,     //喵圈发布
  requestQuestionList: requestQuestionList,      //喵问问题列表
  requestCircleComment: requestCircleComment,   //喵圈评论
  requestMy: requestMy,     //喵某人
  requestMyCenter: requestMyCenter,     //个人中心
  requestCircleCollect: requestCircleCollect,  //喵圈、问答收藏 取消收藏
  requestMyMessage: requestMyMessage,  //我的消息
  requestCircleDetail: requestCircleDetail,   //喵圈详情
  requestQuestionHuida: requestQuestionHuida,    //喵问回答
  requestMyAnswer: requestMyAnswer,   //我的回答
  requestMyCollection: requestMyCollection,   //我的收藏
  requestCircleDianzan: requestCircleDianzan,   //喵圈、问答点赞 取消点赞
  requestCircleList: requestCircleList,   //喵圈列表显示
  requestShowDiary: requestShowDiary,  // 喵图显示
  requestMyRelese: requestMyRelese,          //我的发布
  requestLogin: requestLogin,          //登录
  requestQuestionRelese: requestQuestionRelese,      //喵问发布
  requestUpload: requestUpload,             //上传图片
  requestQuestionDetail: requestQuestionDetail,      //喵问详情
  requestMyAnswerDel: requestMyAnswerDel,         //喵问回答删除
  requestQuestionDel:requestQuestionDel,          //喵问问题删除
  requestAnswerDetail: requestAnswerDetail,       //喵问回答详情
  requestMyCircleCollect: requestMyCircleCollect,       //我的喵圈收藏
  requestMyProblemCollect: requestMyProblemCollect,       //我的喵问收藏
  requestOtherCircle: requestOtherCircle,       //个人中心的喵圈
  requestOtherProblem: requestOtherProblem,       //个人中心得喵问
  requestCircleDel: requestCircleDel,            //喵圈帖子删除
  requestAnswer: requestAnswer,                  //喵问立即回答
  requestMyCircleRelease: requestMyCircleRelease ,    //我的喵圈发布
  requestMyQuestionRelease: requestMyQuestionRelease,   //我的喵问发布
  requestCircleTop: requestCircleTop,   //喵圈置顶
  
}
