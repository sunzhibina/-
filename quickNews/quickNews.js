var api = require('../../utils/api.js');
var app = getApp();
Page({
  data: {
    containerHeight: "",
    source: false,
    quickNews: [],
    loadMore: true,
    showLoad: true,
    pn: 1,
    userInfo: []
  },
  loadQuickNews: function (provinceId, pn) {
    var that = this;
    api.getQuickNews('v2/getQuickNews?provinceId=' + provinceId + '&pageIndex=' + pn + '&pageSize=10', 'GET').then(res => {
      if (res.Results.length > 0) {
        var quickNews = that.data.quickNews;
        for (var i = 0; i < res.Results.length; i++) {
          res.Results[i].CreationTime = app.getDateDiff(res.Results[i].LastModificationTime);
          quickNews.push(res.Results[i])
        }
        that.setData({ quickNews: quickNews })
        if (res.Results.length == 10) {
          that.setData({ loadMore: true, })
        } else {
          that.setData({ loadMore: false, })
        }
      } else {
        that.setData({ loadMore: false })
      }
      that.setData({ showLoad: false })
    })
  },
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("系统消息", true);
    var containerHeight = app.globalData.screenHeight - app.globalData.navigationCustomStatusHeight - app.globalData.navigationCustomCapsuleHeight
    if (options && options.source) {
      if (options.source == 'index') {
        that.setData({ source: false, containerHeight: containerHeight })
      }
    } else {
      that.setData({ source: true, containerHeight: containerHeight })
    }
    try {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        that.setData({ userInfo: userInfo });
        that.loadQuickNews(userInfo[0].UserPermissionProvince.Id, 1);
      }
    } catch (e) {
    }
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.loadMore == false) return;
    that.setData({ pn: that.data.pn + 1 });
    that.loadQuickNews(that.data.userInfo[0].UserPermissionProvince.Id, that.data.pn);
  },
  onPullDownRefresh: function () {
    var that = this;
    // this.loadQuickNews(this.data.userInfo[0].UserPermissionProvince.Id,1);
    that.setData({ pn: 1, });
    api.getQuickNews('v2/getQuickNews?provinceId=' + that.data.userInfo[0].UserPermissionProvince.Id + '&pageIndex=1&pageSize=10', 'GET').then(res => {
      var quickNews = [];
      for (var i = 0; i < res.Results.length; i++) {
        res.Results[i].CreationTime = app.getDateDiff(res.Results[i].LastModificationTime);
        quickNews.push(res.Results[i])
      }
      wx.stopPullDownRefresh();
      that.setData({ pn: 1, quickNews: quickNews })
    })
  },
})