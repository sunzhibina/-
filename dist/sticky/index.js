"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
  _classNames = _interopRequireDefault(require("../helpers/classNames"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}(0, _baseComponent.default)({
  relations: {
    "../sticky-item/index": {
      type: "child",
      observer: function() {
        this.debounce(this.updated)
      }
    }
  },
  properties: {
    prefixCls: {
      type: String,
      value: "wux-sticky"
    },
    scrollTop: {
      type: Number,
      value: 0,
      observer: "onScroll"
    }
  },
  computed: {
    classes: ["prefixCls", function(e) {
      return {
        wrap: (0, _classNames.default)(e)
      }
    }]
  },
  methods: {
    onScroll: function(e) {
      var o = 0 < arguments.length && void 0 !== e ? e : this.data.scrollTop,
        t = this.getRelationNodes("../sticky-item/index");
      0 < t.length && t.forEach(function(e, t) {
        e.onScroll(o)
      })
    },
    updated: function() {
      var e = this.getRelationNodes("../sticky-item/index");
      0 < e.length && e.forEach(function(e, t) {
        e.updated(t)
      })
    }
  }
});