// components/navigationCustomTop/navigationCustomTop.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    share: {
      type: Boolean,
      value: false,
    },
    navigationText: {
      type: String, 
      value: '优志愿填报',
    },
    sharePageBack: {
      type: Boolean,
      value: ""
    },
    navigationCustomCapsuleHeight: {
      type: Number,
      value: ""
    },
    navigationCustomStatusHeight: {
      type: Number,
      value: ""
    },
    navigationHome: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navigationCustomTopShow: app.globalData.navigationCustomTopShow
  },

  /**
   * 组件的方法列表
   */
  methods: {

    setNavigationAll(navigationText, navigationHome, sharePageBack) {
      const that = this;
      // that.__data__.properties.sharePageBack = sharePageBack
      if (!app.globalData.navigationCustomTopShow)
        return
      //if (navigationText) {
      that.setData({
        navigationText: navigationText,
        sharePageBack: sharePageBack,
        navigationCustomStatusHeight: app.globalData.navigationCustomStatusHeight,
        navigationCustomCapsuleHeight: app.globalData.navigationCustomCapsuleHeight,
        navigationHome: navigationHome
      })
      // }
    },
    backIconButtonTap() {
      if (this.properties.sharePageBack) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    homeIconButtonTap() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
  }
})
