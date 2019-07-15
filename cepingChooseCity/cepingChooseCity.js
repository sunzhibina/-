var api = require('../../utils/api.js')
Page({
  data: {
    current:0,
    cepingTishi:false,
    tishiFlag:false
  },
  onLoad: function (options) {
    
    this.selectComponent("#navigationcustom").setNavigationAll("-", true);

  },
  cepingChooseCity:function(e){
    var that =this
    if(that.data.tishiFlag) return
    var current = e.currentTarget.dataset.id
    that.setData({
      current: current
    })
    if (current==843){
      wx.redirectTo({
        url: '../cepingZhejiang/cepingZhejiang',
      })
    }else{
      that.setData({ cepingTishi:true,tishiFlag:true})
      setTimeout(function () { that.setData({ cepingTishi: false,tishiFlag:false }) }, 2000)
    }
  }
})