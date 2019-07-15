// components/rightDrawerMenu/rightDrawerMenu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // navigationText: {
    //   type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    //   value: '优志愿填报', // 属性初始值（可选），如果未指定则会根据类型选择一个
    // },
    // sharePageBack: {
    //   type: Boolean,
    //   value: ""
    // },
    // navigationCustomCapsuleHeight: {
    //   type: Number,
    //   value: ""
    // },
    // navigationCustomStatusHeight: {
    //   type: Number,
    //   value: ""
    // },
    // navigationHome: {
    //   type: Boolean,
    //   value: false
    // },
  },

  /**
   * 组件的初始数据
   */
  data: {
    shaixuan: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _innercatchMaskMove: function () {
      console.log("捕捉移动");
     // this.triggerEvent("catchMaskMove");

    },
    catchMaskMove:function(){
      console.log("捕捉mobv");

    },
    maskClose: function () {
      this.setData({ shaixuan: 'shaixuan-animate-out' });
    },

    _showEvent() {
      this.triggerEvent("shaixuanTap");
    },
    _hideEvent() {
      this.triggerEvent("maskClose");
    },

    shaixuanTap: function () {
      var that = this;
      console.log("点了筛选");
      // var CSBBgColor = that.data.CSBBgColor;
      // for (var i = 0; i < that.data.CSBList.length; i++) {
      //   if (that.data.CSBList[i].CSBBgColor == CSBBgColor) {
      //     that.data.CSBList[i].st = true;
      //   } else {
      //     that.data.CSBList[i].st = false;
      //   }
      // }
      // that.data.morenCityList = JSON.parse(JSON.stringify(that.data.cityList));
      // that.data.morenBatchList = JSON.parse(JSON.stringify(that.data.batchList));
      var tmpsetdata = {
        shaixuan: 'shaixuan-animate',
        flag: true
        // CSBList: that.data.CSBList
      }
      // if (that.data.CSBFlag == 'false') {
      //   that.data.CSBFlag = "true"
      //   tmpsetdata.CSBChong = 'chongHide'
      //   tmpsetdata.CSBShou = 'shouHide'
      //   tmpsetdata.CSBBao = 'baoHide'
      //   tmpsetdata.CSBMoren = 'morenHide'
      // }
      that.setData(tmpsetdata);
    }
  }
})
