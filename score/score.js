Page({
  data: {
    cityId: null,
    collegeList: [],
    scoreLineArr: false
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search?cls=fenshuxian&flag=1',
    })
  },
  redirect: function (e) {  //点击跳转到详情
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    if (e.currentTarget.dataset.ucode) {
      var ucode = e.currentTarget.dataset.ucode;
    }
    try {
      var cityId = wx.getStorageSync('cityId');
      if (cityId) {
        if (cityId.cityId == 843) {
          if (ucode == null) {
            wx.navigateTo({
              url: '../scoreDetailV2/scoreDetailV2?noplan=true&name=' + name
            })
          } else {
            wx.navigateTo({
              url: '../scoreDetailV2/scoreDetailV2?ucode=' + ucode + '&collegeid=' + id + '&name=' + name
            });
          }
        } else if (cityId.cityId == 842) {
          wx.navigateTo({
            url: '../scoreDetail/scoreDetail?id=' + id + '&name=' + name
          })
        } else {
          wx.navigateTo({
            url: '../scoreDetailV2Common/scoreDetailV2Common?ucode=' + ucode + '&collegeid=' + id + '&name=' + name
          })
        }
      }
    } catch (e) {
    }
  },
  clearjilu: function () {  //清除历史记录
    const that = this;
    wx.removeStorage({
      key: 'collegeScoreLineList',
      success: function (res) {
        that.setData({ collegeList: [], scoreLineArr: false });
      }
    })
  },
  onLoad: function () {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("分数线", true);
    try {
      const cityId = wx.getStorageSync('cityId');
      if (cityId) {
        that.setData({ cityId: cityId.cityId });
      } else {
      }
    } catch (e) {
    }
  },
  onShow: function () {
    var that = this;
    try {
      var collegeScoreLineList = wx.getStorageSync('collegeScoreLineList')
      if (collegeScoreLineList) {
        that.setData({ collegeList: collegeScoreLineList, scoreLineArr: true })
      } else {
        that.setData({ scoreLineArr: false })
      }
    } catch (e) {
    }
  }
})