(function($) {
    $.easyPieChart = function(el, options) {
        var addScaleLine, animateLine, drawLine, easeInOutQuad, rAF, renderBackground, renderScale, renderTrack,
            _this = this;
        this.el = el;
        this.$el = $(el);
        this.$el.data("easyPieChart", this);
        this.init = function() {
            var percent, scaleBy;
            _this.options = $.extend({}, $.easyPieChart.defaultOptions, options);
            percent = parseInt(_this.$el.data('percent'), 10);
            _this.percentage = 0;
            _this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "'></canvas>").get(0);
            _this.$el.append(_this.canvas);
            if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
                G_vmlCanvasManager.initElement(_this.canvas);
            }
            _this.ctx = _this.canvas.getContext('2d');
            if (window.devicePixelRatio > 1) {
                scaleBy = window.devicePixelRatio;
                $(_this.canvas).css({
                    width: _this.options.size,
                    height: _this.options.size
                });
                _this.canvas.width *= scaleBy;
                _this.canvas.height *= scaleBy;
                _this.ctx.scale(scaleBy, scaleBy);
            }
            _this.ctx.translate(_this.options.size / 2, _this.options.size / 2);
            _this.ctx.rotate(_this.options.rotate * Math.PI / 180);
            _this.$el.addClass('easyPieChart');
            _this.$el.css({
                width: _this.options.size,
                height: _this.options.size,
                lineHeight: "" + _this.options.size + "px"
            });
            _this.update(percent);
            return _this;
        };
        this.update = function(percent) {
            percent = parseFloat(percent) || 0;
            if (_this.options.animate === false) {
                drawLine(percent);
            } else {
                animateLine(_this.percentage, percent);
            }
            return _this;
        };
        renderScale = function() {
            var i, _i, _results;
            _this.ctx.fillStyle = _this.options.scaleColor;
            _this.ctx.lineWidth = 1;
            _results = [];
            for (i = _i = 0; _i <= 24; i = ++_i) {
                _results.push(addScaleLine(i));
            }
            return _results;
        };
        addScaleLine = function(i) {
            var offset;
            offset = i % 6 === 0 ? 0 : _this.options.size * 0.017;
            _this.ctx.save();
            _this.ctx.rotate(i * Math.PI / 12);
            _this.ctx.fillRect(_this.options.size / 2 - offset, 0, -_this.options.size * 0.05 + offset, 1);
            _this.ctx.restore();
        };
        renderTrack = function() {
            var offset;
            offset = _this.options.size / 2 - _this.options.lineWidth / 2;
            if (_this.options.scaleColor !== false) {
                offset -= _this.options.size * 0.08;
            }
            _this.ctx.beginPath();
            _this.ctx.arc(0, 0, offset, 0, Math.PI * 2, true);
            _this.ctx.closePath();
            _this.ctx.strokeStyle = _this.options.trackColor;
            _this.ctx.lineWidth = _this.options.lineWidth;
            _this.ctx.stroke();
        };
        renderBackground = function() {
            if (_this.options.scaleColor !== false) {
                renderScale();
            }
            if (_this.options.trackColor !== false) {
                renderTrack();
            }
        };
        drawLine = function(percent) {
            var offset;
            renderBackground();
            _this.ctx.strokeStyle = $.isFunction(_this.options.barColor) ? _this.options.barColor(percent) : _this.options.barColor;
            _this.ctx.lineCap = _this.options.lineCap;
            _this.ctx.lineWidth = _this.options.lineWidth;
            offset = _this.options.size / 2 - _this.options.lineWidth / 2;
            if (_this.options.scaleColor !== false) {
                offset -= _this.options.size * 0.08;
            }
            _this.ctx.save();
            _this.ctx.rotate(-Math.PI / 2);
            _this.ctx.beginPath();
            _this.ctx.arc(0, 0, offset, 0, Math.PI * 2 * percent / 100, false);
            _this.ctx.stroke();
            _this.ctx.restore();
        };
        rAF = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        })();
        animateLine = function(from, to) {
            var anim, startTime;
            _this.options.onStart.call(_this);
            _this.percentage = to;
            Date.now || (Date.now = function() {
                return +(new Date);
            });
            startTime = Date.now();
            anim = function() {
                var currentValue, process;
                process = Date.now() - startTime;
                if (process < _this.options.animate) {
                    rAF(anim);
                }
                _this.ctx.clearRect(-_this.options.size / 2, -_this.options.size / 2, _this.options.size, _this.options.size);
                renderBackground.call(_this);
                currentValue = [easeInOutQuad(process, from, to - from, _this.options.animate)];
                _this.options.onStep.call(_this, currentValue);
                drawLine.call(_this, currentValue);
                if (process >= _this.options.animate) {
                    return _this.options.onStop.call(_this, currentValue, to);
                }
            };
            rAF(anim);
        };
        easeInOutQuad = function(t, b, c, d) {
            var easeIn, easing;
            easeIn = function(t) {
                return Math.pow(t, 2);
            };
            easing = function(t) {
                if (t < 1) {
                    return easeIn(t);
                } else {
                    return 2 - easeIn((t / 2) * -2 + 2);
                }
            };
            t /= d / 2;
            return c / 2 * easing(t) + b;
        };
        return this.init();
    };
    $.easyPieChart.defaultOptions = {
        barColor: '#ef1e25',
        trackColor: '#f2f2f2',
        scaleColor: '#dfe0e0',
        lineCap: 'round',
        rotate: 0,
        size: 110,
        lineWidth: 3,
        animate: false,
        onStart: $.noop,
        onStop: $.noop,
        onStep: $.noop
    };
    $.fn.easyPieChart = function(options) {
        return $.each(this, function(i, el) {
            var $el, instanceOptions;
            $el = $(el);
            if (!$el.data('easyPieChart')) {
                instanceOptions = $.extend({}, options, $el.data());
                return $el.data('easyPieChart', new $.easyPieChart(el, instanceOptions));
            }
        });
    };
    return void 0;
})(jQuery);