var api = require('../../utils/api.js');
Page({
  data: {
    QuestionAnswers: [],
    currentTab: 0,
    chooseChecked: false,
    anwersScore: 0,
    nextAnswersFlag: false,
    parents: "父亲方面",
    cepingType: null,
    questionList: [],
    prossWidth: 0,
    num: 1,
    answers: "",
    answers1: "",
    userInfo: [],
    QuestionTestTime: null,
    results: []
  },
  onLoad: function (options) {
    const that = this;
    const cepingType = options.type;
    wx.showNavigationBarLoading();
    that.setData({ cepingType: cepingType, QuestionTestTime: new Date().getTime() });
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({ userInfo: res.data })
      }
    });
    api.getE360Question('Evaluation/Complex/Get?type=' + cepingType, 'POST').then(res => {
      // wx.setNavigationBarTitle({ title: res.Results[0].Name });
      that.selectComponent("#navigationcustom").setNavigationAll(res.result.name, true);

      that.setData({
        questionList: res.result,
        QuestionAnswers: res.result.questions[0]
      })
      wx.hideNavigationBarLoading();
    })
  },
  nextAnswersMain: function (score, id) {
    var that = this;
    var answers = that.data.answers;
    var QuestionLength = that.data.questionList.questions.length;
    var num = that.data.num;
    if (num == 1) {
      answers += id + ":" + score
    } else {
      answers += "," + id + ":" + score
    }
    var time = new Date().getTime();
    var QuestionTestTime = time - that.data.QuestionTestTime;

    that.setData({ parents: "父亲方面", QuestionTestTime: time, results: that.data.results.concat({ Id: id, Score: score, QuestionTestTime: QuestionTestTime }) });
    if (num >= QuestionLength) {
      wx.showLoading({
        title: '加载中',
      })
      var cepingType = that.data.cepingType;
      var userid = that.data.userInfo[0].UserId;
      that.setData({ answers: answers });
      try {
        var cpList = wx.getStorageSync('cpList');
        if (cpList) {
            for (var j = 0; j < cpList.length; j++) {
              if (cpList[j].type == cepingType) {
                if (cepingType >= 1 && cepingType <= 6) {
                  cpList[j].reportNum += 1
                } else {
                  cpList[j].reportNum = 1
                }
                try {
                  wx.setStorageSync('cpList', cpList)
                } catch (e) {
                }
                break;
              }
            }
        }
      } catch (e) { }
      api.saveResults('MiniProgram/Evaluation/Save', 'POST', cepingType, userid, that.data.answers, that.data.answers1, that.data.results).then(res => {
        try {
          wx.setStorageSync('ReportId', res.result.id)
        } catch (e) { }
        wx.hideLoading();
        wx.redirectTo({
          url: '../webPage/webPage?url=' + res.result.returnUrl + '&id=' + res.result.id,
        })
      })
    } else {
      that.setData({ num: num + 1, answers: answers, chooseChecked: false });
      that.setData({ currentTab: that.data.currentTab + 1 });
    }
    this.setData({ QuestionAnswers: that.data.questionList.questions[that.data.currentTab] });
  },
  nextAnswers: function (e) {
    var that = this;
    var score = e.currentTarget.dataset.score;
    var id = e.currentTarget.dataset.id;
    // if (that.data.nextAnswersFlag==true) return;
    that.setData({ nextAnswersFlag: true, anwersScore: score, chooseChecked: true, });
    that.nextAnswersMain(score, id);
  },
  fathernextAnswers: function (e) {
    var that = this;
    var score = e.currentTarget.dataset.score;
    var id = e.currentTarget.dataset.id;
    var answers = that.data.answers;
    var QuestionLength = that.data.questionList.questions.length;
    var num = that.data.num;
    if (num == 1) {
      answers += id + ":" + score
    } else {
      answers += "," + id + ":" + score
    }
    that.setData({ parents: "母亲方面" });
    if (num >= QuestionLength) {
      that.setData({ answers1: answers })
    }
  },
  noTouchMove: function () { },
  noBindTap: function () { },
  choose: function () {
    var that = this;
    that.setData({});
  },
  bindanimationfinish: function (e) { //swiper 动画结束
    this.setData({ nextAnswersFlag: false })
  }
})