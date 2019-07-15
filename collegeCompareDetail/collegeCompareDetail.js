var api = require('../../utils/api.js');
Page({
  data: {
    cityId:null,
    showLoad:true,
    compareInfo:[],
    course:0
  },
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("院校对比详情", true);
    try {
      var userScore = wx.getStorageSync('userScore');
      var collegeCompareList = wx.getStorageSync('collegeCompareList');
      var cityId = wx.getStorageSync('cityId');
      var course = wx.getStorageSync('course');
      var chooseCity = wx.getStorageSync('chooseCity');
      var chooseCityId = wx.getStorageSync('chooseCityId');
      if (userScore && collegeCompareList && cityId) {
        if (userScore.ProvinceId == 0) {
          that.setData({ cityId: cityId.cityId, course: course });
          var CollegeIds = [];
          for (var i = 0; i < collegeCompareList.length; i++) {
            if (collegeCompareList[i].st == true) {
              CollegeIds.push(collegeCompareList[i].CollegeId);
            }
          };
          if (cityId.cityId == 843 || cityId.cityId == 842) {
            course = userScore.ChooseLevel;
          }
          api.getCollegeContrasts('v2/getCollegeContrasts', 'POST', CollegeIds, cityId.cityId, course, userScore.Rank, userScore.YfydRank, userScore.Total, userScore.UserId).then(res => {
            that.setData({ compareInfo: res.Results, showLoad: false })
          })
        } else {
          that.setData({ cityId: userScore.ProvinceId, course: course });
          var CollegeIds = [];
          for (var i = 0; i < collegeCompareList.length; i++) {
            if (collegeCompareList[i].st == true) {
              CollegeIds.push(collegeCompareList[i].CollegeId);
            }
          };
          if (userScore.ProvinceId == 843 || userScore.ProvinceId == 842) {
            course = userScore.ChooseLevel;
          }
          api.getCollegeContrasts('v2/getCollegeContrasts', 'POST', CollegeIds, userScore.ProvinceId, course, userScore.Rank, userScore.YfydRank, userScore.Total, userScore.UserId).then(res => {
            that.setData({ compareInfo: res.Results, showLoad: false })
          });
          var cityName = '';
          for (var i = 0; i < chooseCityId.length; i++) {
            if (chooseCityId[i] == userScore.ProvinceId) {
              cityName = chooseCity[i];
              break;
            }
          };
          wx.setNavigationBarTitle({
            title: cityName + '省院校对比详情',
          })
        }



      }
    } catch (e) {
    }
    
  },
  compareClose:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var compareInfo = that.data.compareInfo;
    compareInfo.splice(index,1);
    that.setData({ compareInfo: compareInfo});
  },
  addCompare:function(){
    wx.navigateBack({
      delta:1
    })
  }
})