Component({
  properties: {
    flag: {
      type: Boolean,
      value: false
    },
    top: {
      type: String,
      value:'10px',
    },
    items: {
      type: Array,
      value: [],
    }
  },
  data: {
   // flag:false,
    dropDownAnimate:''
  },
  methods: {
    toggerDropDown(){
      const that = this;
      if (that.data.flag==false){
        that.setData({ flag: true, dropDownAnimate: 'dropDownAnimate' })
      }else{
        that.setData({ dropDownAnimate: 'dropDownAnimateOut' });
        setTimeout(() => {
          that.setData({ flag: false })
        }, 500)
      }
    },
    _chooseEvent(e) {
      this.triggerEvent("chooseEvent", e.currentTarget.dataset.value);
      this.toggerDropDown();
    }
  }
})
