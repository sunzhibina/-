
Component({
  properties: {

  },
  data: {
    flag:false,
    wrapAnimate:'',
    bgOpacity:0,
    frameAnimate:'',
  },
  properties: {
    frameTitle: {
      type: String,
      value: '标题',
    }
  },
  
  methods: {
    catchMove(){
    },
    showFrame() {
      this.setData({ flag: true, wrapAnimate: 'wrapAnimate', frameAnimate: 'frameAnimate' });
    },
    hideFrame() {
      const that= this;
      that.setData({ wrapAnimate: 'wrapAnimateOut', frameAnimate: 'frameAnimateOut' });
      setTimeout(()=>{
        that.setData({ flag: false})
      },400)
    },
    catchNone(){
      //阻止冒泡
    },
    _showEvent() {
      this.triggerEvent("showEvent");
    },
    _hideEvent() {
      this.triggerEvent("hideEvent");
    }

  }
})
