var api = require('../../utils/api.js');
Page({
  data: {
    bufenLoad: true,
    down: false,
    newClassList: [],
    SubjectId: null,
    navName: '',
    pn: 1,
    showMore: false,
    loadMore: true,
    sortType: 1,
    chooseKetang: [{ name: '语文', SubjectId: 1001 }, { name: '数学', SubjectId: 1002 }, { name: '英语', SubjectId: 1003 }, { name: '物理', SubjectId: 1004 }, { name: '化学', SubjectId: 1005 }, { name: '生物', SubjectId: 1006 }, { name: '政治', SubjectId: 1009 }, { name: '历史', SubjectId: 1007 }, { name: '地理', SubjectId: 1008 }, { name: '志愿讲堂', SubjectId: 0 }, { name: '高考提分', SubjectId: 1 }, { name: '专业解读', SubjectId: 2 }, { name: '大学展播', SubjectId: 3 }]
  },
  loadclassRoomList: function (SubjectId, sortType, pn) {
    var that = this;
    that.setData({ showMore: true, loadMore: true });
    api.searchPacks('App/Videos/Query', 'POST', SubjectId, sortType, pn,).then(res => {
      if (res.result.items.length > 0) {
        that.setData({ newClassList: that.data.newClassList.concat(res.result.items) });
        that.setData({ showMore: false, loadMore: true });
      } else {
        that.setData({ showMore: true, loadMore: false });
      }
      that.setData({ bufenLoad: false })
    })
  },
  onLoad: function (options) {
    var that = this;
    var SubjectId = options.SubjectId;
    var name = options.name;

    var pn = that.data.pn;
    that.selectComponent("#navigationcustom").setNavigationAll("选课中心", true);

    that.setData({ navName: name, SubjectId: SubjectId });
    that.loadclassRoomList(SubjectId, 1, pn);
  },
  scrollToLower: function (e) {  //滚到底部触发加载更多
    var that = this;
    if (that.data.showMore) return;
    that.setData({ pn: that.data.pn + 1 });
    var SubjectId = that.data.SubjectId;
    that.loadclassRoomList(SubjectId, that.data.sortType, that.data.pn);
  },
  chooseClassRoom: function (e) {
    var that = this;
    var SubjectId = e.currentTarget.dataset.subjectid;
    var name = e.currentTarget.dataset.name;
    that.setData({ pn: 1, down: false, newClassList: [], SubjectId: SubjectId, navName: name });
    that.loadclassRoomList(SubjectId, that.data.sortType, 1);
  },
  newChoose: function () {  //最新
    this.setData({ bufenLoad: true });
    var that = this;
    if (that.data.sortType == 1) {
    } else {
      var SubjectId = that.data.SubjectId;
      that.setData({ pn: 1, sortType: 1, newClassList: [], down: false });
      that.loadclassRoomList(SubjectId, 1, 1);
    }
  },
  hotChoose: function () {  //最热
    this.setData({ bufenLoad: true });
    var that = this;
    if (that.data.sortType == 2) {
    } else {
      var SubjectId = that.data.SubjectId;
      that.setData({ pn: 1, sortType: 2, newClassList: [], down: false });
      that.loadclassRoomList(SubjectId, 2, 1);
    }
  },
  chooseKetang: function () {  //第一选项选课
    this.setData({ down: !(this.data.down) })
  },
  hideKetang: function () {  //点击底部隐藏选课
    this.setData({ down: !(this.data.down) })
  }
})