// components/popup.js
var formidArrOld = [];
var formidArr = [];
Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
     * 组件的属性列表
     */
  properties: {
    popupText: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },


    shareButtonText: {
      type: String,
      value: '',
    },
    statusText: {
      type: String,
      value: '',
    },
    bargainPrice: {
      type: Number,
      value: '',
    },

    title: {
      type: String,
      value: '',
    },
    popupType: {
      type: String,
      //dialog、
      value: ''
    },

    popupContent: {
      type: Array,
      value: ''
    },
    //    
    showPopupFlag: {
      type: Boolean,
      value: false
    },

    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    wrapAnimateMajor: "wrapAnimate",
    bgOpacityMajor: 0,
    showPopupFlag: true,
    bargainGetStatus: "",
    popupAnimateMajor: "popupAnimate",
  },

  /**
   * 组件的方法列表
   */
  methods: {

    addFormid(e) {
      if (e.detail.formId == "the formId is a mock one") {
        formidArrOld.push('')
      } else {
        formidArrOld.push(e.detail.formId)
      }
      // formidArr = formidArr.join(',');
      while (formidArrOld.length == 5) {
        formidArr = formidArrOld.join(',')
        // this.shareJoin()
        formidArrOld = []
        // return formidArr;
      }
    },
    returnFormid() {
      return formidArr;
    },
    ///////////////
    _showTap() {
      this.setData({
        wrapAnimateMajor: "wrapAnimate",
        bgOpacityMajor: 0,
        showPopupFlag: true,
        popupAnimateMajor: "popupAnimate",
      })
    },

    _hideTap: function () {
      this.triggerEvent("hideTapPage")
    },


    hidePopupFunc: function () {
      this.setData({
        wrapAnimateMajor: "wrapAnimateOut",
        bgOpacityMajor: 0.7,
        popupAnimateMajor: "popupAnimateOut",
      })
      setTimeout(() => {
        this.setData({ showPopupFlag: false, })
      }, 200)
    },


    /*
         * 内部私有方法建议以下划线开头
         * triggerEvent 用于触发事件
         */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }

  }
})
