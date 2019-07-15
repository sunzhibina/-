var api = require('../../utils/api.js');
var app = getApp();
Page({
  data: {
    btnCheckedFlag: false,
    wrapAnimate: false,
    findCard: false,
    focus1: true,
    focus2: false,
    cardNameFlag: false,
    cardPasswordFlag: false,
    color: null,
    Telephone: '',
    cardName: '',
    cardPassword: '',
    mobile: '',
    show1: false,
    show2: false,
    userInfo: []
  },
  windowCloseTap() {
    const that = this;
    that.setData({
      findCard: false,
      wrapAnimate: "wrapAnimateOut"
    })
  },
  findCardTap() {
    const that = this;
    that.setData({
      findCard: true,
      wrapAnimate: "wrapAnimate"
    })
  },
  buyCardTap() {
    const that = this;
    wx.redirectTo({
      url: '/packages/paySystem/memberCardDetail/memberCardDetail'
    })
  },
  onLoad(options) {
    const that = this;
    try {
      const userInfo = wx.getStorageSync('userInfo');
      that.selectComponent("#navigationcustom").setNavigationAll("激活会员卡", true);
      if (userInfo) {
        that.setData({
          userInfo: userInfo
        });
        if (userInfo[0].MobilePhone == '') {

        } else {
          var mobile = userInfo[0].MobilePhone;
          mobile = mobile.replace(mobile.substring(3, 7), '****');
          that.setData({
            mobile: mobile
          })
        }
      }
    } catch (e) { }
  },
  loadUserInfo(UserId) {
    api.getUserById('v2/getUserById?userId=' + UserId, 'GET').then(res => {
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
        wx.setStorageSync("userScore", res.Results[0].UserScore);
        wx.reLaunch({
          url: '../index/index',
        });
      } else {
        wx.reLaunch({
          url: '../index/index',
        });
      }
    })
  },
  undapeCard() {
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      btnCheckedFlag: true
    });
    var CardNo = that.data.cardName;
    var CardPassword = that.data.cardPassword;
    var UserId = that.data.userInfo[0].id;
    let sourceSign = app.globalData.system;
    api.bindCard('Users/UserBindCard', 'POST', CardNo, CardPassword, UserId, sourceSign).then(res => {
      wx.hideNavigationBarLoading();

      if (res.isSuccess) {
        that.getUserBrief(that.data.userInfo[0].UserId, true)
      } else {
        that.setData({
          btnCheckedFlag: false
        });
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
      // if (res.Results.length > 0) {
      //   if (res.Results[0] == "1") {
      //     that.loadUserInfo(UserId);
      //   } else if (res.Results[0] == "2") {
      //     wx.redirectTo({
      //       url: '../mobile/mobile?CardNo=' + CardNo + '&CardPassword=' + CardPassword,
      //     })
      //   } else {
      //     var userInfo = that.data.userInfo;
      //     var mobile = res.Results[0];
      //     mobile = mobile.replace(mobile.substring(3, 7), '****');
      //     if (userInfo[0].MobilePhone == null) {
      //       wx.showModal({
      //         title: '该卡号已绑定过手机号',
      //         content: mobile + '\n（若该手机号属于本人，请直接绑定）',
      //         cancelText: '再想想',
      //         confirmText: '绑定手机',
      //         success: function(res) {
      //           if (res.confirm) {
      //             wx.redirectTo({
      //               url: '../mobile/mobile',
      //             })
      //           } else if (res.cancel) {}
      //         }
      //       })
      //     } else {
      //       if (userInfo[0].MobilePhone != res.Results[0]) {
      //         wx.showModal({
      //           title: '该卡号已绑定过手机号',
      //           content: mobile,
      //           confirmText: '知道了',
      //           showCancel: false,
      //           success: function(res) {
      //             if (res.confirm) {}
      //           }
      //         })
      //       } else {
      //         that.loadUserInfo(UserId);
      //       }
      //     }
      //   }
      // } else {
      //   if (res.Message == "会员卡不存在，请检查卡号或密码" || res.Message == "会员卡密码有误") {
      //     wx.showToast({
      //       title: res.Message,
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   } else {
      //     wx.showToast({
      //       title: res.Message,
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   }
      // }
    })
  },
  cardhao(e) {
    var that = this;
    that.setData({
      cardName: e.detail.value
    });
    if (e.detail.value.length > 0) {
      that.setData({
        show1: true
      })
    } else {
      that.setData({
        show1: false
      })
    }
  },
  pressword(e) {
    var that = this;
    that.setData({
      cardPassword: e.detail.value
    });
    if (e.detail.value.length > 0) {
      that.setData({
        show2: true
      })
    } else {
      that.setData({
        show2: false
      })
    }
  },
  photoCall() {
    wx.makePhoneCall({
      phoneNumber: '400-181-5008'
    })
  },
  focusInput(e) {
    const that = this;
    if (e.target.dataset.id == "1") {
      that.setData({
        cardNameFlag: true
      })
    } else if (e.target.dataset.id == "2") {
      that.setData({
        cardPasswordFlag: true
      })
    }
  },
  blurInput(e) {
    const that = this;
    if (e.target.dataset.id == "1") {
      that.setData({
        cardNameFlag: false
      })
    } else if (e.target.dataset.id == "2") {
      that.setData({
        cardPasswordFlag: false
      })
    }
  },
  detailValue(e) {
    const that = this;
    if (e.currentTarget.dataset.id == "1") {
      that.setData({
        cardName: '',
        focus1: true
      })
    } else if (e.currentTarget.dataset.id == "2") {
      that.setData({
        cardPassword: '',
        focus2: true
      })
    }
  },
  //获取用户信息
  getUserBrief(UserId, isFillAreaName) {
    const that = this;
    api.getUserBrief('Users/GetBrief', 'POST', UserId, isFillAreaName).then(res => {
      if (res.isSuccess) {
        var userArr = [];
        var result = res.result;
        userArr.push({
          "secretName": result.secretName || null,
          "MobilePhone": result.mobilePhone || null,
          "id": result.id, //改
          "userName": result.numId || null,
          "UserId": result.numId || null, //改
          "identityExpirationTime": result.identityExpirationTime || null,
          "avatarUrl": result.avatarUrl || null,
          "gender": result.gender,
          "Province": result.provinceId || null,
          "ProvinceName": result.provinceName || null,
          "City": result.cityId || null,
          "courseType": result.courseType,
          "County": result.countyName || null,
          "UserType": result.userPermissionId || null, //改
          "UserScoreCount": result.UserScoreCount || null,
          "IsGaokao": result.IsGaokao || null,
          "IsTestAccount": result.IsTestAccount || null,
          "SchoolId": result.SchoolId || "",
          "GKYear": result.gkYear || null,
          "UserPermissionProvince": result.UserPermissionProvince || null
        })
        //设定用户信息缓存
        wx.setStorageSync("userInfo", userArr);
        that.setData({
          btnCheckedFlag: false
        });
        wx.showToast({
          title: '会员卡已激活',
          icon: 'none'
        })
        wx.navigateBack({
          detal: 1
        })
      } else {

      }
    })
  },
})