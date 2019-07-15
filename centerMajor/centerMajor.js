var api = require('../../utils/api.js');
Page({
  data: {
    MiddleMajors: []
  },
  onLoad: function (options) {
    const code = options.code;
    const that = this;
    try {
      const cityId = wx.getStorageSync('cityId');
      const userInfo = wx.getStorageSync('userInfo');
      that.selectComponent("#navigationcustom").setNavigationAll("-", true);

      if (cityId && userInfo) {
        api.GetMiddleMajors("v2/GetMiddleMajors", "POST", code, cityId.cityId, userInfo[0].UserId).then(res => {
          if (res.Results && res.Results[0]) {
            that.setData({ MiddleMajors: res.Results });
            that.selectComponent("#navigationcustom").setNavigationAll(res.Results[0].MiddleMajor.Name, true);
            wx.setNavigationBarTitle({
              title: res.Results[0].MiddleMajor.Name,
            })
          }
        })
      }
    } catch (e) {
    }

  }
})