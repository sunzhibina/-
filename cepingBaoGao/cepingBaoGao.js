var api = require('../../utils/api.js')
Page({
  data: {
    showLoad: true,
    majorCepingList: [],
    pn: 1,
    scrollBottom: false
  },
  historyReport: function (userid, pn) {
    var that = this;
    api.getReportsByTypeAndUserId('v2/getReportResult?userId=' + userid + '&type=0&pageIndex=' + pn + '&pageSize=10', 'GET').then(res => {
      if (res.Results.length > 0) {
        that.setData({ majorCepingList: that.data.majorCepingList.concat(res.Results), scrollBottom: false, showLoad: false })
      } else {
        that.setData({ showLoad: false })
      }
    })
  },
  onLoad: function (options) {
    const that = this;
    try {
      const userInfo = wx.getStorageSync('userInfo');
      that.selectComponent("#navigationcustom").setNavigationAll("我的测试报告", true);
      if (userInfo) {
        that.historyReport(userInfo[0].UserId, 1);
      }
    } catch (e) {
    }
  },
  goReportDetail: function (e) {
    wx.navigateTo({
      url: '../webPage/webPage?url=' + e.currentTarget.dataset.url,
    })
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.scrollBottom == true) return;
    that.setData({ scrollBottom: true });
    try {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        var pn = that.data.pn + 1;
        that.setData({ pn: pn });
        that.historyReport(userInfo[0].UserId, pn);
      }
    } catch (e) {
    }
  },
  goCeping: function () {
    wx.switchTab({
      url: '../ceping/ceping',
    })
  }
})