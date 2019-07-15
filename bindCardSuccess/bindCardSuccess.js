var app = getApp();
Page({
  data: {
    CardPermissionName: '',
    color: null
  },
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("会员卡激活", true);
    if (app.globalData.color && options.CardPermissionName) {
      that.setData({ color: app.globalData.color, CardPermissionName: options.CardPermissionName });
    }
  },
  goIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})