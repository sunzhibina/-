var api = require('../../utils/api.js');
var app = getApp();
Page({
  data: {
    cityId:null,
    score:0,
    course:0,
    rank:0,
    batch:0,
    chooseLevelname1: '',
    chooseLevelname2: '',
    chooseLevelname3: '',
    chooseLevelLetter1: '',
    chooseLevelLetter2: '',
    querenLoading:false,
    userInfo:[]
  },
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("确认高考分数", true);
    if(options.cityid==1){
      that.setData({ cityId: options.cityid, score: options.score, course: options.course, rank: options.weicicommon.length == 0 ? 0 : options.weicicommon, chooseLevelname1: options.chooseLevelname1, chooseLevelname2: options.chooseLevelname2, chooseLevelLetter1: options.chooseLevelLetter1, chooseLevelLetter2: options.chooseLevelLetter2, batch:options.batch });
    } else if (options.cityid == 842){
      that.setData({ cityId: options.cityid, score: options.score, rank: options.rank, chooseLevelname1: options.chooseLevelname1, chooseLevelname2: options.chooseLevelname2, chooseLevelname3: options.chooseLevelname3, batch: options.batch });
    } else if (options.cityid == 843) {
      that.setData({ cityId: options.cityid, score: options.score, rank: options.rank, chooseLevelname1: options.chooseLevelname1, chooseLevelname2: options.chooseLevelname2, chooseLevelname3: options.chooseLevelname3, batch: options.batch });
    }else{
      that.setData({ cityId: options.cityid, score: options.score, course: options.course, rank: options.rank.length == 0 ? 0 : options.rank, batch: options.batch });
    };
    try {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        that.setData({ userInfo: userInfo })
      }
    } catch (e) {
    }
  },
  createGKScore:function(){
    var that = this;
    that.setData({ querenLoading:true });
    var cityId = parseInt(that.data.cityId);
    // if (cityId == 1){  //江苏
    var batch = parseInt(that.data.batch);
    var rank = parseInt(that.data.rank);
    var score = parseInt(that.data.score);
    var course = parseInt(that.data.course);
      api.createScore('v2/create', 'POST', cityId, that.data.userInfo[0].UserId, course, score, that.data.chooseLevelname1, that.data.chooseLevelLetter1, that.data.chooseLevelname2, that.data.chooseLevelLetter2, that.data.chooseLevelname3, rank, batch, 2).then(res => {
        if(res.Code==1 && res.Results.length>0){
          res.Results[0].UserScoreModel.Batch=batch;
          wx.setStorage({
            key: "userScore",
            data: res.Results[0].UserScoreModel
          });
          wx.setStorage({
            key: "collegeRecommendBatch",
            data: batch
          });
          if (app.globalData.tuijianCommon == "1") {
            wx.redirectTo({
              url: '../YJTBRecommend/YJTBRecommend',
            })
          } else {
            if (cityId==842){
              wx.redirectTo({
                url: '../shanghaiRecommend/shanghaiRecommend',
              })
            } else if (cityId == 843){
              wx.redirectTo({
                url: '../collegeRecommend/collegeRecommend',
              })
            }else{
              wx.redirectTo({
                url: '../jiangsuRecommend/jiangsuRecommend',
              })
            }
          }
        }else{
          that.setData({ querenLoading:false });
          wx.showToast({
            title: res.Message,
            icon: 'none',
            duration: 2000
          });
        }
      })
  },
  returnCreateScore:function(){
    wx.navigateBack({
      delta:1
    })
  }
})