var app = getApp();
import api from '../../utils/api.js';




Page({
  options: {},
  cityId: 0,
  courseTapFlag: 0,
  yearIndex: 0,
  cityIndex: -1,
  course: -1,
  disabledBtn: false,

  data: {
    courseFlag: false,
    frameProvinceTitle: "请选择高考省份",
    frameModalTitle: "高考信息",
    yearFrameTitle: "请选择高考年份",
    GKYear: "2019（目前高三）",
    btnBColor: "",
    wrapAnimate: "",
    cityListShow: false,
    GKProvince: "无法定位 请点击选择",
    courseId: -1,
    subject: true,
    comfirmData: {
      "province": "",
      "year": "",
      "course": ""
    },
    cityList: [
      { name: "A 安徽", id: 844, checked: false },
      { name: "B 北京", id: 834, checked: false },
      { name: "C 重庆", id: 854, checked: false },
      { name: "F 福建", id: 845, checked: false },
      { name: "G 广东", id: 851, checked: false }, { name: "G 广西", id: 852, checked: false }, { name: "G 贵州", id: 856, checked: false }, { name: "G 甘肃", id: 860, checked: false },
      { name: "H 海南", id: 853, checked: false }, { name: "H 河南", id: 848, checked: false }, { name: "H 黑龙江", id: 841, checked: false }, { name: "H 湖北", id: 849, checked: false }, { name: "H 湖南", id: 850, checked: false }, { name: "H 河北", id: 1128, checked: false },
      { name: "J 江苏", id: 1, checked: false }, { name: "J 吉林", id: 840, checked: false }, { name: "J 江西", id: 846, checked: false },
      { name: "L 辽宁", id: 839, checked: false },
      { name: "N 宁夏", id: 862, checked: false }, { name: "N 内蒙古", id: 838, checked: false },
      { name: "Q 青海", id: 861, checked: false },
      { name: "S 上海", id: 842, checked: false }, { name: "S 山东", id: 847, checked: false }, { name: "S 山西", id: 837, checked: false }, { name: "S 陕西", id: 859, checked: false }, { name: "S 四川", id: 855, checked: false },
      { name: "T 天津", id: 835, checked: false },
      { name: "X 新疆", id: 1120, checked: false }, { name: "X 西藏", id: 858, checked: false },
      { name: "Y 云南", id: 857, checked: false },
      { name: "Z 浙江", id: 843, checked: false },
    ],
    GKYearList: [],
    studentCourseBColor1: "",
    studentCourseBColor2: "",
    studentCourseFColor1: "",
    studentCourseFColor2: "",
    GKYearFColor: "",
    studentCourse: ["文科", "理科"],
    userInfo: [],
    serverfail: false,
    GKWanshan: false,
    showLoad: true,
    team1: true,
    team2: false,
    team3: false,
    team4: false,
    team5: false,
    provinceflag: true,
    schoolflag: true,
    yearflag: true,
    sexflag: true,
    province: [],
    value1: [0, 0, 0],
    school: [{ Name: "请选择高中院校" }],
    value2: [0],
    year: [],
    value3: [0],
    sex: ['男', '女'],
    value4: [0],
    userid: null,
    provinceName: null,
    provinceId: null,//省
    cityId: null,//市
    countryId: null,//区
    schoolId: null,//学校
    isGaoKao: null,//高考年份
    usersex: null,//性别
  },
  //点击确认修改
  confirmBtnTap: function () {
    const that = this;
    var examYear = that.data.GKYearList[that.yearIndex].year;
    that.setData({
      loadingConfirm: true
    })
    setTimeout(function () {
      that.setData({
        loadingConfirm: false
      })
    }, 500)
    that.updateUserGaoKaoInfo(that.options.id, that.cityId.cityId, examYear, that.data.courseId);
  },
  onShow: function () {
    app.resetOnce(this, "oneclick")
  },
  //二次确认弹窗消失
  hideModalFrame: function () {
    this.selectComponent("#framemodal").hideFrame();
  },
  yearTap: function (e) {
    const that = this;
    that.yearIndex = e.currentTarget.id;
    that.selectComponent("#frameyear").hideFrame();
    that.setData({
      GKYear: that.data.GKYearList[that.yearIndex].text
    })
  },
  //点击高考年份选择
  showYearTap: function (e) {
    const that = this;
    that.selectComponent("#frameyear").showFrame();
  },
  //年份列表弹窗消失

  hideYearFrame: function () {
    const that = this;
    that.selectComponent("#frameyear").hideFrame();
  },
  ///Users/UpdateGaoKaoInfo
  //修改用户高考信息
  updateUserGaoKaoInfo: function (id, provinceNumId, examYear, couseType) {
    const that = this;
    api.updateUserGaoKaoInfo('Users/UpdateGaoKaoInfo', 'POST', id, provinceNumId, examYear, couseType).then(res => {
      if (res.result == "True") {
        //完善成功
        wx.switchTab({
          url: '/pages/index/index',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        wx.setStorageSync('cityId', that.cityId);
        that.selectComponent("#framemodal").hideFrame();

      } else {
        //失败
      }
    })
  },
  chooseCourseTap: function (e) {
    const that = this;
    that.courseTapFlag = true;
    if (e.currentTarget.id == that.data.courseId) {
      return
    }
    that.setData({
      courseId: e.currentTarget.id
    })
    that.checkButton();
  },
  //检测按钮可用
  checkButton: function () {
    const that = this;
    //#e9302d
    if (app.checkNewGaoKao(that.cityId.cityId)) {
      //新高考
      that.disabledBtn = false;
      that.setData({

        courseFlag: false
      });

    } else {
      //传统版
      if (that.data.courseId > -1) {
        //btnBColor
        that.disabledBtn = false;

        that.setData({
          courseFlag: true
        });
      } else {
        that.disabledBtn = true;

        that.setData({
          // btnBColor: "",
          courseFlag: true
        });
      }
    }

  },

  windowCloseTap: function () {
    this.wrapTap();
  },
  wrapTap: function () {
    const that = this;
    that.setData({
      wrapAnimate: "wrapAnimateOut",
      cityListShow: false
    })
  },
  /**点击城市
   * 
   */
  chooseCityTap: function (e) {
    const that = this;
    var index = e.currentTarget.id;
    var tmpData = {
      course: -1,
      GKProvince: that.data.cityList[index].name.substr(2)
    }
    that.cityIndex = index;
    that.cityId = { cityId: that.data.cityList[index].id, provinceName: tmpData.GKProvince }
    console.log(" that.cityId=", that.cityId);
    // if (that.cityId.cityId == "842" || that.cityId.cityId == "843") {
    //   tmpData.course = -1
    // } else {
    //   tmpData.course = true
    // }

    that.selectComponent("#frameprovince").hideFrame();
    that.setData(tmpData)
    that.checkButton();
  },
  //省份选择
  provinceTap: function () {
    // const that = this;
    // that.setData({
    //   cityListShow: true,
    //   wrapAnimate: "wrapAnimate"
    // })
    const that = this;
    that.selectComponent("#frameprovince").showFrame();

  },

  completeBtnTap: function () {
    const that = this;
    //id, examYear, couseType
    var examYear = that.data.GKYearList[that.yearIndex].year;
    //GKProvince
    var comfirmData = {
      year: examYear
    };
    if (that.data.GKProvince == "无法定位 请点击选择") {
      wx.showToast({
        title: '请选择高考省份',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (that.disabledBtn) {
      wx.showToast({
        title: '请选择考生科类',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (that.cityId.cityId == 842 || that.cityId.cityId == 834 || that.cityId.cityId == 854 || that.cityId.cityId == 835) {
      //： 北京 上海 天津 重庆
      comfirmData.province = that.data.GKProvince + "市";
    } else {
      comfirmData.province = that.data.GKProvince + "省";

    }
    if (that.cityId.cityId == "842" || that.cityId.cityId == "843") {
      comfirmData.course = "";
    } else {
      if (that.data.courseId == 0) {
        comfirmData.course = "理科";

      } else if (that.data.courseId == 1) {
        comfirmData.course = "文科";
      }
      // comfirmData.province = that.data.GKProvince + "省";
    }
    that.setData({
      comfirmData: comfirmData,
      loadingBtn: true
    })

    that.selectComponent("#framemodal").showFrame();
    setTimeout(function () {
      that.setData({
        loadingBtn: false
      })
    }, 500)

  },
  _confirmEvent: function () {
    var that = this;
    this.setData({ showLoad: true, serverfail: false });
    if (this.data.team1 == true) {
      var provinceId = that.data.userInfo[0].Province.Id;
      api.getProvinces('common/areas/getProvinces', 'GET').then(res => {
        if (res.Code && res.Code == 1) {
          var provinceArr = [];
          for (var i = 0; i < res.Results.length; i++) {
            if (res.Results[i].Id == provinceId) {
              that.setData({
                province: res.Results[i]
              })
              break;
            }
          }
          that.setData({ showLoad: false })
        } else {
          that.setData({ serverfail: true, showLoad: false });
          return;
        }
      })
    } else {
      api.getSchool('common/areas/getAreas?parentId=' + that.data.province.City[that.data.value1[1]].County[that.data.value1[2]].Id, 'GET').then(res => {
        if (res.Code && res.Code == 1) {
          that.setData({ school: res.Results, showLoad: false })
        } else {
          that.setData({ serverfail: true, showLoad: false });
          return;
        }
      })
    }
  },
  ////////////////////////////////////////////
  onLoad: function (options) {
    var that = this;
    var userid = options.userId;
    that.selectComponent("#navigationcustom").setNavigationAll("", false);
    // that.setData({ userid: userid });
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var yearArr = [];
    wx.getSetting({
      success(res) {
        //
        console.log("getSetting-res=", res)
        if (res.authSetting && !res.authSetting['scope.userLocation']) {
          console.log("同意了定位1");
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              console.log("同意了定位2");

              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  console.log("同意了定位3res,", res);
                  //res.latitude, res.longitude
                  if (res.latitude > 0 && res.longitude > 0) {
                    api.baiduMapGeocoder('Baidu/Map/Geocoder', 'POST', res.latitude, res.longitude).then(res => {
                      if (res.result) {
                        var cityName = res.result.provinceName
                        for (var i in that.data.cityList) {
                          if (res.result.provinceId == that.data.cityList[i].id) {
                            that.cityIndex = i;
                          }
                        }
                        cityName = cityName.replace("市", "");
                        cityName = cityName.replace("省", "");
                        that.cityId = { cityId: res.result.provinceId, provinceName: cityName }
                        var courseFlag = false;
                        if (app.checkNewGaoKao(that.cityId.cityId)) {

                        } else {

                          courseFlag = true

                        }
                        that.setData({
                          GKProvince: cityName,
                          courseFlag: courseFlag
                        })
                        // if (res.data.result && res.data.result.addressComponent && res.data.result.addressComponent.province) {
                        // } else {
                        //   
                        // }
                        //  that.setData({ showLoad: false })
                      } else {
                        that.setData({
                          GKProvince: "无法定位 请点击选择"
                        })
                      }
                    })
                  } else {
                    that.setData({
                      GKProvince: "无法定位 请点击选择"
                    })
                  }
                }, fail: function () {
                  //无法定位 请点击选择
                  that.setData({
                    GKProvince: "无法定位 请点击选择"
                  })
                }
              })
            },
            fail: function () {
              that.setData({
                GKProvince: "无法定位 请点击选择"
              })
            }
          })
        } else {
          that.setData({
            GKProvince: "无法定位 请点击选择"
          })
        }
      }
    })
    if (options)
      that.options = options
    for (var i = 0; i < 4; i++) {
      var yearArrSingle = {};
      //month = 9
      if (month > 7) {
        if ((year + i) == year) {
          yearArrSingle = {
            year: (year + 1 + i),
            checked: false,
            text: year + 1 + i + "（目前高三）"
          }
          yearArr.push(yearArrSingle);
        } else if ((year + i) == year + 1) {
          yearArrSingle = {
            year: (year + 1 + i),
            checked: false,
            text: year + 1 + i + "（目前高二）"
          }
          yearArr.push(yearArrSingle);
        } else if ((year + i) == year + 2) {
          yearArrSingle = {
            year: (year + 1 + i),
            checked: false,
            text: year + 1 + i + "（目前高一）"

          }
          yearArr.push(yearArrSingle);
        } else {
          yearArrSingle = {
            year: (year + 1 + i),
            checked: false,
            text: year + 1 + i + "（目前初三）"

          }
          yearArr.push(yearArrSingle);
        }
      } else {
        if ((year + i) == year) {
          yearArrSingle = {
            year: (year + i),
            checked: false,
            text: year + i + "（目前高三）"

          }
          yearArr.push(yearArrSingle);
        }
        else if ((year + i) == year + 1) {
          yearArrSingle = {
            year: (year + i),
            checked: false,
            text: year + i + "（目前高二）"

          }
          yearArr.push(yearArrSingle);
        }
        else if ((year + i) == year + 2) {
          yearArrSingle = {
            year: (year + i),
            checked: false,
            text: year + i + "（目前高一）"

          }
          yearArr.push(yearArrSingle);
        }
        else {
          yearArrSingle = {
            year: (year + i),
            checked: false,
            text: year + i + "（目前初三）"
          }
          yearArr.push(yearArrSingle);
        }
      }
    }
    that.setData({
      GKYearList: yearArr,
      GKYear: yearArr[0].text
    });

    // that.checkButton();
  },
  item1: function () {
    this.setData({ provinceflag: !(this.data.provinceflag) })
  },
  item2: function () {
    var that = this;
    var value1 = that.data.value1;
    this.setData({ schoolflag: !(this.data.schoolflag) });
  },
  item3: function () {
    this.setData({ yearflag: !(this.data.yearflag) })
  },

  wanshanbtn4: function () {
    var that = this;
    this.setData({ usersex: that.data.sex[that.data.value4[0]] });
    var usersex = that.data.usersex == '男' ? 1 : 0;
    // var course = parseInt(that.data.course);
    api.wanshanUser('v2/setExperienceUser', 'POST', that.data.userid, that.data.provinceId, that.data.cityId, that.data.countryId, that.data.schoolId, that.data.isGaoKao, usersex).then(res => {
      // 成功后
      api.getUserById('v2/getUserById?userId=' + that.data.userid, 'GET').then(res => {
        var userArr = [];
        userArr.push({ "MobilePhone": res.Results[0].User.MobilePhone ? res.Results[0].User.MobilePhone : null, "UserId": res.Results[0].User.Id, "Province": res.Results[0].User.Province ? res.Results[0].User.Province : null, "City": res.Results[0].User.City ? res.Results[0].User.City : null, "County": res.Results[0].User.County ? res.Results[0].User.County : null, "UserType": res.Results[0].UserType, "UserScoreCount": res.Results[0].UserScoreCount, "IsGaokao": res.Results[0].IsGaokao, "IsTestAccount": res.Results[0].User.IsTestAccount, "SchoolId": res.Results[0].User.SchoolId, "GKYear": res.Results[0].User.GKYear, "UserPermissionProvince": res.Results[0].User.UserPermissionProvince })
        wx.setStorageSync("sex", res.Results[0].User.Gender);
        wx.setStorageSync("userInfo", userArr);
        try {
          var payAddress = wx.getStorageSync('payAddress');
          if (payAddress) {
            wx.reLaunch({
              url: '../payAddress/payAddress',
            })
          } else {
            if (that.data.GKWanshan == "true") {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.reLaunch({
                url: '../index/index',
              })
            }
          }
        } catch (e) {
        }
      })
    })
  },
  // onPullDownRefresh:function(){
  //   var that = this;
  //   var userId = that.data.userid;
  //   api.getUserById('v2/getUserById?userId='+userId, 'GET').then(res => {
  //     if (res.Results[0].UserType >= 3 && res.Results[0].User.SchoolId == 0){
  //       wx.stopPullDownRefresh();
  //     }else{
  //       var userArr = [];
  //       userArr.push({ "MobilePhone": res.Results[0].User.MobilePhone ? res.Results[0].User.MobilePhone : null, "UserId": res.Results[0].User.Id, "Province": res.Results[0].User.Province ? res.Results[0].User.Province : null, "City": res.Results[0].User.City ? res.Results[0].User.City : null, "County": res.Results[0].User.County ? res.Results[0].User.County : null, "UserType": res.Results[0].UserType, "UserScoreCount": res.Results[0].UserScoreCount, "IsGaokao": res.Results[0].IsGaokao, "IsTestAccount": res.Results[0].User.IsTestAccount, "SchoolId": res.Results[0].User.SchoolId, "GKYear": res.Results[0].User.GKYear, "UserPermissionProvince": res.Results[0].User.UserPermissionProvince });
  //       wx.setStorageSync("userInfo", userArr);
  //       wx.reLaunch({
  //         url: '../index/index',
  //       })
  //     }
  //   })
  // },
  chooseCourse: function (e) {
    this.setData({ course: e.currentTarget.dataset.id });
  }
})