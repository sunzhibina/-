var api = require('../../utils/api.js');
var app = getApp();
Page({
  data: {
    share: false,
    payBtnText: app.globalData.payBtnText,
    isIos: false,
    showLoad: true,
    packType: null,
    chooseChaptersIndex: 0,
    shafaFlag: true, //沙发标志 
    answerId: null,
    addZan: false, //点赞+1
    zanTishi: false, //点赞提示
    pinglunTishi: false, //评论提示
    open: false, //intro展开/收起
    current: null,
    setctionUrl: '', //视频url
    userInfo: [],
    packDetail: [],
    talkList: [], //评论list
    body: '', //底部评论内容
    packId: null, //详情页Id
    shareCome: false
  },
  onShareAppMessage: function (res) {
    const that = this;
    if (res.from === 'button') { }
    return {
      title: '我正在看[' + that.data.packDetail.title+'] 推荐给你！',
      imageUrl: 'http://bapp.youzy.cn/share/video.png',
      path: '/pages/classRoomDetail/classRoomDetail?type=' + that.data.packType + '&id=' + that.data.packId+'&share=true'
    }
  },
  noPay: function() {
    app.payPrompt();
  },
  // onShareAppMessage: function (res) {
  //   const that = this;
  //   console.log("res.from=", res.from);

  //   return {
  //     title: that.data.packDetail.PackName,
  //     path: '/pages/classRoomDetail/classRoomDetail?id=' + that.data.packId + '&type=' + that.data.packType + '&userid=' + that.data.userInfo[0].UserId + '&usertype=' + that.data.userInfo[0].UserType
  //   }
  // },
  getdezhiUrl: function(sectionId, userid) {
    if (this.data.userInfo.length > 0) {
      const that = this;
      api.getVideoUrl('External/DeZhi/GetVideoUrl/H5?sectionId=' + sectionId + '&userId=' + userid, 'POST').then(res => {
        that.setData({
          setctionUrl: res.result
        });
      })
    }
  },
  getPackDetail(packId, packType, userid) {
    const that = this;
    api.getPackDetail('App/Videos/Get', 'POST', packId, packType, userid).then(res => {
      that.selectComponent("#navigationcustom").setNavigationAll(res.result.title, true, that.data.sharePageBack);
      that.setData({
        packDetail: res.result,
        setctionUrl: res.result.chapters[0].sections[0].setctionUrl,
        current: res.result.chapters[0].sections[0].sectionId
      })
      if (packType == 2) {
        if (that.data.share == false) {
          var id = that.data.userInfo[0].id;
          that.getdezhiUrl(res.result.chapters[0].sections[0].sectionId, id)
        }
      }
      that.setData({
        showLoad: false
      })
    });
  },

  onLoad: function(options) {
    const that = this;
    if (options && options.share) {
      that.setData({
        share: true
      })
    }
    const packId = options.id;
    const packType = options.type;
    that.selectComponent("#navigationcustom").setNavigationAll('-', true);
    that.setData({
      packId: packId,
      packType: packType
    });
    that.data.sharePageBack = false;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        const userid = res.data[0].UserId;
        that.setData({
          userInfo: res.data
        });
        that.getPackDetail(packId, packType, userid);
        that.WatchLogsInsert(packType, userid, packId);
      },
      fail: function() {
        that.getPackDetail(packId, packType, 13245742);
        that.setData({
          isIos: true
        })
      }
    })
    if (app.globalData.system == 'ios') {
      that.setData({
        isIos: true
      })
    } else {
      that.setData({
        isIos: false
      })
    }
  },
  chaptersTitle: function(e) {
    var that = this;
    if (that.data.chooseChaptersIndex == e.currentTarget.dataset.index) {
      this.setData({
        chooseChaptersIndex: -1
      })
    } else {
      this.setData({
        chooseChaptersIndex: e.currentTarget.dataset.index
      })
    }
  },
  getBody: function(e) { // 底部评论内容
    this.setData({
      body: e.detail.value
    })
  },
  // pinglun: function () {  //发布评论
  //   var that = this;
  //   var userId = that.data.userInfo[0].UserId;
  //   var pro = that.data.userInfo[0].Province.Id;
  //   var questionId = parseInt(that.data.talkList.Id);
  //   var body = that.data.body;
  //   var AnswerOutput = that.data.talkList.AnswerOutput;
  //   if (body == '') {
  //   } else {
  //     api.postAnswer('v2/postAnswer', 'POST', userId, pro, questionId, body).then(res => {
  //       AnswerOutput.splice(0, 0, res.Results[0]);
  //       that.setData({ body: '', talkList: that.data.talkList, shafaFlag: false, pinglunTishi: true });
  //       setTimeout(function () { that.setData({ pinglunTishi: false }) }, 2000);
  //     })
  //   }
  // },
  sectionsList: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    if (that.data.userInfo.length > 0) {
      var userId = that.data.userInfo[0].id;
    } else {
      var userId = 13245742;
    }
    that.setData({
      current: id
    });
    if (url == "") {
      that.getdezhiUrl(id, userId)
    } else {
      that.setData({
        setctionUrl: url
      })
    }
  },
  WatchLogsInsert(classRoomType, userNumId, numId) {
    api.WatchLogsInsert('App/Videos/WatchLogs/Insert', 'POST', classRoomType, userNumId, numId).then(res => {

    })
  },
  open: function() { // 课程介绍展开收起
    this.setData({
      open: !(this.data.open)
    })
  },
  // dianzan: function (e) {  //点赞
  //   var that = this;
  //   var answerId = e.currentTarget.dataset.id;
  //   var index = e.currentTarget.dataset.index;
  //   api.updateFabulousCount('v2/updateFabulousCount?userId=' + that.data.userInfo[0].UserId + '&answerId=' + answerId, 'POST').then(res => {
  //     if (res.Message == "") {
  //       that.data.talkList.AnswerOutput[index].FabulousCount += 1;
  //       that.setData({ addZan: true, answerId: answerId, talkList: that.data.talkList });
  //     } else {
  //       that.setData({ zanTishi: true, answerId: answerId });
  //       setTimeout(function () { that.setData({ zanTishi: false }) }, 2000);
  //     }
  //   })
  // },
  goPay: function() { //跳支付
    if (app.globalData.system == 'ios') {
      app.payPrompt();
    } else {
      wx.navigateTo({
        url: '/packages/paySystem/memberCardDetail/memberCardDetail',
      })
    }
  },
  // goIndex: function (e) {
  //   var that = this;
  //   if (e.detail.formId != "the formId is a mock one") {
  //     if (app.globalData.openid.length != 0) {
  //       api.saveForm('miniApp/push/saveForm', 'POST', -1, e.detail.formId, app.globalData.openid).then(res => {
  //       })
  //     } else {
  //       wx.login({
  //         success: function (res) {
  //           if (res.code) {
  //             api.GetJsCode2Session('miniApp/GetJsCode2Session', 'POST', res.code).then(res => {
  //               var openid = res.Results[0].openid;
  //               wx.setStorage({
  //                 key: "openid",
  //                 data: openid
  //               })
  //               app.globalData.openid = openid;
  //               api.saveForm('miniApp/push/saveForm', 'POST', -1, e.detail.formId, openid).then(res => {
  //               })
  //             })
  //           } else {
  //           }
  //         }
  //       });
  //     }
  //   };
  //   wx.reLaunch({
  //     url: '../index/index',
  //   })
  // }
})