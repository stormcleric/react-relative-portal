'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _exenv = require('exenv');

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var listeners = {};

function fireListeners() {
  Object.keys(listeners).forEach(function (key) {
    return listeners[key]();
  });
}

function getPageOffset() {
  return {
    x: window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
  };
}

if (_exenv.canUseDOM) {	
  if (document != null && document != undefined && document.body != null && document.body != undefined){ document.body.addEventListener('mousewheel', (0, _debounce2.default)(fireListeners, 100, true)); }
  window.addEventListener('resize', (0, _debounce2.default)(fireListeners, 50, true));
}

var listenerIdCounter = 0;
function subscribe(fn) {
  listenerIdCounter += 1;
  var id = listenerIdCounter;
  listeners[id] = fn;
  return function () {
    return delete listeners[id];
  };
}

var RelativePortal = function (_React$Component) {
  _inherits(RelativePortal, _React$Component);

  function RelativePortal() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, RelativePortal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(RelativePortal)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
      right: 0,
      left: 0,
      top: 0
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RelativePortal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.handleScroll = function () {
        if (_this2.element) {
          var rect = _this2.element.getBoundingClientRect();
          var pageOffset = getPageOffset();
          var top = pageOffset.y + rect.top;
          var right = window.innerWidth - rect.right + pageOffset.x;
          var left = pageOffset.x + rect.left;

          if (top !== _this2.state.top || left !== _this2.state.left || right !== _this2.state.right) {
            _this2.setState({ left: left, top: top, right: right });
          }
        }
      };
      this.unsubscribe = subscribe(this.handleScroll);
      this.handleScroll();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.handleScroll();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var Comp = _props.component;
      var top = _props.top;
      var left = _props.left;
      var right = _props.right;
      var fullWidth = _props.fullWidth;

      var props = _objectWithoutProperties(_props, ['component', 'top', 'left', 'right', 'fullWidth']);

      var fromLeftOrRight = right !== undefined ? { right: this.state.right + right } : { left: this.state.left + left };

      var horizontalPosition = fullWidth ? { right: this.state.right + right, left: this.state.left + left } : fromLeftOrRight;

      return _react2.default.createElement(
        Comp,
        {
          ref: function ref(element) {
            _this3.element = element;
          }
        },
        _react2.default.createElement(
          _Portal2.default,
          props,
          _react2.default.createElement(
            'div',
            {
              style: _extends({
                position: 'absolute',
                top: this.state.top + top
              }, horizontalPosition)
            },
            this.props.children
          )
        )
      );
    }
  }]);

  return RelativePortal;
}(_react2.default.Component);

RelativePortal.propTypes = {
  right: _react.PropTypes.number,
  left: _react.PropTypes.number,
  fullWidth: _react.PropTypes.bool,
  top: _react.PropTypes.number,
  children: _react.PropTypes.any,
  onOutClick: _react.PropTypes.func,
  component: _react.PropTypes.string.isRequired
};
RelativePortal.defaultProps = {
  left: 0,
  top: 0,
  component: 'span'
};
exports.default = RelativePortal;

