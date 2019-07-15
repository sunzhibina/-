// components/shareButton/shareButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    buttonText: {
      type: String,
      value: '',
    },
    loadingBtn:{
      //loadingBtn
      type: Boolean,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _addFormid: function (e) {
      console.log("_addFormid===", e)
      this.triggerEvent("addFormid", e)
    }
  }
})
