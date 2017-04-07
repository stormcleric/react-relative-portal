'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _exenv = require('exenv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Portal = function (_React$Component) {
  _inherits(Portal, _React$Component);

  function Portal(props, context) {
    _classCallCheck(this, Portal);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Portal).call(this, props, context));

    if (_exenv.canUseDOM) {
      _this.node = document.createElement('div');
      document.body.appendChild(_this.node);

      _this.root = null;
      _this.handleRootRef = function (root) {
        if (root !== _this.root) {
          if (_this.root) {
            _this.root.removeEventListener('click', _this.handleInClick);
          }
          if (root) {
            root.addEventListener('click', _this.handleInClick);
          }
        }
        _this.root = root;
      };

      // The previous implementation triggered `onOutClick` after a click in the `Portal` content
      // if it gets re-rendered during that click. It assumed that if the clicked element
      // is not found in the root element via `root.contains(e.target)`, it's outside.
      // But if after re-render the clicked element gets removed from the DOM, so it cannot be found
      // in the root element. Instead we capture and flag the click event before it bubbles up
      // to the `document` to be handled by `handleOutClick`.
      _this.isInClick = false;
      _this.handleInClick = function () {
        _this.isInClick = true;
      };

      _this.handleOutClick = function () {
        var isOutClick = !_this.isInClick;
        _this.isInClick = false;

        var onOutClick = _this.props.onOutClick;

        if (isOutClick && typeof onOutClick === 'function') {
          onOutClick();
        }
      };

      document.addEventListener('click', _this.handleOutClick);
    }
    return _this;
  }

  _createClass(Portal, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(_ref) {
      var onOutClick = _ref.onOutClick;

      var props = _objectWithoutProperties(_ref, ['onOutClick']);

      // eslint-disable-line no-unused-vars
      // It's recommended to use `ref` callbacks instead of `findDOMNode`. https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
      _reactDom2.default.unstable_renderSubtreeIntoContainer(this, _react2.default.createElement('div', _extends({}, props, { ref: this.handleRootRef })), this.node);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (_exenv.canUseDOM) {
        // `this.handleRootRef` won't be called with `null`, so cleanup here.
        if (this.root) {
          this.root.removeEventListener('click', this.handleInClick);
        }
        document.removeEventListener('click', this.handleOutClick);
        document.body.removeChild(this.node);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Portal;
}(_react2.default.Component);

Portal.propTypes = {
  onOutClick: _react.PropTypes.func
};
exports.default = Portal;

