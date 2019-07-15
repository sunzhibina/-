import api from '../../utils/api.js';
Page({ 
  data: {
    popup: {
      popupFlag: false,
      wrapAnimate: '',
      popupAnimate: '',
      bgOpacity: '',
    },
    sexPopup: {
      bgOpacity: 0,
      wrapAnimate: '',
      popupAnimate: '',
      sexFlag: '',
    },
    serverfail: false,
    cepingFlag: false,
    majorZongheList: [],
    currentTab: 0,
    userInfo: [],
    showLoad: true,
    introone: "",
    introtwo: "",
    introthree: "",
    IntroPicUrl: "",
    cepingType: "",
    name: "",
    cepingList: [],
    screenWidth: 360
  },
  chooseParent(e){
    let sex = parseInt(e.currentTarget.dataset.sex);
    this.hidePopup();
    wx.navigateTo({
      url: '/packages/evaluation/evaluationStart/evaluationStart?sex=' + sex +'&ispatriarch=true'
    });
  },
  // 选择性别
  chooseSex(e) {
    let sex = parseInt(e.currentTarget.dataset.sex);
    this.hideSexPopup();
    wx.navigateTo({
      url: '/packages/evaluation/evaluationStart/evaluationStart?sex=' + sex +'&ispatriarch=false'
    });
  },
  studentEvaluation(){
    const that = this;
    if (that.data.userInfo[0].gender==-1){
      this.showSexPopup()
    }else{
      let sex = that.data.userInfo[0].gender;
      wx.navigateTo({
        url: '/packages/evaluation/evaluationStart/evaluationStart?sex=' + sex +'&ispatriarch=false'
      });
    }
  },
  parentEvaluation(){
    this.showPopup();
  },
  onLoad() {
    this.selectComponent("#navigationcustom").setNavigationAll("选科/测评", false);
  },
  onShow: function () {
    var that = this;
    try {
      var cpBanners = wx.getStorageSync('cpBanners');
      var cpList = wx.getStorageSync('cpList');
      var userInfo = wx.getStorageSync('userInfo');
      that.setData({ userInfo: userInfo });
      if (cpList) {
        that.onPullDownRefresh(userInfo[0].UserId);
        that.setData({ cepingList: cpList, showLoad: false });
      } else {
        that.onPullDownRefresh(userInfo[0].UserId);
      }
    } catch (e) { }
    wx.stopPullDownRefresh();
  },
  onPullDownRefresh: function () {
    var that = this;
    that.loadCepingList(that.data.userInfo[0].UserId);
  },
  onShareAppMessage: function (res) {  //转发
    if (res.from === 'button') {
    }
    return {
      title: '优志愿填报助手',
      path: '/pages/index/index?ceping=true',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  showSexPopup() {
    const that = this;
    that.setData({
      'sexPopup.bgOpacity': 0,
      'sexPopup.wrapAnimate': "wrapAnimate",
      'sexPopup.popupAnimate': 'popupAnimate',
      'sexPopup.sexFlag': true
    })
  },
  hideSexPopup() {
    const that = this;
    that.setData({
      'sexPopup.bgOpacity': 0.4,
      'sexPopup.wrapAnimate': "wrapAnimateOut",
      'sexPopup.popupAnimate': 'popupAnimateOut'
    })
    setTimeout(() => {
      that.setData({
        'sexPopup.sexFlag': false
      })
    }, 200)
  },
  showPopup() {
    this.setData({
      'popup.wrapAnimate': "wrapAnimate",
      'popup.bgOpacity': 0,
      'popup.popupFlag': true,
      'popup.popupAnimate': "popupAnimate",
    })
  },
  hidePopup() {
    this.setData({
      'popup.wrapAnimate': "wrapAnimateOut",
      'popup.bgOpacity': 0.4,
      'popup.popupAnimate': "popupAnimateOut",
    })
    setTimeout(() => {
      this.setData({ 'popup.popupFlag': false, })
    }, 200)
  },
  zhuanyeScroll: function (e) {
    var screenWidth = this.data.screenWidth
    wx.getSystemInfo({
      success: function (res) {
        wx.pageScrollTo({
          scrollTop: 81.67 / 100 * screenWidth
        })
      }
    })
  },
  xueyeScroll: function (e) {
    var screenWidth = this.data.screenWidth; 
    wx.pageScrollTo({
      scrollTop: 215.56 / 100 * screenWidth
    })
  },
  loadCepingList: function (UserId) {
    var that = this;
    api.getReportNum('Evaluation/QueryE360Infos?userNumId=' + UserId, 'POST').then(res => {
      if (res.isSuccess) {
        // res.Results[0].IntroModel[0].bgColor = '#ff8d4f';
        // res.Results[0].IntroModel[1].bgColor = '#a27fdb';
        // res.Results[0].IntroModel[2].bgColor = '#6090e8';
        // res.Results[0].IntroModel[3].bgColor = '#09b8d2';
        // res.Results[0].IntroModel[4].bgColor = '#50c96c';
        res.result[0].bgColor = '#eeaae7';
        res.result[1].bgColor = '#ffa18b';
        res.result[2].bgColor = '#5fd0ec';
        res.result[3].bgColor = '#6adde6';
        res.result[4].bgColor = '#87cdf5';
        res.result[5].bgColor = '#fcc379';
        that.setData({ cepingList: res.result, showLoad: false });
        wx.setStorage({ key: "cpList", data: res.result });
        wx.stopPullDownRefresh();
      } else {
        that.setData({ serverfail: true, showLoad: false });
        return;
      }
    })
  },
  goCepingBaoGao: function () {
    wx.navigateTo({
      url: '../cepingBaoGao/cepingBaoGao',
    })
  },
  newGaoKao: function () {
    wx.navigateTo({
      url: '../cepingZAndKBefore/cepingZAndKBefore',
    })
  },
  goCepingTijian: function (e) {
    var that = this;
    var cepingType = e.currentTarget.dataset.type;
    var introone = e.currentTarget.dataset.introone;
    var introtwo = e.currentTarget.dataset.introtwo;
    var introthree = e.currentTarget.dataset.introthree;
    var name = e.currentTarget.dataset.name;
    var reportnum = e.currentTarget.dataset.reportnum;
    var IntroPicUrl = e.currentTarget.dataset.intropicurl;
    try {
      wx.setStorageSync('cepingImg', { cepingUrl: IntroPicUrl, cepingName: name })
    } catch (e) { }
    wx.navigateTo({
      url: '../cepingReady/cepingReady?intro1=' + introone + '&intro2=' + introtwo + '&intro3=' + introthree + '&intropicurl=' + IntroPicUrl + '&type=' + cepingType + '&name=' + name + '&reportnum=' + reportnum,
    })
  },
  swichNav: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  change: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  zongheReport: function () {
    var that = this;
    var majorZonghe = that.data.cepingList[0].IntroModel;
    var majorZongheList = [];
    for (var i = 0; i < majorZonghe.length; i++) {
      if (majorZonghe[i].ReportNum == 0) {
        majorZongheList.push(majorZonghe[i]);
      }
    }
    if (majorZongheList.length > 0) {
      that.setData({ majorZongheList: majorZongheList, cepingFlag: true });
    } else {
      wx.navigateTo({
        url: '../webPage/webPage?url=https://m.youzy.cn/Evaluations/EvaluationReport.aspx?userId=11464842',
      })
    }
  },

  goCeping: function (e) {
    wx.navigateTo({
      url: '../cepingQuestion/cepingQuestion?type=' + e.currentTarget.dataset.type,
    })
    this.goCepingClose();
  },
  goCepingClose: function () {
    this.setData({ cepingFlag: false })
  },
  _confirmEvent: function () {
    this.setData({ showLoad: true, serverfail: false });
    this.loadCepingList(this.data.userInfo[0].UserId);
  }
})