Page({
  data: {
    GKYear:'-'
  },
  photoCall: function () {
    wx.makePhoneCall({
      phoneNumber: '400-181-5008'
    })
  },
  onLoad:function(){
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("优志愿", true);
    try {
      var userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        that.setData({
          GKYear: userInfo[0].GKYear
        })
      }
    } catch (e) {
    }
  }
})