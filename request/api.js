const API_Base = "https://mll.sutuv.com/index.php?s=/addon";


module.exports={
  // 喵圈发布
  API_relese_circle : API_Base + '/Diary/Diary/add_diary',
  // 喵问问题列表
  API_question_list: API_Base + '/Problem/Problem/list_problem',
  // 喵圈评论
  API_circle_comment : API_Base + '/Diary/Diary/comment_diary',
  // 喵某人
  API_my : API_Base + '/Fans/Fans/myuserinfo/',
  // 个人中心
  API_mycenter: API_Base + '/Fans/Fans/userinfo',
  // 喵圈、问答收藏 取消收藏
  API_circle_collect: API_Base + '/Diary/Diary/Collection',
  // 我的消息
  API_my_message:API_Base + '/Fans/Fans/mymsgs',
  // 喵圈详情
  API_circle_detail: API_Base + '/Diary/Diary/details_diary',
  // 喵问回答
  API_question_huida: API_Base + '/Problem/Problem/comment_problem',
  // 我的回答
  API_myanswer:API_Base + '/Fans/Fans/myanswer',
  // 我的收藏
  API_my_collection: API_Base + '/Fans/Fans/mycollect',
  // 喵圈、问答点赞 取消点赞
  API_circle_dianzan: API_Base + '/Diary/Diary/Fabulous/',
  // 喵圈列表显示
  API_circle_list: API_Base + '/Diary/Diary/circle_diary',
  // 喵图显示
  API_show_diary: API_Base + '/Diary/Diary/show_diary',
  // 我的发布
  API_my_relese: API_Base + '/Fans/Fans/mysend',
  // 登录
  API_login: API_Base + '/Fans/Fans/login',
  // 喵问发布
  API_question_relese: API_Base + '/Problem/Problem/problem',
  // 上传图片
  API_upload: API_Base + '/Diary/Diary/upload',
  // 喵问详情
  API_question_detail: API_Base + '/Problem/Problem/details_problem',
  // 喵问回答删除
  API_my_answer_del: API_Base + '/Problem/Problem/delete_problemanswer',
  // 喵问问题删除
  API_question_del: API_Base + '/Problem/Problem/delete_problem',
  //喵问回答详情
  API_answer_detail: API_Base +'/Problem/Problem/QA_problem',
  //我的喵圈收藏
API_my_circleCollect: API_Base + '/Fans/Fans/myDiaryCollect',
//我的喵问收藏
API_my_problemCollect: API_Base + '/Fans/Fans/myProCollect',
//个人中心的喵圈
API_other_circle: API_Base + '/Fans/Fans/otherDiary',
//个人中心的喵问
API_other_problem: API_Base + '/Fans/Fans/otherPro',
//喵圈帖子删除
  API_circle_del: API_Base + '/Diary/Diary/delete_diary',
  //喵问立即回答
  API_answer: API_Base + '/Problem/Problem/into_problem',
  //我的喵圈发布
  API_mycircle_relese: API_Base + '/Fans/Fans/myDiarySend',
  //我的喵问发布
  API_myquestion_relese: API_Base + '/Fans/Fans/myProSend',
  //喵圈置顶
  API_circle_top: API_Base + '/Diary/Diary/top_diary',
}



