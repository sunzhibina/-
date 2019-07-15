import api from '../../utils/api.js';
Page({
  data: {
    focus:true,
    value:'',
    batch:null,
    searchValue:'',
    placeholder:'',
    flag:null,
    userScore:[],
    searchMajorList:[]
  },
  onLoad: function (options) {
    const that = this;
    var flag = options.flag;
    that.selectComponent("#navigationcustom").setNavigationAll("专业优先搜索", true);
    try {
      var userScore = wx.getStorageSync('userScore');
      var collegeRecommendBatch = wx.getStorageSync('collegeRecommendBatch');
      if (userScore) {
        that.setData({userScore:userScore});
        if (collegeRecommendBatch){
          that.setData({ batch: collegeRecommendBatch })
        }else{
          that.setData({ batch: userScore.Batch })
        }
      }
    } catch (e) {
    }
    if (flag=='jsMajor'){
      that.setData({ placeholder:'输入专业名',flag:8 })
    }
  },
  searchResults:function(e){
    wx.showNavigationBarLoading();
    const that =this;
    if (e.type == 'tap') {
      var value = e.currentTarget.dataset.value;
    } else {
      var value = that.data.value;
    }
    that.setData({ searchValue: value});
    var userScore = that.data.userScore;
    if(value.length>0){
      api.searchV2('search/v2/getResults', 'POST', value, userScore.ProvinceId, userScore.ProvinceId, userScore.Total, userScore.CourseTypeId, userScore.CourseTypeId, that.data.batch).then(res => {
        for (let i = 0; i < res.Results[0].Majors.length; i++) {
          res.Results[0].Majors[i].newName = res.Results[0].Majors[i].Name.replace(value, "<span style='color:#e9302d;'>" + value + "</span>")
        }
        that.setData({ searchMajorList: res.Results[0].Majors});
        wx.hideNavigationBarLoading();
      })
    }else{
      wx.hideNavigationBarLoading();
    }
  },
  chooseMajor: function (e) {
    try {
      wx.setStorageSync('zyyx', e.currentTarget.dataset.name)
    } catch (e) {
    }
    wx.navigateBack({
      delta: 1
    })
  },
  mohusearch:function(e){
    try {
      wx.setStorageSync('zyyx', e.currentTarget.dataset.value)
    } catch (e) {
    };
    wx.navigateBack({
      delta: 1
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
  returnCancel: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})