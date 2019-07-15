const app = getApp();
Component({
  properties: {
    top: {
      type: String,
      value: app.globalData.navigationCustomStatusHeight +app.globalData.navigationCustomCapsuleHeight+100,
    },
    type:{
      type: String,
      value: '',
    }
  },
  data: {
    flag: true,
    wrapAnimate: 'wrapAnimate',
    bgOpacity: 0,
    menuAnimate: 'menuAnimate',
  },
  methods: {
    hideMenu(e) {
      const that = this;
      that.setData({ wrapAnimate: 'wrapAnimateOut', menuAnimate: 'menuAnimateOut' });
      setTimeout(() => {
        that.setData({ flag: false })
      }, 400)
    },
    catchNone() {
      //阻止冒泡
      console.log("zuzhi");
    },
    _hideEvent(e) {
      this.triggerEvent("hideEvent", e.currentTarget.dataset.type);
    }
  }
})