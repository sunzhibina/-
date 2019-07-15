var api = require('../../utils/api.js')
Page({
  data: {
    bannerInfo: [],
    pn: 1,
    newClassList: [], //最新课程
    showMore: true,
    loadMore: true,
    videoDeZhiHits: [],
    banner:[]
  },
  // onPullDownRefresh: function() { 
  //   var that = this;
  //   // this.loadFirstPackDetail();
  //   api.getNewPacks('Classrooms/Videos/Query', 'POST',1).then(res => {
  //     if (res.result.items.length > 0) {
  //       that.setData({
  //         newClassList: res.result.items,
  //         pn: 1
  //       });
  //       wx.setStorage({
  //         key: "newClass",
  //         data: res.result.items
  //       });
  //     } else {
  //       that.setData({
  //         loadMore: false
  //       })
  //     }
  //   })
  // },
  onShareAppMessage: function(res) { //转发
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '优志愿填报助手',
      path: '/pages/index/index?classRoom=true',
      success: function(res) {},
      fail: function(res) {}
    }
  },
  loadNewClass: function(pn) {
    var that = this;
    // wx.getStorage({
    //   key: 'newClass',
      // success: function(res) {
      //   if (pn == 1) {
      //     that.setData({
      //       newClassList: res.data
      //     })
      //   } else {
      //     api.getNewPacks('Classrooms/Videos/Query', 'POST',pn).then(res => {
      //       if (res.Results.length > 0) {
      //         that.setData({
      //           newClassList: that.data.newClassList.concat(res.Results)
      //         })
      //       } else {
      //         that.setData({
      //           loadMore: false
      //         })
      //       }
      //     })
      //   }
      //   wx.stopPullDownRefresh()
      // },
      // fail: function() {
        api.getNewPacks('Classrooms/Videos/Query', 'POST',pn).then(res => {
          if (res.result.items.length > 0) {
            that.setData({
              newClassList: that.data.newClassList.concat(res.result.items)
            })
            wx.setStorage({
              key: "newClass",
              data: res.result.items
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
        })
        wx.stopPullDownRefresh();
      // }
    // })
  },
  // 根据学科分类获取课程点击数
  loadVideoDeZhiHits() {
    const that = this;
    api.VideoDeZhiHits('App/VideoDeZhi/Hits', 'POST').then(res => {
      that.setData({
        videoDeZhiHits: res.result
      })
    })
  },
  loadingBanner(provinceNumId) {
    const that = this;
    api.BannersQuery('Advertisement/Banners/Query', 'POST', provinceNumId).then(res=>{
      that.setData({banner:res.result})
    })
  },
  // loadFirstPackDetail: function() {
  //   var that = this;
  //   api.getFirstPageDatas('v2/getFirstPageDatas', 'GET').then(res => {
  //     that.setData({
  //       bannerInfo: res.Results[0]
  //     });
  //     wx.setStorage({
  //       key: "firstPackDetail",
  //       data: res.Results[0]
  //     });
  //     wx.stopPullDownRefresh();
  //   })
  // },
  onLoad: function(options) {
    const that = this
    // that.selectComponent("#navigationcustom").setNavigationAll("课堂/讲堂", false);
    let cityId = wx.getStorageSync('cityId').cityId;
    that.loadVideoDeZhiHits();
    that.loadingBanner(cityId);
    // wx.getStorage({
    //   key: 'firstPackDetail',
    //   success: function (res) {
    //     that.setData({ bannerInfo: res.data })
    //   }, fail: function () {
    //     that.loadFirstPackDetail()
    //   }
    // })
    that.loadNewClass(that.data.pn)
  },
  onReachBottom: function() {
    this.setData({
      pn: this.data.pn + 1
    })
    this.loadNewClass(this.data.pn)
  },
  goSearch: function() {
    wx.navigateTo({
      url: '../search/search?cls=videoSearch&flag=3',
    })
  },
  goHistory: function() {
    wx.navigateTo({
      url: '../videoHistory/videoHistory',
    })
  }
})