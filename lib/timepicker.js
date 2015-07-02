(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('SimpleTimepicker', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['timepicker'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Timepicker, timepicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Timepicker = (function(_super) {
  __extends(Timepicker, _super);

  function Timepicker() {
    return Timepicker.__super__.constructor.apply(this, arguments);
  }

  Timepicker.i18n = {
    'zh-CN': {
      'am': '上午',
      'pm': '下午'
    },
    'en': {
      'am': 'AM',
      'pm': 'PM'
    }
  };

  Timepicker.prototype.opts = {
    target: null,
    inline: false,
    offset: 0,
    format: 'HH:mm'
  };

  Timepicker.prototype.hoursOpts = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

  Timepicker.prototype.minutesOpts = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  Timepicker.prototype.tpl = "<div class=\"simple-timepicker\">\n  <div class=\"picker\">\n    <div class=\"meridiem\">\n      <div class=\"clock am\" data-meridiem=\"am\">" + (Timepicker._t('am')) + "</div>\n      <div class=\"clock pm\" data-meridiem=\"pm\">" + (Timepicker._t('pm')) + "</div>\n    </div>\n    <div class=\"hours\"></div>\n    <span class=\"divider\">:</span>\n    <div class=\"minutes\"></div>\n  </div>\n</div>";

  Timepicker.prototype.hourTpl = '<div class="hour"></div>';

  Timepicker.prototype.minuteTpl = '<div class="minute"></div>';

  Timepicker.prototype._init = function() {
    var _base;
    this.target = $(this.opts.target);
    if (this.target.length === 0 || !this.target.is('input')) {
      throw new Error("simple-timepicker: target option is invalid");
    }
    this.target.data('timepicker', this);
    this._render();
    this._bind();
    (_base = this.opts).time || (_base.time = this.target.val());
    return this.setTime(this.opts.time);
  };

  Timepicker.prototype._render = function() {
    var hour, minute, _i, _j, _len, _len1, _ref, _ref1;
    this.el = $(this.tpl);
    this.el.data(this);
    this.hours = this.el.find('.hours');
    this.minutes = this.el.find('.minutes');
    _ref = this.hoursOpts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hour = _ref[_i];
      $(this.hourTpl).text(hour).attr('data-hour', hour).appendTo(this.hours);
    }
    _ref1 = this.minutesOpts;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      minute = _ref1[_j];
      $(this.minuteTpl).text(minute).attr('data-minute', minute).appendTo(this.minutes);
    }
    if (this.opts.inline) {
      this.el.addClass('inline');
      return this.el.insertAfter(this.target);
    } else {

      this.el.css('display', 'none').appendTo('body');
      this._setPosition();
      this.target.on('focus.simple-timepicker', (function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      return this.target.on('blur.simple-timepicker', (function(_this) {
        return function(e) {
          return _this.hide();
        };
      })(this));
    }
  };

  Timepicker.prototype._bind = function() {
    this.el.on('click.simple-timepicker', function() {
      return false;
    });
    this.el.on('mousedown.simple-timepicker', function() {
      return false;
    });
    this.el.on('click.simple-timepicker', '.clock', (function(_this) {
      return function(e) {
        var $target;
        $target = $(e.currentTarget);
        $target.addClass('active').siblings().removeClass('active');
        _this._checkMeridiem();
        _this._refreshTime();
        return _this.trigger('select', [_this.time, 'meridiem']);
      };
    })(this));
    this.el.on('click.simple-timepicker', '.hour', (function(_this) {
      return function(e) {
        var $target;
        $target = $(e.currentTarget);
        $target.addClass('active').siblings().removeClass('active');
        _this._refreshTime();
        return _this.trigger('select', [_this.time, 'hour']);
      };
    })(this));
    return this.el.on('click.simple-timepicker', '.minute', (function(_this) {
      return function(e) {
        var $target;
        $target = $(e.currentTarget);
        $target.addClass('active').siblings().removeClass('active');
        if (!_this.opts.inline) {
          _this.target.blur();
        }
        _this._refreshTime();
        return _this.trigger('select', [_this.time, 'minute']);
      };
    })(this));
  };

  Timepicker.prototype._unbind = function() {
    this.el.off('.simple-timepicker');
    $(document).off('.simple-timepicker');
    return this.target.off('.simple-timepicker');
  };

  Timepicker.prototype._refreshTime = function() {
    var hour, meridiem, minute;
    meridiem = this.el.find('.clock.active').data('meridiem');
    hour = this.el.find('.hour.active').data('hour');
    minute = this.el.find('.minute.active').data('minute');
    this.time = moment("" + meridiem + " " + hour + ":" + minute, 'a hh:mm', 'en').locale(moment.locale());
    return this._renderTime();
  };

  Timepicker.prototype._renderTime = function() {
    return this.target.val(this.time.format(this.opts.format));
  };

  Timepicker.prototype._setPosition = function() {
    var offset;
    offset = this.target.offset();
    return this.el.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.target.outerHeight(true) + this.opts.offset
    });
  };

  Timepicker.prototype._checkMeridiem = function() {
    if (this.el.find('.meridiem .clock.pm').hasClass('active')) {
      return this.hours.find('.hour[data-hour=00]').text('12');
    } else {
      return this.hours.find('.hour[data-hour=00]').text('00');
    }
  };

  Timepicker.prototype.show = function() {
    return this.el.show();
  };

  Timepicker.prototype.hide = function() {
    return this.el.hide();
  };

  Timepicker.prototype.getTime = function() {
    return this.time;
  };

  Timepicker.prototype.setTime = function(time) {
    var hour, meridiem, minute;
    if (moment.isMoment(time)) {
      this.time = time;
    } else {
      this.time = moment(time, 'HH:mm');
    }
    if (!this.time.isValid()) {
      this.time = moment();
    }
    meridiem = this.time.clone().locale('en').format('a');
    hour = this.time.format('hh');
    minute = this.time.format('mm');
    minute = Math.round(minute / 5) * 5;
    this.time.set('minute', minute);
    minute = this.time.format('mm');
    if (hour === '12') {
      hour = '00';
    }
    this.el.find("[data-meridiem=" + meridiem + "]").addClass('active').siblings().removeClass('active');
    this.el.find("[data-hour=" + hour + "]").addClass('active').siblings().removeClass('active');
    this.el.find("[data-minute=" + minute + "]").addClass('active').siblings().removeClass('active');
    this._checkMeridiem();
    return this._renderTime();
  };

  Timepicker.prototype.destroy = function() {
    this._unbind();
    return this.el.remove();
  };

  return Timepicker;

})(SimpleModule);

timepicker = function(opts) {
  return new Timepicker(opts);
};

return timepicker;

}));

