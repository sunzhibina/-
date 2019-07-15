var api = require('../../utils/api.js')
Page({
  data: {
    departmentList: [],
    showList: true,
    id: null
  },
  openDepList: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({ id: id })
  },
  onLoad: function (options) {
    var id = options.id
    const that = this;
    that.selectComponent("#navigationcustom").setNavigationAll("院系设置", true);
    api.getCollegeDep('Colleges/getCollegeDepartment?collegeId=' + id, 'GET').then(res => {
      that.setData({ departmentList: res.Results[0] })
    })
  }
})