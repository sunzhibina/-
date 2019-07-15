
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  _confirmEvent:function(e){
    wx.reLaunch({
      url: '../index/index'
    })
  }
})