var api = require('../../utils/api.js');
const app = getApp();
Page({
  data: {
    bindCheckedFlag: false,
    serverfail: false,
    bindCard: false,
    cityList: [],
    showBtn: false,
    test: false,
    cityId: null,
    userid: null,
    showLoad: true,
    id: null,
    shareuserid: null,
    shareActivityFlag: false
  },
  _confirmEvent: function() {
    this.setData({
      showLoad: true,
      serverfail: false
    });
    this.onLoad();
    this.onShow();
  },
  goInsertInfo() {
    wx.navigateTo({
      url: '/pages/commonWebPage/commonWebPage?typePage=1',
    })
  },
  //Users/Socials/BindMobile
  //Users

  undapeMobile: function() { //更新手机 
    wx.showLoading({
      title: '数据同步加载中',
    });
    var that = this;
    if (that.data.bindCard == true) {
      var Mobile = that.data.getMobile;
      var MobileAuthCode = this.data.yanzhengma;
      var NewPassword = this.data.password;
      var CardNo = that.data.CardNo;
      var CardPassWord = that.data.CardPassword;
      api.bindCardAndMobileByMiniApp('v2/bindCardAndMobileByMiniApp', 'POST', CardNo, CardPassWord, that.data.userid, Mobile, MobileAuthCode, that.data.password, that.data.cityId).then(res => {
        if (res.Results.length > 0) {
          var userArr = [];
          userArr.push({
            "MobilePhone": res.Results[0].User.MobilePhone ? res.Results[0].User.MobilePhone : null,
            "UserId": res.Results[0].User.Id,
            "Province": res.Results[0].User.Province ? res.Results[0].User.Province : null,
            "City": res.Results[0].User.City ? res.Results[0].User.City : null,
            "County": res.Results[0].User.County ? res.Results[0].User.County : null,
            "UserType": res.Results[0].UserType,
            "UserScoreCount": res.Results[0].UserScoreCount,
            "IsGaokao": res.Results[0].IsGaokao,
            "IsTestAccount": res.Results[0].User.IsTestAccount,
            "SchoolId": res.Results[0].User.SchoolId,
            "GKYear": res.Results[0].User.GKYear,
            "UserPermissionProvince": res.Results[0].User.UserPermissionProvince
          });
          wx.setStorageSync("userInfo", userArr);
          wx.reLaunch({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: res.Message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      var userid = this.data.userid;
      var mobilePhone = this.data.getMobile;
      var yanzhengma = this.data.yanzhengma;
      var password = this.data.password;
      api.updateMobile('v2/updateMobile', 'POST', userid, mobilePhone, yanzhengma, password).then(res => {
        if (res.Results.length > 0) {
          var userArr = [];
          userArr.push({
            "MobilePhone": res.Results[0].User.MobilePhone ? res.Results[0].User.MobilePhone : null,
            "UserId": res.Results[0].User.Id,
            "Province": res.Results[0].User.Province ? res.Results[0].User.Province : null,
            "City": res.Results[0].User.City ? res.Results[0].User.City : null,
            "County": res.Results[0].User.County ? res.Results[0].User.County : null,
            "UserType": res.Results[0].UserType,
            "UserScoreCount": res.Results[0].UserScoreCount,
            "IsGaokao": res.Results[0].IsGaokao,
            "IsTestAccount": res.Results[0].User.IsTestAccount,
            "SchoolId": res.Results[0].User.SchoolId,
            "GKYear": res.Results[0].User.GKYear,
            "UserPermissionProvince": res.Results[0].User.UserPermissionProvince
          })
          wx.setStorageSync("userInfo", userArr)
          if (res.Results[0].UserScore != null && res.Results[0].UserScore.Id == 0) {} else {
            wx.setStorageSync("userScore", res.Results[0].UserScore)
          }
          wx.hideLoading()
          wx.reLaunch({
            url: '../index/index',
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.Message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  bindUserMobile: function(openId, socialLoginType, mobile, password, mobileAuthCode, sourceType, accountType, device) {
    const that = this;
    api.bindUserMobile('Users/Socials/BindMobile', 'POST', openId, socialLoginType, mobile, password, mobileAuthCode, sourceType, accountType, device).then(res => {
      if (res.isSuccess) {
        that.setData({
          bindCheckedFlag: false
        });
        wx.switchTab({
          url: '/pages/index/index',
          success: function(res) {
            wx.hideLoading();
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        that.setData({
          showLoad: false,
          bindCheckedFlag: false
        });
      }
    })


  },
  getPhoneNumberFromServer: function(iv, sessionKey, encryptedData) {
    const that = this;

    api.getPhoneNumberFromServer('MiniProgram/DecryptMobile', 'POST', iv, sessionKey, encryptedData).then(res => {
      if (res.result) {
        that.bindUserMobile(app.globalData.openid, 6, res.result, "123456", "", 2, 4, 6);
      } else {
        wx.showToast({
          title: '手机号获取失败，请重新获取',
          icon: 'none'
        })
        that.setData({
          showLoad: false,
          bindCheckedFlag: false
        });
      }
    })
  },
  /**获取手机号 */
  getPhoneNumber: function(e) {
    const that = this;
    that.setData({
      bindCheckedFlag: true
    });
    if (e.detail.encryptedData && e.detail.iv) {
      //同意获取
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      wx.login({
        success: function(res) {
          if (res.code) {
            //发起网络请求
            api.getJsCode2Session('MiniProgram/GetJsCode2Session', 'POST', res.code).then(res => {
              if (res.isSuccess) {
                const sessionKey = res.result.session_key;
                const openid = res.result.openid;
                wx.setStorage({
                  key: "openid",
                  data: openid
                });
                app.globalData.openid = openid;
                that.getPhoneNumberFromServer(iv, sessionKey, encryptedData)
              } else {
                wx.showToast({
                  title: res.message,
                  icon: 'none'
                })
                that.setData({
                  showLoad: false,
                  bindCheckedFlag: false
                });
              }
            })
          } else {}
        }
      })
    } else {
      that.setData({
        bindCheckedFlag: false
      });
      wx.showToast({
        title: '微信授权绑定失败',
        icon:'none'
      })
    }
  },
  onLoad: function(options) {
    const that = this;
    //  var userid = options.userId;
    that.selectComponent("#navigationcustom").setNavigationAll("高考填志愿", false);
    that.setData({
      serverfail: false,
      showLoad: false
    });
    // if (options && options.id && options.shareuserid) {
    //   that.setData({
    //     id: options.id,
    //     shareuserid: options.shareuserid,
    //     shareActivityFlag: true
    //   })
    // };
    // // that.setData({
    // //   userid: userid
    // // });
    // var cityList = [];
    // try {
    //   var chooseCity = wx.getStorageSync('chooseCity');
    //   var chooseCityId = wx.getStorageSync('chooseCityId');
    //   if (chooseCity && chooseCityId) {
    //     for (var i = 0; i < chooseCity.length; i++) {
    //       cityList.push({
    //         "cityName": chooseCity[i],
    //         "cityId": chooseCityId[i],
    //         st: false
    //       })
    //     }
    //     that.setData({
    //       cityList: cityList
    //     })
    //   }
    //} catch (e) { }
  }
})