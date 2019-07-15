var api = require('../../utils/api.js');
var app = getApp();
Page({
  xianChaError: false,
  data: {
    checked: true,
    YJTBflag: false,
    userInfo: [],
    showLoad: true,
    GaoKaoTotal: [],
    lineGapMax: 267,
    batchId: [],
    batch: null,
    xianChaFen: null,
    xianCha: [],  //线差
    xianChaIndex: 0,
    kemuValue: '',
    politicsValue: '',
    historyValue: '',
    history: ['A+', 'A', 'B+', 'B', 'C', 'D'],  //历史
    historyIndex: 0,
    kemu: [['政治', '地理', '化学', '生物'], ['A+', 'A', 'B+', 'B', 'C', 'D']],
    kemuIndex: [0, 0],
    courseType: 1,
    currentTab: 0,
    commonTuijian: false,
    shangHaiSubject: [
      { name: '思想政治', st: false },
      { name: '历史', st: false },
      { name: '地理', st: false },
      { name: '生命科学', st: false },
      { name: '物理', st: false },
      { name: '化学', st: false },], //上海科目
    shangHaiSubjectArr: [],
    getFen: '',
    weiFen: '',
    cityId: null
  },
  onLoad: function (options) {
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("修改成绩", true);
    if (options.YJTBflag) { that.setData({ YJTBflag: true }) };
    try {
      var cityId = wx.getStorageSync('cityId');
      var userScore = wx.getStorageSync('userScore');
      var userInfo = wx.getStorageSync('userInfo');
      var shangHaiSubjectArr = wx.getStorageSync('shangHaiSubjectArr');
      var gaokaoScore = wx.getStorageSync('gaokaoScore');
      const getFen = userScore.Total;
      const course = userScore.CourseTypeId;
      var xianChaIndex = that.data.xianChaIndex;
      if (cityId) {
        that.setData({ userInfo: userInfo });
        if (userInfo[0].GKYear == app.getGaoKaoYear() && userScore.Id != 0 && userInfo[0].MobilePhone != null) {
          that.setData({ checked: false })
        } else {
          that.setData({ checked: true })
        }
        if (cityId.cityId == 842) {
        } else {
          api.getPrvControlLine('scoreLines/v2/getProvinceControlLineByProvinceId?provinceId=' + cityId.cityId, 'GET').then(res => {
            var gaokaoTotal = res.Results;
            xianChaIndex = app.getAdmissionBatch(getFen, res.Results, course);
            console.log("xianChaIndex=", xianChaIndex);
            var setdata = {
              xianChaIndex: xianChaIndex,
              GaoKaoTotal: gaokaoTotal,
              showLoad: false
            }
            if (xianChaIndex > 3) {
              setdata.xianChaIndex = 3;
              setdata.xianChaFen = null;
            } else {
              setdata.xianChaFen = app.getLineGap(getFen, gaokaoTotal, xianChaIndex, course);
            }
            //xianChaIndex
            setdata.lineGapMax = app.getLineGapMax(gaokaoTotal, setdata.xianChaIndex, course);
            that.setData(setdata);
          });
        }
        if (cityId.cityId == 842) {
          var shangHaiSubject = that.data.shangHaiSubject;
          for (var i = 0; i < shangHaiSubjectArr.length; i++) {
            for (var j = 0; j < shangHaiSubject.length; j++) {
              if (shangHaiSubjectArr[i] == shangHaiSubject[j].name) {
                shangHaiSubject[j].st = true;
                break;
              }
            }
          }
          that.setData({ cityId: cityId.cityId, getFen: userScore.Total, weiFen: userScore.Rank, shangHaiSubject: shangHaiSubject, shangHaiSubjectArr: shangHaiSubjectArr })
        } else if (cityId.cityId == 843) {

        } else if (cityId.cityId == 1) {
          var history = that.data.history;
          for (var i = 0; i < history.length; i++) {
            if (userScore.ChooseLevel1.Letter == history[i]) {
              that.setData({ historyIndex: i, historyValue: userScore.ChooseLevel1.Letter });
              break;
            }
          }
          var kemuIndex = that.data.kemuIndex;
          var kemu = that.data.kemu;
          for (var i = 0; i < kemu[0].length; i++) {
            if (kemu[0][i] == userScore.ChooseLevel2.Name) {
              kemuIndex[0] = i;
              that.setData({ kemuValue: userScore.ChooseLevel2.Name });
              break;
            }
          }
          for (var i = 0; i < kemu[1].length; i++) {
            if (kemu[1][i] == userScore.ChooseLevel2.Letter) {
              kemuIndex[1] = i;
              that.setData({ politicsValue: userScore.ChooseLevel2.Letter })
              break;
            }
          }
          for (var i = 0; i < gaokaoScore.length; i++) {
            that.setData({ xianCha: that.data.xianCha.concat(gaokaoScore[i].batchName), batchId: that.data.batchId.concat(gaokaoScore[i].batch) });
          }
          that.setData({ cityId: cityId.cityId, getFen: userScore.Total, courseType: userScore.CourseTypeId, kemuIndex: kemuIndex });
        } else {
          for (var i = 0; i < gaokaoScore.length; i++) {
            that.setData({ xianCha: that.data.xianCha.concat(gaokaoScore[i].batchName), batchId: that.data.batchId.concat(gaokaoScore[i].batch) });
          }
          that.setData({ cityId: cityId.cityId, getFen: userScore.Total, courseType: userScore.CourseTypeId });
        }
      }
    } catch (e) {
    }
  },
  enterInput: function (e) {
    var that = this;
    var fentype = e.currentTarget.dataset.type;
    var value = e.detail.value;
    if (fentype == 'getFen') {
      that.setData({
        getFen: value,
      })
    };
    if (fentype == 'weiFen') {
      that.setData({
        weiFen: value,
      })
    }
  },
  chooseShangHaiSubject: function (e) {   //选择上海科目
    var that = this;
    var subjectName = e.currentTarget.dataset.name;
    var shangHaiSubject = that.data.shangHaiSubject;
    var shangHaiSubjectArr = that.data.shangHaiSubjectArr;
    for (var i in shangHaiSubject) {
      if (subjectName == shangHaiSubject[i].name) {
        var flag = !that.data.shangHaiSubject[i].st;
        if (flag == true && shangHaiSubjectArr.length < 3) {
          that.data.shangHaiSubject[i].st = flag;
          that.setData({
            shangHaiSubjectArr: that.data.shangHaiSubjectArr.concat(subjectName),
            shangHaiSubject: shangHaiSubject
          });
        } else if (flag == false && shangHaiSubjectArr.length >= 0) {
          that.data.shangHaiSubject[i].st = flag;
          that.setData({
            shangHaiSubject: shangHaiSubject
          });
          for (var j in shangHaiSubjectArr) {
            if (subjectName == shangHaiSubjectArr[j]) {
              shangHaiSubjectArr.splice(j, 1);
              that.setData({
                shangHaiSubjectArr: shangHaiSubjectArr
              });
            }
          }
        }
      }
    }
    wx.setStorage({
      key: "shangHaiSubjectArr",
      data: that.data.shangHaiSubjectArr
    })
  },
  commonTuijian: function () {
    const that = this;
    if (that.data.commonTuijian == true) return;
    that.setData({ commonTuijian: true });
    const getFen = that.data.getFen;
    const xianChaFen = that.data.xianChaFen;
    const gaokaoTotal = that.data.GaoKaoTotal;
    const lineGapMax = that.data.lineGapMax;
    const currentTab = that.data.currentTab;
    if (currentTab == 1) {
      console.log("到先查模式-xianChaFen=", xianChaFen);
      if ((!xianChaFen && xianChaFen != 0) || (xianChaFen > lineGapMax) || xianChaFen < 0) {
        wx.showToast({
          title: "优志愿：您的成绩不在有效范围",
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () { that.setData({ tishiFlag: false, commonTuijian: false }) }, 2000)
        return;
      }
    }
    /**以下三句话为测试专用，等开发完要撤销 */
    // that.data.commonTuijian = false
    // console.log("卡住了");
    // return;
    wx.showLoading({
      title: '加载中',
    });
    var cityId = that.data.cityId;
    var shangHaiSubjectArr = that.data.shangHaiSubjectArr;
    var courseType = that.data.courseType;
    if (cityId == 842) { //上海
      if (getFen >= 100 && getFen <= 660) {
        var weiFen = that.data.weiFen;
        if (weiFen <= 1 || weiFen >= 59999) {
          setTimeout(function () { that.setData({ commonTuijian: false }); }, 1500);
          wx.showToast({
            title: '位次输入范围1~59999',
            icon: 'none',
            duration: 1500
          })
        } else if (shangHaiSubjectArr.length < 3) {
          setTimeout(function () { that.setData({ commonTuijian: false }); }, 1500);
          wx.showToast({
            title: '请选择3个选考',
            icon: 'none',
            duration: 1500
          })
        } else {
          that.createShanghaiScoreMain(842, 0, getFen, shangHaiSubjectArr[0], "", shangHaiSubjectArr[1], "", shangHaiSubjectArr[2], weiFen, 1)
        }
      } else {
        setTimeout(function () { that.setData({ commonTuijian: false }); }, 1500);
        wx.showToast({
          title: "成绩输入范围100-660分",
          icon: 'none',
          duration: 1500
        })
      }

    } else if (cityId == 843) { //浙江
    } else if (cityId == 1) { //江苏
      const gaokaoTotalMax = gaokaoTotal[0].GaoKaoTotal;
      if (getFen <= gaokaoTotalMax && getFen >= 100) {
        if (courseType == 1) { // 文科
          var scoreArr = 1;
          for (var i = 0; i < gaokaoTotal[0].PrvModel.length; i++) {
            if (getFen >= gaokaoTotal[0].PrvModel[i].ArtsScore && getFen <= gaokaoTotalMax) {
              scoreArr = gaokaoTotal[0].PrvModel[i].batch;
              break;
            } else {
              scoreArr = gaokaoTotal[0].PrvModel[gaokaoTotal[0].PrvModel.length - 1].batch;
            }
          }
          var IsGaokao = 1;
          if (that.data.userInfo[0].IsGaokao == true) {
            IsGaokao = 2;
          }
          var jsName1 = courseType == 1 ? "历史" : "物理";
          var jsLevel1 = that.data.historyValue;
          var jsName2 = that.data.kemuValue;
          var jsLevel2 = that.data.politicsValue;
          api.createScore('v2/create', 'POST', cityId, that.data.userInfo[0].UserId, 1, getFen, jsName1, jsLevel1, jsName2, jsLevel2, '', '', scoreArr, IsGaokao).then(res => {
            if (res.Results.length > 0) {
              wx.setStorage({
                key: "userScore",
                data: res.Results[0].UserScoreModel
              })
              wx.hideLoading();
              if (that.data.YJTBflag == true) {
                wx.redirectTo({
                  url: '../YJTBRecommend/YJTBRecommend',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
              that.setData({ commonTuijian: false });
            } else {
              wx.showToast({
                title: res.Message,
                icon: 'none',
                duration: 2000
              });
              setTimeout(function () { that.setData({ commonTuijian: false }); }, 2000);
            }
          })
        } else if (courseType == 0) {
          var scoreArr = 1;
          for (var i = 0; i < gaokaoTotal[0].PrvModel.length; i++) {
            if (getFen >= gaokaoTotal[0].PrvModel[i].SciencesScore) {
              scoreArr = gaokaoTotal[0].PrvModel[i].batch
              break;
            } else {
              scoreArr = gaokaoTotal[0].PrvModel[gaokaoTotal[0].PrvModel.length - 1].batch;
            }
          }
          var IsGaokao = 1;
          if (that.data.userInfo[0].IsGaokao == true) {
            IsGaokao = 2;
          }
          var jsName1 = courseType == 1 ? "历史" : "物理";
          var jsLevel1 = that.data.historyValue;
          var jsName2 = that.data.kemuValue;
          var jsLevel2 = that.data.politicsValue;
          api.createScore('v2/create', 'POST', cityId, that.data.userInfo[0].UserId, 0, getFen, jsName1, jsLevel1, jsName2, jsLevel2, '', '', scoreArr, IsGaokao).then(res => {
            if (res.Results.length > 0) {
              wx.setStorage({
                key: "userScore",
                data: res.Results[0].UserScoreModel
              })
              wx.hideLoading();
              if (that.data.YJTBflag == true) {
                wx.redirectTo({
                  url: '../YJTBRecommend/YJTBRecommend',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
              that.setData({ commonTuijian: false });
            } else {
              wx.showToast({
                title: res.Message,
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () { that.setData({ commonTuijian: false }); }, 2000);
            }
          })
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: "分数应为 100-" + gaokaoTotalMax,
          icon: 'none',
          duration: 1500
        });
        setTimeout(function () { that.setData({ commonTuijian: false }); }, 1500);
      }
    } else {
      if (getFen <= gaokaoTotalMax && getFen >= 100) {
        if (courseType == 1) { // 文科
          var scoreArr = 1;
          for (var i = 0; i < gaokaoTotal[0].PrvModel.length; i++) {
            if (getFen >= gaokaoTotal[0].PrvModel[i].ArtsScore && getFen <= gaokaoTotalMax) {
              scoreArr = gaokaoTotal[0].PrvModel[i].batch
              break;
            } else {
              scoreArr = gaokaoTotal[0].PrvModel[gaokaoTotal[0].PrvModel.length - 1].batch;
            }
          }
          var IsGaokao = 1;
          if (that.data.userInfo[0].IsGaokao == true) {
            IsGaokao = 2;
          }
          api.createScore('v2/create', 'POST', cityId, that.data.userInfo[0].UserId, 1, getFen, '', '', '', '', '', '', scoreArr, IsGaokao).then(res => {
            if (res.Results.length > 0) {
              wx.setStorage({
                key: "userScore",
                data: res.Results[0].UserScoreModel
              })
              wx.hideLoading();
              if (that.data.YJTBflag == true) {
                wx.redirectTo({
                  url: '../YJTBRecommend/YJTBRecommend',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
              that.setData({ commonTuijian: false });
            } else {
              wx.showToast({
                title: res.Message,
                icon: 'none',
                duration: 2000
              });
              setTimeout(function () { that.setData({ commonTuijian: false }); }, 2000);
            }
          })
        } else if (that.data.courseType == 0) {
          var scoreArr = 1;
          for (var i = 0; i < gaokaoTotal[0].PrvModel.length; i++) {
            if (getFen >= gaokaoTotal[0].PrvModel[i].SciencesScore) {
              scoreArr = gaokaoTotal[0].PrvModel[i].batch
              break;
            } else {
              scoreArr = gaokaoTotal[0].PrvModel[gaokaoTotal[0].PrvModel.length - 1].batch;
            }
          }
          var IsGaokao = 1;
          if (that.data.userInfo[0].IsGaokao == true) {
            IsGaokao = 2;
          }
          api.createScore('v2/create', 'POST', cityId, that.data.userInfo[0].UserId, 0, getFen, '', '', '', '', '', '', scoreArr, IsGaokao).then(res => {
            if (res.Results.length > 0) {
              wx.setStorage({
                key: "userScore",
                data: res.Results[0].UserScoreModel
              })
              wx.hideLoading();
              if (that.data.YJTBflag == true) {
                wx.redirectTo({
                  url: '../YJTBRecommend/YJTBRecommend',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
              that.setData({ commonTuijian: false });
            } else {
              wx.showToast({
                title: res.Message,
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () { that.setData({ commonTuijian: false }); }, 2000);
            }
          })
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: "分数应为 100-" + gaokaoTotalMax,
          icon: 'none',
          duration: 1500
        });
        setTimeout(function () { that.setData({ commonTuijian: false }); }, 1500);
      }
    }
  },
  createShanghaiScoreMain: function (pro, course, score, jsName1, jsLevel1, jsName2, jsLevel2, zhejiang3, rank, batch) {
    var that = this;
    try {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        if (userInfo[0].IsGaokao == true) {
          api.createScore('v2/create', 'POST', pro, userInfo[0].UserId, course, score, jsName1, jsLevel1, jsName2, jsLevel2, zhejiang3, rank, batch, 2).then(res => {
            if (res.Results.length > 0) {
              try {
                wx.setStorageSync('userScore', res.Results[0].UserScoreModel);
                wx.setStorageSync('shangHaiSubjectArr', that.data.shangHaiSubjectArr);
              } catch (e) {
              };
              wx.setStorage({
                key: "shareRecommend",
                data: false
              });
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              })

            } else {
              wx.hideLoading();
              wx.showToast({
                title: res.Message,
                icon: 'none',
                duration: 1500
              })
              that.setData({ commonTuijian: false });
            }
          })
        } else {
          api.createScore('v2/create', 'POST', pro, userInfo[0].UserId, course, score, jsName1, jsLevel1, jsName2, jsLevel2, zhejiang3, rank, batch, 1).then(res => {
            if (res.Results.length > 0) {
              try {
                wx.setStorageSync('userScore', res.Results[0].UserScoreModel);
                wx.setStorageSync('shangHaiSubjectArr', that.data.shangHaiSubjectArr);
              } catch (e) {
              };
              wx.setStorage({
                key: "shareRecommend",
                data: false
              });
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              });
              that.setData({ commonTuijian: false });
            } else {
              wx.hideLoading();
              wx.showToast({
                title: res.Message,
                icon: 'none',
                duration: 1500
              })
              that.setData({ commonTuijian: false });
            }
          })
        }
      }
    } catch (e) {
    }
  },
  swichNav: function (e) {
    const that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  change: function (e) {
    const that = this;
    that.setData({ currentTab: e.detail.current });
  },
  chooseCourse: function (e) {
    const that = this;
    that.setData({
      courseType: e.currentTarget.dataset.course,
      xianChaFen: null,
      lineGapMax: app.getLineGapMax(that.data.GaoKaoTotal, that.data.xianChaIndex, e.currentTarget.dataset.course)
    });

  },
  bindRegionHistory: function (e) {   //选历史
    var history = e.detail.value
    var historyValue = this.data.history[history]
    this.setData({
      historyIndex: history,
      historyValue: historyValue
    })
  },
  bindRegionKemu: function (e) {   //选科目
    var val = e.detail.value
    var kemuValue = this.data.kemu[0][val[0]]
    var politicsValue = this.data.kemu[1][val[1]]
    console.log(kemuValue)
    console.log(politicsValue)
    console.log(val[1])
    console.log("出错点-bindRegionKemu");

    this.setData({
      kemuIndex: val,
      kemuValue: kemuValue,
      politicsValue: politicsValue,
    })
  },
  bindRegionXianCha: function (e) {  //选线差本一批、本二批、专科批
    const that = this;
    const xianCha = e.detail.value;
    console.log(that.data.GaoKaoTotal, xianCha, that.data.courseType);
    that.setData({
      xianChaIndex: xianCha,
      batch: that.data.batchId[xianCha],
      xianChaFen: null,
      lineGapMax: app.getLineGapMax(that.data.GaoKaoTotal, xianCha, that.data.courseType)
    })
  },
  enterInputJS: function (e) {   //获取input中值
    // xianChaFen   线差分
    // getFen   总分
    // getFen  上海总分  weiFen  上海位次
    // getFen  浙江总分  weiFen  浙江位次
    var that = this;
    var gaokaoTotal = that.data.GaoKaoTotal;
    var xianChaIndex = that.data.xianChaIndex;
    const courseType = that.data.courseType;
    var fentype = e.currentTarget.dataset.type;
    const lineGapMax = app.getLineGapMax(gaokaoTotal, xianChaIndex, courseType);
    var value = e.detail.value;
    if (fentype == 'getFen') {
      that.setData({
        getFen: value,
      })
    };
    if (fentype == 'xianChaFen') {
      if (xianChaIndex == '0') {
        if (courseType == 1) {  //文科
          that.setData({ getFen: (parseInt(value) + parseInt(gaokaoTotal[0].PrvModel[xianChaIndex].ArtsScore)), xianChaFen: parseInt(value) })
          if (value <= lineGapMax && value >= 0) {
          } else {
            // that.xianChaError = true;
            // wx.showToast({
            //   title: "线差分应为 0-" + lineGapMax,
            //   icon: 'none',
            //   duration: 1500
            // })
            // setTimeout(function () { that.setData({ tishiFlag: false }) }, 2000)
          }
        } else if (courseType == 0) {  //理科
          that.setData({ getFen: (parseInt(value) + parseInt(gaokaoTotal[0].PrvModel[xianChaIndex].SciencesScore)), xianChaFen: parseInt(value) })
          if (value <= lineGapMax && value >= 0) {
          } else {
            // that.xianChaError = true;
            // wx.showToast({
            //   title: "线差分应为 0-" + lineGapMax,
            //   icon: 'none',
            //   duration: 1500
            // })
            // setTimeout(function () { that.setData({ tishiFlag: false }) }, 2000)
          }
        }
      } else {
        if (courseType == 1) {  // 文科
          that.setData({ getFen: (parseInt(value) + parseInt(gaokaoTotal[0].PrvModel[xianChaIndex].ArtsScore)), xianChaFen: parseInt(value) })
          if (value <= lineGapMax && value >= 0) {

          } else {
            // that.xianChaError = true;
            // wx.showToast({
            //   title: "线差分应为 0-" + lineGapMax,
            //   icon: 'none',
            //   duration: 1500
            // })
            // setTimeout(function () { that.setData({ tishiFlag: false }) }, 2000)
          }

        } else if (courseType == 0) {//理科
          that.setData({ getFen: (parseInt(value) + parseInt(gaokaoTotal[0].PrvModel[xianChaIndex].SciencesScore)), xianChaFen: parseInt(value) })
          if (value <= lineGapMax && value >= 0) { } else {
            // that.xianChaError = true;
            // wx.showToast({
            //   title: "线差分应为 0-" + lineGapMax,
            //   icon: 'none',
            //   duration: 1500
            // })
            // setTimeout(function () { that.setData({ tishiFlag: false }) }, 2000)
          }
        }
      }
    }
    if (fentype == 'weiFen') {
      that.setData({
        weiFen: value,
      })
    }
  },
})