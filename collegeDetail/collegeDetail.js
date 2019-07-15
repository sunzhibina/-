var api = require('../../utils/api.js');
var wxCharts = require('../../utils/wxcharts-min.js');
var app = getApp();
Page({
  data: {
    payBtnText: app.globalData.payBtnText,
    isIos: false,
    courseFlag: false,
    title: '',
    collegeUcode: '',
    batchPicker: [],//招生历年数据   批次
    batchIdPicker: [],
    batchIndexPicker: 0,
    coursePicker: ['理科', '文科'],
    courseIndexPicker: 0,
    collegeUp: '',
    collegeLoad: false,
    loadCollegeScore: true, //院校分数线加载
    loadPlans: true, //历年计划加载
    collegeList: [],
    collegeScoreList: [],
    plans: [],
    noPlan: false,
    planNumbersList: [],
    planNumbersLoad: true,
    calendarYearLoad: true,
    queryCalendarYearEnrollmentData: [],
    collegeList: [],
    bufenLoad: false,
    flag: 1,
    collegeJianjie: '',
    collegeName: '-',
    collegeNameFlag: true,
    collegeBatchFlag: true,
    bangmobile: true,//判断权限是否绑定手机
    closeTishi1: false,
    closeTishi: false,
    schoolList: [],
    schoolListIndex: 0,
    schoolUCode: [],
    zhaoshengjihua: true,
    scoreLineCanvas: true,
    scoreLineBiao: true,
    cityName: null,
    collegeid: null,
    Ucode: null,
    batch: null,
    course: null,
    cityId: null,
    score: null,
    courseValue: null,
    scoreArr: [],
    userInfo: [],
    userScore: [],
    showLoad: true,
    Probability: null,
    bOrz: [],
    bOrzbatch: [],
    bOrzIndex: 0,
    schoolName: [],
    schoolUcode: [],
    schoolIndex: 0,
    collegeScoreLines: [],
    year: [],
    ProvincialControlLine: [],
    minScore: [],
    currentTab: 0,
    collegeDetail: [],
    urls: [],
    pn: 1,
    count: 20,
    jianZhangList: [],
    infoHide: true,
    boy: 0,// 男
    girl: 0,// 女
    detailId: 0,
    showMore: true,
    planList: [],
    VIP: false,
  },
  /**swiper切换 */
  change: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  bindRegionChange: function (e) {   //选批次
    var that = this;
    var bOrzIndex = e.detail.value;
    if (that.data.batch == that.data.bOrzbatch[bOrzIndex]) {

    } else {
      this.setData({
        bOrzIndex: bOrzIndex,
        batch: that.data.bOrzbatch[bOrzIndex]
      })
      var batch = that.data.bOrzbatch[bOrzIndex];
      that.loadData(that.data.collegeid, that.data.Ucode, batch, that.data.course, that.data.cityId, that.data.score, that.data.userScore.Rank, that.data.userScore.YfydRank);
    }
  },
  schoolChange: function (e) {  //选学校
    var that = this;
    var schoolIndex = e.detail.value;
    if (that.data.Ucode == that.data.schoolUCode[schoolIndex]) {

    } else {
      this.setData({
        schoolListIndex: schoolIndex,
        Ucode: that.data.schoolUCode[schoolIndex]
      })
      var UCode = that.data.schoolUCode[schoolIndex];
      that.loadData(that.data.collegeid, UCode, that.data.batch, that.data.course, that.data.cityId, that.data.score, that.data.userScore.Rank, that.data.userScore.YfydRank);
    }
  },
  loadData: function (collegeid, Ucode, batch, course, pro, score, rank, YfydRank) {
    var that = this;
    var minScore = [];
    var ProvincialControlLine = [];
    var year = [];
    var scoreArr = [];
    that.setData({ bufenLoad: true });
    if (score == 0) {
    } else {
      api.getProbability('getProbabilityTestResult', 'POST', collegeid, course, pro, score, batch, "", Ucode, rank, YfydRank).then(res => {
        that.setData({ Probability: Math.round(res.Results[0].Probability) })
      })
    }
    try {
      var cityId = wx.getStorageSync('cityId');
      var userInfo = wx.getStorageSync('userInfo');
      if (cityId) {
        if (cityId.cityId == 843) {
          if (userInfo[0].UserType < 3) {
            if (Ucode.length == 0) {
              that.setData({ calendarYearLoad: false, planNumbersLoad: false });
            } else {
              that.loadCollege(collegeid, Ucode);
              that.loadPlanNumbers(collegeid, Ucode);
              that.setData({ calendarYearLoad: false });
            }
          } else {
            if (Ucode.length == 0) {
              that.setData({ planNumbersLoad: false, calendarYearLoad: false });
            } else {
              that.loadCalendarYear(collegeid, Ucode);
              that.loadCollege(collegeid, Ucode);
              that.loadPlanNumbers(collegeid, Ucode);
            }
          }
        } else if (cityId.cityId == 842) {
          api.getPorfessionAdmissPlan('Colleges/GetPorfessionAdmissPlanWithTypeByUCode?userId=' + that.data.userInfo[0].UserId + '&provinceId=' + pro + '&ucode=' + Ucode + '&course=' + course + '&batch=' + batch, 'GET').then(res => {
            that.setData({
              planList: res.Results,
              zhaoshengjihua: false
            })
          })
          api.getCollegeScoreLines('ScoreLines/NewGaoKao/QueryCollegePlansWithChooseNums?provinceId=' + parseInt(pro) + '&collegeId=' + parseInt(collegeid) + '&isGroupType=1', 'POST').then(res => {
            that.setData({
              collegeScoreLines: res.result,
            });
            that.setData({ scoreLineCanvas: false, scoreLineBiao: false, showLoad: false, bufenLoad: false })
          })
        } else {
          that.loadCollegeCommon(collegeid, cityId.cityId);
        }
      }
    } catch (e) {
    }
  },
  // 传统
  loadPlans: function (ucode, batch, course, provinceid) { //历年计划
    var that = this;
    if (that.data.VIP == true) {
      api.queryCollegeProfessionsAndPlans('v2/queryCollegeProfessionsAndPlans', 'POST', ucode, batch, course, provinceid).then(res => {
        that.setData({ plans: res.Results, loadPlans: false })
      })
    } else {
      that.setData({ loadPlans: false })
    }
  },
  loadCollegeScore: function (ucode, course, provinceid) { //院校分数线
    var that = this;
    api.queryCollegeFractions('v2/queryCollegeFractions', 'POST', ucode, course, provinceid).then(res => {
      that.setData({ collegeScoreList: res.Results, loadCollegeScore: false })
    })
  },
  loadCollegeCommon: function (collegeid, provinceid) { //招生院校
    var that = this;
    api.queryUCodesAndBatchs('v2/queryUCodesAndBatchs?collegeId=' + collegeid + '&provinceId=' + provinceid, 'GET').then(res => {
      if (res.Results[0].UCodes.length > 0) {
        res.Results[0].UCodes[0].st = true;
        that.setData({ collegeList: res.Results, showLoad: false, collegeName: res.Results[0].UCodes[0].CollegeName, collegeUcode: res.Results[0].UCodes[0].UCodeNum });
        var ucode = res.Results[0].UCodes[0].UCodeNum;
        if (that.data.courseFlag == true) {
          if (that.data.courseIndexPicker == 0) {
            var batch = res.Results[0].UCodes[0].ScienceBatchs[0].Batch;
            var batchArr = [];
            var batchIdArr = [];
            for (var i = 0; i < res.Results[0].UCodes[0].ScienceBatchs.length; i++) {
              batchArr.push(res.Results[0].UCodes[0].ScienceBatchs[i].BatchName);
              batchIdArr.push(res.Results[0].UCodes[0].ScienceBatchs[i].Batch);
            }
            that.setData({ batchPicker: batchArr, batchIdPicker: batchIdArr, courseIndexPicker: 0 });
            that.loadCollegeScore(ucode, 0, provinceid);
            if (batchIdArr.length > 0) {
              that.loadPlansCommon(that.data.cityId, that.data.Ucode, 0, that.data.batchIdPicker[that.data.batchIndexPicker])
              that.loadPlans(ucode, batch, 0, provinceid);
            } else {
              that.setData({ loadPlans: false, plans: [], zhaoshengjihua: false });
            }
          } else {
            var batch = res.Results[0].UCodes[0].ArtBatchs[0].Batch;
            var batchArr = [];
            var batchIdArr = [];
            for (var i = 0; i < res.Results[0].UCodes[0].ArtBatchs.length; i++) {
              batchArr.push(res.Results[0].UCodes[0].ArtBatchs[i].BatchName);
              batchIdArr.push(res.Results[0].UCodes[0].ArtBatchs[i].Batch);
            }
            that.setData({ batchPicker: batchArr, batchIdPicker: batchIdArr, courseIndexPicker: 1 });
            that.loadCollegeScore(ucode, 1, provinceid);
            if (batchIdArr.length > 0) {
              that.loadPlansCommon(that.data.cityId, that.data.Ucode, 1, that.data.batchIdPicker[that.data.batchIndexPicker])
              that.loadPlans(ucode, batch, 1, provinceid);
            } else {
              that.setData({ loadPlans: false, plans: [], zhaoshengjihua: false });
            }
          }
        } else {
          if (res.Results[0].UCodes[0].ScienceBatchs.length > 0) {
            var batch = res.Results[0].UCodes[0].ScienceBatchs[0].Batch;
            var batchArr = [];
            var batchIdArr = [];
            for (var i = 0; i < res.Results[0].UCodes[0].ScienceBatchs.length; i++) {
              batchArr.push(res.Results[0].UCodes[0].ScienceBatchs[i].BatchName);
              batchIdArr.push(res.Results[0].UCodes[0].ScienceBatchs[i].Batch);
            }
            that.setData({ batchPicker: batchArr, batchIdPicker: batchIdArr, courseIndexPicker: 0 });
            that.loadCollegeScore(ucode, 0, provinceid);
            if (batchIdArr.length > 0) {
              that.loadPlansCommon(that.data.cityId, that.data.Ucode, 0, that.data.batchIdPicker[that.data.batchIndexPicker])
              that.loadPlans(ucode, batch, 0, provinceid);
            } else {
              that.setData({ loadPlans: false, plans: [], zhaoshengjihua: false });
            }
          } else if (res.Results[0].UCodes[0].ArtBatchs.length > 0) {
            var batch = res.Results[0].UCodes[0].ArtBatchs[0].Batch;
            var batchArr = [];
            var batchIdArr = [];
            for (var i = 0; i < res.Results[0].UCodes[0].ArtBatchs.length; i++) {
              batchArr.push(res.Results[0].UCodes[0].ArtBatchs[i].BatchName);
              batchIdArr.push(res.Results[0].UCodes[0].ArtBatchs[i].Batch);
            }
            that.setData({ batchPicker: batchArr, batchIdPicker: batchIdArr, courseIndexPicker: 1 });
            that.loadCollegeScore(ucode, 1, provinceid);
            if (batchIdArr.length > 0) {
              that.loadPlansCommon(that.data.cityId, that.data.Ucode, 1, that.data.batchIdPicker[that.data.batchIndexPicker])
              that.loadPlans(ucode, batch, 1, provinceid);
            } else {
              that.setData({ loadPlans: false, plans: [], zhaoshengjihua: false });
            }
          }
        }

      } else {
        that.setData({ showLoad: false, loadCollegeScore: false, collegeList: res.Results, noPlan: true, zhaoshengjihua: false })
      }
    })
  },
  loadPlansCommon: function (pro, Ucode, course, batch) {
    var that = this;
    api.getPorfessionAdmissPlan('Colleges/GetPorfessionAdmissPlanWithTypeByUCode?userId=' + that.data.userInfo[0].UserId + '&provinceId=' + pro + '&ucode=' + Ucode + '&course=' + course + '&batch=' + batch, 'GET').then(res => {
      that.setData({
        planList: res.Results,
        zhaoshengjihua: false
      })
    })
  },
  noPay: function () {
    app.payPrompt();
  },
  // 浙江
  loadCalendarYear: function (collegeid, ucode) { //历年招生数据
    var that = this;
    api.queryCalendarYearEnrollmentData('v2/queryCalendarYearEnrollmentData?provinceId=843&collegeId=' + collegeid + '&uCode=' + ucode, 'GET').then(res => {
      for (let i = 0; i < res.Results.length; i++) {
        var chooseLevel = [];
        if (res.Results[i].physics == 1) { chooseLevel.push('物') }
        if (res.Results[i].chemistry == 1) { chooseLevel.push('化') }
        if (res.Results[i].biology == 1) { chooseLevel.push('生') }
        if (res.Results[i].politics == 1) { chooseLevel.push('政') }
        if (res.Results[i].history == 1) { chooseLevel.push('史') }
        if (res.Results[i].geography == 1) { chooseLevel.push('地') }
        if (res.Results[i].technology == 1) { chooseLevel.push('技') }
        if (chooseLevel.length == 0) { chooseLevel.push('不限') };
        chooseLevel = chooseLevel.join(' ');
        res.Results[i].chooseLevel = chooseLevel;
      }
      that.setData({ queryCalendarYearEnrollmentData: res.Results, calendarYearLoad: false })
    })
  },
  loadCollege: function (collegeid, ucode) { //招生方向主校名
    var that = this;
    api.queryCollegesByCollegeId('v2/queryCollegesByCollegeId?provinceId=843&collegeId=' + collegeid, 'GET').then(res => {
      for (var i = 0; i < res.Results[0].List.length; i++) {
        if (ucode == res.Results[0].List[i].UCode) {
          res.Results[0].List[i].st = true;
        }
      }
      that.setData({ collegeList: res.Results })
    })
  },
  loadPlanNumbers: function (collegeid, ucode) { // 2017招生计划
    var that = this;
    that.setData({ planNumbersLoad: true });
    api.queryPlanNumbers('v2/queryPlanNumbers?provinceId=843&collegeId=' + collegeid + '&uCode=' + ucode, 'GET').then(res => {
      if (res.Code == 100) { that.setData({ planNumbersLoad: false }) }
      else {
        for (var i = 1; i < res.Results[0].List.length; i++) {
          var chooseLevel = [];
          if (res.Results[0].List[i].physics == 1) { chooseLevel.push('物') }
          if (res.Results[0].List[i].chemistry == 1) { chooseLevel.push('化') }
          if (res.Results[0].List[i].biology == 1) { chooseLevel.push('生') }
          if (res.Results[0].List[i].politics == 1) { chooseLevel.push('政') }
          if (res.Results[0].List[i].history == 1) { chooseLevel.push('史') }
          if (res.Results[0].List[i].geography == 1) { chooseLevel.push('地') }
          if (res.Results[0].List[i].technology == 1) { chooseLevel.push('技') }
          if (chooseLevel.length == 0) { chooseLevel.push('不限') };
          chooseLevel = chooseLevel.join(' ');
          res.Results[0].List[i].chooseLevel = chooseLevel;
        }
        that.setData({ planNumbersList: res.Results, planNumbersLoad: false })
      }
    })
  },

  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  returnLogin: function () {
    var that = this
    if (that.data.userInfo[0].MobilePhone) {
      that.setData({ closeTishi1: true })
    } else {
      wx.navigateTo({
        url: '../mobile/mobile',
      })
    }
  },
  returnPay: function () {
    if (app.globalData.system == 'ios') {
      app.payPrompt();
    } else {
      wx.navigateTo({
        url: '../pay/pay',
      })
    }
  },
  returnCollegeDep: function () {
    var id = this.data.detailId
    wx.navigateTo({
      url: '../collegeDepartment/collegeDepartment?id=' + id,
    })
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current == 3 && that.data.userScore.ProvinceId != 842 && that.data.userScore.ProvinceId != 843 && that.data.year.length > 0 && that.data.minScore.length > 0 && that.data.ProvincialControlLine.length > 0) {
        that.setData({ scoreLineCanvas: false, scoreLineBiao: false })
        new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: that.data.year,
          series: [{
            name: '最低分',
            data: that.data.minScore,
            color: "#ff7f4c"
          }, {
            name: '省控线',
            data: that.data.ProvincialControlLine,
            color: "#ffca2a"
          }, {
            name: '我的位置',
            data: that.data.scoreArr,
            color: "#40c9b6"
          }],
          yAxis: {
            min: 2000,
            fontColor: '#7b7b7b',
          },
          width: 300,
          height: 200,
        })
      } else {
        that.setData({ scoreLineCanvas: true, scoreLineBiao: true })
      }
    }
    that.setData({ flag: 2 })
  },
  jianZhangDetail: function (e) {
    var jianzhangid = e.currentTarget.dataset.jianzhangid
    wx.navigateTo({
      url: '../jianzhangDetail/jianzhangDetail?id=' + jianzhangid,
    })
  },
  infoShow: function () {   //展开全文
    this.setData({
      infoHide: !this.data.infoHide
    })
  },
  loadCollegeDetail: function (id, pn, count) {
    this.setData({ showMore: false })
    api.getJianZhang('Colleges/getAdmissIntro?collegeId=' + id + '&pageIndex=' + pn + '&pageSize=' + count, 'GET').then(res => {

      if (res && res.Results && res.Results.length > 0) {
        this.setData({
          jianZhangList: this.data.jianZhangList.concat(res.Results),
          showMore: true,
          pn: pn + 1
        })
      } else {
        this.setData({
          showMore: false
        })
      }
    })
  },
  scrollToLower: function (e) {
    const that = this;
    if (!(that.data.showMore)) return;
    const pn = that.data.pn;
    const count = that.data.count;
    const id = that.data.detailId;
    that.loadCollegeDetail(id, pn, count);
  },
  previewImage: function (e) {
    const that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.current, // 当前显示图片的http链接 
      urls: that.data.urls // 需要预览的图片http链接列表
    });
  },
  onLoad: function (options) {
    const that = this;
    const pn = that.data.pn;
    const count = that.data.count;
    const id = options.id;
    that.selectComponent("#navigationcustom").setNavigationAll("-", true);

    if (app.globalData.system == 'ios') {
      that.setData({ isIos: true });
    } else {
      that.setData({ isIos: false });
    }
    if (id) {
      that.setData({ detailId: id, jianZhangList: [] });
    }
    api.getCollegeDetail('v2/GetCollegeIntroV3?collegeId=' + id, 'POST').then(res => {
      if (res && res.Results && res.Results[0]) {
        that.setData({
          collegeDetail: res.Results,
          boy: res.Results[0].Male,
          girl: res.Results[0].FeMale,
          collegeName: res.Results[0].CnName
        });
        that.selectComponent("#navigationcustom").setNavigationAll(res.Results[0].CnName, true);
      }

      // if (app.globalData.navigationBarShow == false) {
      //   wx.setNavigationBarTitle({
      //     title: res.Results[0].CnName,
      //   })
      // } else {
      //   that.setData({ title: res.Results[0].CnName });
      // }
    });
    that.loadCollegeDetail(id, pn, count);
    try {
      var userScore = wx.getStorageSync('userScore');
      var userInfo = wx.getStorageSync('userInfo');
      var Course = wx.getStorageSync('course');
      var cityId = wx.getStorageSync('cityId');
      if (userScore && userInfo) {
        if (userScore.Total != 0 && userInfo[0].GKYear == 2018) {
          that.setData({ courseFlag: true });
          if (userScore.CourseTypeId == 1) {
            that.setData({ courseIndexPicker: 1 });
          } else {
            that.setData({ courseIndexPicker: 0 });
          }
        }
        if (userInfo[0].MobilePhone) {
          that.setData({ bangmobile: false });
        }
        var score = userScore.Total;
        that.setData({ cityName: userInfo[0].Province.Name, userScore: userScore, userInfo: userInfo });
        api.getUCode('Colleges/getCollegeBatchAndUCode?collegeId=' + id + '&provinceId=' + cityId.cityId, 'GET').then(res => {
          var batchArr = [];
          var batchIndexArr = [];
          var schoolListArr = [];
          var schoolUCodeArr = [];
          if (res && res.Results && res && res.Results[0] && res.Results[0].CollegeUCodes && res.Results[0].CollegeUCodes.length > 0) {
            var Ucode = res.Results[0].CollegeUCodes[0].UCode;
            for (let i = 0; i < res.Results[0].CollegeUCodes.length; i++) {
              schoolListArr.push(res.Results[0].CollegeUCodes[i].CollegeName);
              schoolUCodeArr.push(res.Results[0].CollegeUCodes[i].UCode);
            }
          } else {
            var Ucode = "";
            that.setData({ collegeNameFlag: false });
          }
          if (res.Results && res && res.Results[0] && res.Results[0].CSPBaths && res.Results[0].CSPBaths.length > 0) {
            var batch = res.Results[0].CSPBaths[0].Batch;
            for (let i = 0; i < res.Results[0].CSPBaths.length; i++) {
              batchArr.push(res.Results[0].CSPBaths[i].BatchName);
              batchIndexArr.push(res.Results[0].CSPBaths[i].Batch);
            }
            that.setData({ bOrzbatch: batchIndexArr });
          } else {
            that.setData({ collegeBatchFlag: false, bOrzbatch: [1] });
          }
          that.setData({
            bOrz: batchArr,
            schoolList: schoolListArr,
            schoolUCode: schoolUCodeArr,
            collegeid: id,
            Ucode: Ucode,
            batch: batch,
            course: Course,
            cityId: cityId.cityId,
            score: score,
            courseValue: Course == 1 ? '文科' : '理科'
          });
          if (cityId.cityId == 843) {  //浙江
            that.loadData(id, Ucode, batch, Course, cityId.cityId, score, that.data.userScore.Rank, that.data.userScore.YfydRank);
          } else if (cityId.cityId == 842) {  //上海
            that.loadData(id, Ucode, batch, Course, cityId.cityId, score, that.data.userScore.Rank, that.data.userScore.YfydRank);
          } else {
            that.loadData(id, Ucode, batch, Course, cityId.cityId, score, that.data.userScore.Rank, that.data.userScore.YfydRank);
          }
          if (userInfo[0].UserType >= 3) {
            that.setData({ VIP: true, userScore: userScore, userInfo: userInfo })
            api.getPorfessionAdmissPlan('Colleges/GetPorfessionAdmissPlanWithTypeByUCode?userId=' + userInfo[0].UserId + '&provinceId=' + that.data.cityId + '&ucode=' + Ucode + '&course=' + userScore.CourseTypeId + '&batch=' + that.data.bOrzbatch[0], 'GET').then(res => {
              that.setData({
                planList: res.Results,
                zhaoshengjihua: false
              });
            })
          } else {
            that.setData({ VIP: false });
          }
          that.setData({ showLoad: false });
        });
      }
    } catch (e) { };
  },
  bindbOrzChange: function (e) {
    var that = this
    var bOrzIndex = e.detail.value
    that.setData({ bOrzIndex: bOrzIndex, batch: that.data.bOrzbatch[bOrzIndex] })
    if (that.data.userInfo[0].UserType >= 3) {
      that.setData({ VIP: true })
      api.getPorfessionAdmissPlan('Colleges/GetPorfessionAdmissPlanWithTypeByUCode?userId=' + that.data.userScore.UserId + '&provinceId=' + that.data.userScore.ProvinceId + '&ucode=' + that.data.Ucode + '&course=' + that.data.userScore.CourseTypeId + '&batch=' + that.data.bOrzbatch[that.data.bOrzIndex], 'GET').then(res => {
        that.setData({
          planList: res.Results,
          zhaoshengjihua: false
        })
      })
    } else {
      that.setData({ VIP: false })
    }
  },
  bindschoolChange: function (e) {
    var that = this;
    var schoolIndex = e.detail.value;
    that.setData({ schoolIndex: schoolIndex, Ucode: that.data.schoolUcode[schoolIndex] });
    if (that.data.userInfo[0].UserType >= 3) {
      that.setData({ VIP: true })
      api.getPorfessionAdmissPlan('Colleges/GetPorfessionAdmissPlanWithTypeByUCode?userId=' + that.data.userScore.UserId + '&provinceId=' + that.data.userScore.ProvinceId + '&ucode=' + that.data.schoolUcode[schoolIndex] + '&course=' + that.data.userScore.CourseTypeId + '&batch=' + that.data.batch, 'GET').then(res => {
        that.setData({
          planList: res.Results,
          zhaoshengjihua: false
        })
      })
    } else {
      that.setData({ VIP: false })
    }
  },
  VIPFalse: function () {
    var that = this
    wx.navigateTo({
      url: '../VIPpower/VIPpower',
    })
  },
  // 弹框
  closeTishi: function () {
    this.setData({ closeTishi: false, closeTishi1: false })
  },
  goPayBtn: function () {
    this.setData({ closeTishi: false, closeTishi1: false })
    wx.navigateTo({
      url: '../pay/pay',
    })
  },
  goMobileBtn: function () {
    this.setData({ closeTishi: false })
    var that = this
    if (that.data.userInfo[0].MobilePhone) {
      that.setData({
        closeTishi1: true,
        tishiContent: '很抱歉！您绑定的手机未购买任何VIP产品，请前往购买'
      })
    } else {
      wx.navigateTo({
        url: '../mobile/mobile',
      })
    }
  },
  collegeIntro: function () {
    var that = this
    wx.navigateTo({
      url: '../collegeIntro/collegeIntro?intro=' + that.data.collegeDetail[0].Introduction.replace(/&nbsp;/g, ' ') + '&collegeName=' + that.data.collegeDetail[0].CnName,
    })
  },
  // 新版本
  goMajorDetail: function (e) {
    var majorId = e.currentTarget.dataset.majorid;
    var majorName = e.currentTarget.dataset.majorname;
    var code = e.currentTarget.dataset.code;
    if (code.length == 6) {
      wx.navigateTo({
        url: '../majorDetail/majorDetail?majorId=' + majorId + '&majorName=' + majorName,
      })
    } else {
      wx.navigateTo({
        url: '../majorList/majorList?id=' + majorId + '&code=' + code,
      })
    }
  },
  // 浙江版新
  changeCollege: function (e) {
    var that = this;
    var collegeid = e.currentTarget.dataset.collegeid;
    var ucode = e.currentTarget.dataset.ucode;
    var index = e.currentTarget.dataset.index;
    var collegeList = that.data.collegeList;
    for (var i = 0; i < collegeList[0].List.length; i++) {
      collegeList[0].List[i].st = false;
    };
    collegeList[0].List[index].st = true;
    that.setData({ collegeList: collegeList, planNumbersLoad: true, calendarYearLoad: true });
    that.loadPlanNumbers(collegeid, ucode);
    that.loadCalendarYear(collegeid, ucode);
    that.loadCollege(collegeid, ucode);
  },
  // 传统版新
  chooseCourse: function (e) {
    var that = this;
    var courseIndexPicker = e.detail.value;
    if (courseIndexPicker == this.data.courseIndexPicker) {
    } else {
      var batchArr = [];
      var batchIdArr = [];
      var collegeList = that.data.collegeList;
      for (var j = 0; j < collegeList[0].UCodes.length; j++) {
        if (collegeList[0].UCodes[j].st == true) {
          var index = j;
          if (e.detail.value == 0) {
            for (var i = 0; i < collegeList[0].UCodes[index].ScienceBatchs.length; i++) {
              batchArr.push(collegeList[0].UCodes[index].ScienceBatchs[i].BatchName);
              batchIdArr.push(collegeList[0].UCodes[index].ScienceBatchs[i].Batch);
            }
          } else {
            for (var i = 0; i < collegeList[0].UCodes[index].ArtBatchs.length; i++) {
              batchArr.push(collegeList[0].UCodes[index].ArtBatchs[i].BatchName);
              batchIdArr.push(collegeList[0].UCodes[index].ArtBatchs[i].Batch);
            }
          }
          break;
        }
      }
      this.setData({ courseIndexPicker: courseIndexPicker, loadCollegeScore: true, loadPlans: true, zhaoshengjihua: true, batchPicker: batchArr, batchIdPicker: batchIdArr, batchIndexPicker: 0 });
      this.loadCollegeScore(that.data.Ucode, courseIndexPicker, that.data.cityId);
      if (that.data.batchIdPicker.length > 0) {
        this.loadPlansCommon(that.data.cityId, that.data.Ucode, courseIndexPicker, that.data.batchIdPicker[that.data.batchIndexPicker]);
        this.loadPlans(that.data.Ucode, that.data.batchIdPicker[that.data.batchIndexPicker], courseIndexPicker, that.data.cityId);
      } else {
        that.setData({ loadPlans: false, plans: [], planList: [], zhaoshengjihua: false })
      }
    }
  },
  chooseBatch: function (e) {
    var batchIndexPicker = e.detail.value;
    if (e.detail.value == this.data.batchIndexPicker) {

    } else {
      this.setData({ batchIndexPicker: batchIndexPicker, loadPlans: true, zhaoshengjihua: true });
      this.loadPlansCommon(this.data.cityId, this.data.Ucode, this.data.courseIndexPicker, this.data.batchIdPicker[e.detail.value]);
      this.loadPlans(this.data.Ucode, this.data.batchIdPicker[e.detail.value], this.data.courseIndexPicker, this.data.cityId);
    }
  },
  changeCollegeCommon: function (e) {
    var that = this;
    var collegeid = e.currentTarget.dataset.collegeid;
    var ucode = e.currentTarget.dataset.ucode;
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    var collegeList = that.data.collegeList;
    for (var i = 0; i < collegeList[0].UCodes.length; i++) {
      collegeList[0].UCodes[i].st = false;
    };
    collegeList[0].UCodes[index].st = true;
    var batchArr = [];
    var batchIdArr = [];
    // var collegeList = that.data.collegeList[0].UCodes;
    if (that.data.courseIndexPicker == 0) {
      for (var i = 0; i < collegeList[0].UCodes[index].ScienceBatchs.length; i++) {
        batchArr.push(collegeList[0].UCodes[index].ScienceBatchs[i].BatchName);
        batchIdArr.push(collegeList[0].UCodes[index].ScienceBatchs[i].Batch);
      }
    } else {
      for (var i = 0; i < collegeList[0].UCodes[index].ArtBatchs.length; i++) {
        batchArr.push(collegeList[0].UCodes[index].ArtBatchs[i].BatchName);
        batchIdArr.push(collegeList[0].UCodes[index].ArtBatchs[i].Batch);
      }
    }
    that.setData({ collegeList: collegeList, loadCollegeScore: true, loadPlans: true, zhaoshengjihua: true, Ucode: ucode, batchPicker: batchArr, batchIdPicker: batchIdArr, collegeName: name });
    that.loadCollegeScore(ucode, that.data.courseIndexPicker, that.data.cityId);
    if (that.data.batchIdPicker.length > 0) {
      that.loadPlansCommon(that.data.cityId, that.data.Ucode, that.data.courseIndexPicker, that.data.batchIdPicker[0]);
      that.loadPlans(ucode, that.data.batchIdPicker[0], that.data.courseIndexPicker, that.data.cityId)
    } else {
      that.setData({ loadPlans: false, plans: [], planList: [], zhaoshengjihua: false });
    }
  },
  collegeClose: function () {
    this.setData({ collegeUp: 'major-animate-out' })
  },
  selectPlanDetail: function (e) {
    this.setData({ collegeUp: 'major-animate' })
  },
})