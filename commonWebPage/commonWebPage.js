
Page({
  data: {
    url:""
  },
  onLoad: function (options) {
    const that = this;
    switch (options.typePage){
      case "1": that.setData({ url: "https://m.youzy.cn/copyright"});break; //优志愿服务条款
      case "2": that.setData({ url: "https://m.youzy.cn/aboutUs/index" }); break; //关于优志愿
    }
  }
})