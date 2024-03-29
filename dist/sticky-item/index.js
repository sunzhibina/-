"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
  _classNames2 = _interopRequireDefault(require("../helpers/classNames"));

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}

function _defineProperty(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e
}(0, _baseComponent.default)({
  relations: {
    "../sticky/index": {
      type: "parent"
    }
  },
  properties: {
    prefixCls: {
      type: String,
      value: "wux-sticky-item"
    },
    title: {
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: ""
    }
  },
  data: {
    isFixed: !1,
    index: 0,
    top: 0,
    height: 0
  },
  computed: {
    classes: ["prefixCls, isFixed", function(e, t) {
      return {
        wrap: (0, _classNames2.default)(e, _defineProperty({}, "".concat(e, "--fixed"), t)),
        hd: "".concat(e, "__hd"),
        title: "".concat(e, "__title"),
        bd: "".concat(e, "__bd"),
        content: "".concat(e, "__content")
      }
    }]
  },
  methods: {
    onScroll: function(e) {
      var t = this.getRelationNodes("../sticky/index")[0],
        i = this.data,
        n = i.top,
        a = i.height,
        r = i.index,
        s = n <= e && e < n + a;
      this.data.isFixed !== s && (this.setData({
        isFixed: s
      }), t && t.triggerEvent(s ? "stick" : "unstick", {
        index: r
      }))
    },
    updated: function(t) {
      var i = this,
        e = ".".concat(this.data.prefixCls);
      wx.createSelectorQuery().in(this).select(e).boundingClientRect(function(e) {
        e && i.setData({
          top: e.top,
          height: e.height,
          index: t
        })
      }).exec()
    }
  }
});