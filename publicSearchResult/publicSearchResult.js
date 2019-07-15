// pages/publicSearch/publicSearch.js
//var tmpdata = require("../../tmpdata");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    focus: true,
    value: "",
    currentTab: "0",
    resultTabList: ["文章", "院校", "专业", "课程"]
  },
  queryByKeywords: function () {

  },

  bindchange: function (e) {
    console.log("e=", e);
    const that = this;

    const currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab
    })

  },
  swiperNav: function (e) {
    const that = this;
    console.log("currentTab-e=", e);
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  focus: function () {
    this.setData({
      focus: true
    })
  },
  blur: function () {
    this.setData({
      focus: false
    })
  },
  searchValue: function (e) {
    this.setData({
      value: e.detail.value
    });
  },
  detailValue: function () {
    this.setData({
      value: '',
      focus: true
    })
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
  },
  cancelTap: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("搜索结果", true);
    that.createHistorty(["管理学", "高等数学", "密码学学", "管理学", "管理学", "管理学", "管理学"]);
    /**deleteIcon */
    // that.setData({
    //  // collegeList: tmpdata.getCollegeList.Results
    // })
    options.index=1;
    const index = options.index;
that.setData({
  currentTab: index
})


  },

  focus: function () {
    this.setData({
      focus: true
    })
  },
  blur: function () {
    this.setData({
      focus: false
    })
  },

  createHistorty: function (historyList) {
    wx.setStorageSync("searchHistory", historyList)
  },


  deleteHistoryStorageTap: function () {
    const that = this;
    console.log("deleteHistoryStorageTap");
    that.setData({
      historyList: [],
      deleteIcon: false,
    }, wx.setStorageSync("searchHistory", []))
  },

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