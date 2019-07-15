// pages/publicSearch/publicSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    focus: true,
    value: "",
    placeholder: "搜索感兴趣的文章、大学、专业、课程"
  },
  //Colleges/QueryByKeywords
  //关键字查询院校名称



  deleteHistoryStorageTap: function () {
    var that = this;
    wx.showModal({
      content: '是否删除历史记录',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.removeStorage({
            key: 'searchCollegeHistory',
            success: function (res) {
              wx.hideNavigationBarLoading()
            }
          })
          that.setData({
            searchCollegeHistory: []
          });
        } else if (res.cancel) { }
      }
    })

  },
  focus: function () {
    this.setData({ focus: true })
  },
  blur: function () {
    this.setData({ focus: false })
  },
  searchValue: function (e) {
    this.setData({ value: e.detail.value });
  },
  detailValue: function () {
    this.setData({ value: '', focus: true })
  },
  searchResults: function () {
    console.log("searchResults");
    const that = this;
    console.log("value=", that.data.value);
    var historyList = that.data.historyList
    historyList.push(that.data.value);
    console.log("historyList=", historyList);
    that.setData({
      historyList: historyList

    }, wx.setStorageSync("searchHistory", historyList));
    wx.navigateTo({
      url: '/pages/publicSearchResult/publicSearchResult',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  cancelTap: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  checkEntrance: function (mode) {
    if (mode == "college") {
      that.setData({
        placeholder:"大学任你挑"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("搜索", true);
    that.checkEntrance(options.mode);
    that.createHistorty(["管理学", "高等数学", "密码学学", "管理学", "管理学", "管理学", "管理学"]);
    /**deleteIcon */
    var historyList = wx.getStorageSync("searchHistory");
    if (historyList.length < 1) {
      that.setData({
        historyList: [],
        deleteIcon: false
      });
    } else {
      that.setData({
        historyList: historyList,
        deleteIcon: true
      });
    }



  },

  focus: function () {
    this.setData({ focus: true })
  },
  blur: function () {
    this.setData({ focus: false })
  },

  createHistorty: function (historyList) {
    wx.setStorageSync("searchHistory", historyList)
  },


  // deleteHistoryStorageTap: function () {
  //  const that = this;
  //    console.log("deleteHistoryStorageTap");
  // that.setData({
  //    historyList: [],
  //    deleteIcon: false,
  //   }, wx.setStorageSync("searchHistory", []))
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})