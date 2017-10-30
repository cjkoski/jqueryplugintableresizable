/*
* resizable
* version: 2.0.0 (10/05/2010)
* - Added compatibility changes for 1.4.x
* @ jQuery v1.4.x
*
* Licensed under the GPL:
*   http://gplv3.fsf.org
*
* Copyright 2010 Panasonic Avionics Corporation
* Copyright 2008, 2009 Jericho [ thisnamemeansnothing[at]gmail.com ] 
*/
//(function($) {
    $.extend($.fn, {
        getCss: function(key) {
            var v = parseInt(this.css(key));
            if (isNaN(v))
                return false;
            return v;
        }
    });
    $.fn.table_resize = function(opts) {
        var ps = $.extend({
            handler: null,
            min: { height: 0 },
            max: { height: $(document).height() },
            onResize: function() { },
            onStop: function() { }
        }, opts);
        var resize = {
            resize: function(e) {
                var resizeData = e.data.resizeData;

                //var w = Math.min(Math.max(e.pageX - resizeData.offLeft + resizeData.width, resizeData.min.width), ps.max.width);
                var h = Math.min(Math.max(e.pageY - resizeData.offTop + resizeData.height, resizeData.min.height), ps.max.height);
                resizeData.target.css({
                    height: h
                });
                resizeData.onResize(e);
            },
            stop: function(e) {
                e.data.resizeData.onStop(e);

                document.body.onselectstart = function() { return true; }
                e.data.resizeData.target.css('-moz-user-select', '');

                $(document).unbind('mousemove', resize.resize)
            }
        }
        return this.each(function() {
            var me = this;
            var handler = null;
            if (typeof ps.handler == 'undefined' || ps.handler == null)
                handler = $(me);
            else
                handler = (typeof ps.handler == 'string' ? $(ps.handler) : ps.handle);
				
            handler.bind('mousedown', { e: me }, function(s) {
				
                var target = $(s.data.e);
                var resizeData = {
                    height: target.height() || target.getCss('height'),
                    offLeft: s.pageX,
                    offTop: s.pageY,
                    onResize: ps.onResize,
                    onStop: ps.onStop,
                    target: target,
                    min: ps.min,
                    max: ps.max,
					handler: handler
                }

                document.body.onselectstart = function() { return false; }
                target.css('-moz-user-select', 'none');

                $(document).bind('mousemove', { resizeData: resizeData }, resize.resize)
				$(document).bind('mouseup', { resizeData: resizeData }, resize.stop);
            });
			
        });
    }
//})(jQuery); 