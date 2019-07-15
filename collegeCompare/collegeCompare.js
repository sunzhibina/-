Page({
  data: {
    collegeCompareList: [],
    num: 0,
    allChecked: false
  },
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("院校对比", true);

  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search?cls=zhaodaxue&flag=1&majorsearch=true',
    });
  },
  onShow: function () {
    const that = this;
    var num = 0;
    try {
      var collegeCompareList = wx.getStorageSync('collegeCompareList');
      if (collegeCompareList) {
        that.setData({ collegeCompareList: collegeCompareList });
      }
    } catch (e) {
    };
    for (let i = 0; i < that.data.collegeCompareList.length; i++) {
      if (that.data.collegeCompareList[i].st == true) {
        num += 1;
      }
    }
    that.setData({ num: num });
  },
  chooseCollegeNo: function (e) {
    console.log('no');
    const that = this;
    var num = 0;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var collegeCompareListArr = [];
    try {
      var collegeCompareList = wx.getStorageSync('collegeCompareList');
      if (collegeCompareList) {
        collegeCompareListArr = collegeCompareList
      }
    } catch (e) { };
    collegeCompareListArr[index].st = !(collegeCompareListArr[index].st);
    that.setData({ collegeCompareList: collegeCompareListArr });
    try {
      wx.setStorageSync('collegeCompareList', collegeCompareListArr)
    } catch (e) {
    };
    for (let i = 0; i < collegeCompareListArr.length; i++) {
      if (collegeCompareListArr[i].st == true) {
        num += 1;
      }
    }
    that.setData({ num: num });

  },
  chooseCollege: function (e) {
    var that = this;
    var num = 0;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var collegeCompareListArr = [];
    try {
      var collegeCompareList = wx.getStorageSync('collegeCompareList');
      if (collegeCompareList) {
        collegeCompareListArr = collegeCompareList
      }
    } catch (e) { }
    if (that.data.num < 6) {
      collegeCompareListArr[index].st = !(collegeCompareListArr[index].st);
      that.setData({ collegeCompareList: collegeCompareListArr });
    } else {
      wx.showToast({
        title: '最多支持 6 所院校对比',
        icon: 'none',
        duration: 1500
      })
    }
    try {
      wx.setStorageSync('collegeCompareList', collegeCompareListArr)
    } catch (e) {
    }
    for (var i = 0; i < collegeCompareListArr.length; i++) {
      if (collegeCompareListArr[i].st == true) {
        num += 1;
      }
    }
    if (num == 0) {
      that.setData({ allChecked: false })
    } else if (num == collegeCompareListArr.length) {
      that.setData({ allChecked: true })
    } else {
      that.setData({ allChecked: false })
    };
    if (num > 6) {
      wx.showToast({
        title: '最多支持 6 所院校对比',
        icon: 'none',
        duration: 1500
      })

    }
    that.setData({ num: num });
  },

  cencelChecked: function () {
    var that = this;
    var collegeCompareList = that.data.collegeCompareList;
    for (var i = 0; i < collegeCompareList.length; i++) {
      collegeCompareList[i].st = false;
    };
    that.setData({ collegeCompareList: collegeCompareList, allChecked: false, num: 0 });
    try {
      wx.setStorageSync('collegeCompareList', collegeCompareList)
    } catch (e) {
    }
  },
  clear: function () {
    try {
      wx.removeStorageSync('collegeCompareList')
    } catch (e) {
    };
    this.setData({ collegeCompareList: [], num: 0 });
  },
  compareStart: function () {
    wx.navigateTo({
      url: '../collegeCompareDetail/collegeCompareDetail',
    })
  },
  compareYaoqiu: function () {
    var num = this.data.num;
    if (num < 2) {
      wx.showToast({
        title: '请至少选择两所院校进行对比',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showToast({
        title: '最多支持 6 所院校对比',
        icon: 'none',
        duration: 1500
      })
    }

  }
})