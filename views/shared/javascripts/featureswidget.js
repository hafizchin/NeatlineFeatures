(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var BaseWidget, EditWidget, ViewWidget, derefid, poll, stripFirstLine, to_s;
    derefid = function(id) {
      if (id[0] === '#') {
        return id.slice(1, id.length);
      } else {
        return id;
      }
    };
    to_s = function(value) {
      if (value != null) {
        return value.toString();
      } else {
        return '';
      }
    };
    poll = function(predicate, callback, maxPoll, timeout) {
      var n, pred, _poll;
      if (maxPoll == null) maxPoll = null;
      if (timeout == null) timeout = 100;
      n = 0;
      pred = (maxPoll != null) && maxPoll !== 0 ? function() {
        return predicate() || n >= maxPoll;
      } : predicate;
      _poll = function() {
        if (pred()) {
          return callback();
        } else {
          n++;
          return setTimeout(_poll, timeout);
        }
      };
      return setTimeout(_poll, timeout);
    };
    stripFirstLine = function(text) {
      if (text != null) {
        return text.substr(text.indexOf("\n") + 1);
      } else {
        return '';
      }
    };
    BaseWidget = (function() {

      function BaseWidget(widget) {
        this.widget = widget;
      }

      BaseWidget.prototype.initMap = function() {
        var all_options, input, item, local_options, map;
        map = this.fields.map;
        input = this.widget.options.values;
        item = {
          title: 'Coverage',
          name: 'Coverage',
          id: this.widget.element.attr('id'),
          wkt: input.wkt
        };
        local_options = {
          mode: this.widget.options.mode,
          json: item,
          markup: {
            id_prefix: this.widget.options.id_prefix
          }
        };
        if (input.zoom != null) local_options.zoom = input.zoom;
        if (input.center != null) local_options.center = input.center;
        all_options = $.extend(true, {}, this.widget.options.map_options, local_options);
        this.nlfeatures = map.nlfeatures(all_options).data('nlfeatures');
        return this.nlfeatures;
      };

      return BaseWidget;

    })();
    ViewWidget = (function(_super) {

      __extends(ViewWidget, _super);

      function ViewWidget() {
        ViewWidget.__super__.constructor.apply(this, arguments);
      }

      ViewWidget.prototype.init = function() {
        this.build();
        this.initMap();
        return this.populate();
      };

      ViewWidget.prototype.build = function() {
        var el, free, id_prefix, map;
        el = $(this.widget.element);
        id_prefix = derefid(this.widget.options.id_prefix);
        map = $("<div id='" + id_prefix + "map' class='map map-container'></div>");
        free = $("<div id='" + id_prefix + "free' class='freetext'></div>");
        el.addClass('nlfeatures').append(map).append(free);
        this.fields = {
          map: $("#" + id_prefix + "map"),
          free: $("#" + id_prefix + "free")
        };
        return el;
      };

      ViewWidget.prototype.populate = function() {
        var free;
        free = this.widget.options.values.text;
        return this.fields.free.html(stripFirstLine(free));
      };

      return ViewWidget;

    })(BaseWidget);
    EditWidget = (function(_super) {

      __extends(EditWidget, _super);

      function EditWidget() {
        EditWidget.__super__.constructor.apply(this, arguments);
      }

      EditWidget.prototype.init = function() {
        this.build();
        this.initMap();
        this.captureEditor();
        this.populate();
        return this.wire();
      };

      EditWidget.prototype.build = function() {
        var el, id_prefix, map_container, name_prefix, text_container;
        el = $(this.widget.element);
        id_prefix = derefid(this.widget.options.id_prefix);
        name_prefix = this.widget.options.name_prefix;
        map_container = $("<div class=\"nlfeatures map-container\">\n  <div id=\"" + id_prefix + "map\"></div>\n  <div class='nlfeatures-map-tools'></div>\n</div>");
        text_container = $("<div class=\"nlfeatures text-container\">\n  <input type=\"hidden\" id=\"" + id_prefix + "wkt\" name=\"" + name_prefix + "[wkt]\" value=\"\" />\n  <input type=\"hidden\" id=\"" + id_prefix + "zoom\" name=\"" + name_prefix + "[zoom]\" value=\"\" />\n  <input type=\"hidden\" id=\"" + id_prefix + "center_lon\" name=\"" + name_prefix + "[center_lon]\" value=\"\" />\n  <input type=\"hidden\" id=\"" + id_prefix + "center_lat\" name=\"" + name_prefix + "[center_lat]\" value=\"\" />\n  <input type=\"hidden\" id=\"" + id_prefix + "base_layer\" name=\"" + name_prefix + "[base_layer]\" value=\"\" />\n  <input type=\"hidden\" id=\"" + id_prefix + "text\" name=\"" + name_prefix + "[text]\" value=\"\" />\n  <textarea id=\"" + id_prefix + "free\" name=\"" + name_prefix + "[free]\" class=\"textinput\" rows=\"5\" cols=\"50\"></textarea>\n  <label class=\"use-html\">Use HTML\n    <input type=\"hidden\" name=\"" + name_prefix + "[html] value=\"0\" />\n    <input type=\"checkbox\" name=\"" + name_prefix + "[html]\" id=\"" + id_prefix + "html\" value=\"1\" />\n  </label>\n  <label class=\"use-mapon\">Use Map\n    <input type=\"hidden\" name=\"" + name_prefix + "[mapon]\" value=\"0\" />\n    <input type=\"checkbox\" name=\"" + name_prefix + "[mapon]\" id=\"" + id_prefix + "mapon\" value=\"1\" />\n  </label>\n</div>");
        el.addClass('nlfeatures').addClass('nlfeatures-edit').append(map_container).append(text_container);
        this.fields = {
          map_container: el.find(".map-container"),
          text_container: el.find(".text-container"),
          map: $("#" + id_prefix + "map"),
          map_tools: el.find(".nlfeatures-map-tools"),
          mapon: $("#" + id_prefix + "mapon"),
          text: $("#" + id_prefix + "text"),
          free: $("#" + id_prefix + "free"),
          html: $("#" + id_prefix + "html"),
          wkt: $("#" + id_prefix + "wkt"),
          zoom: $("#" + id_prefix + "zoom"),
          center_lon: $("#" + id_prefix + "center_lon"),
          center_lat: $("#" + id_prefix + "center_lat"),
          base_layer: $("#" + id_prefix + "base_layer")
        };
        return el;
      };

      EditWidget.prototype.captureEditor = function() {
        var _this = this;
        return poll(function() {
          return $('.mceEditor').length > 0;
        }, function() {
          var free;
          if (!_this.usesHtml()) {
            free = _this.fields.free.attr('id');
            tinyMCE.execCommand('mceRemoveControl', false, free);
          }
          _this.fields.mapon.unbind('click').change(function() {
            return _this._onUseMap();
          });
          return _this.fields.html.change(function() {
            return _this._updateTinyEvents();
          });
        });
      };

      EditWidget.prototype.populate = function(values) {
        var _ref, _ref2;
        if (values == null) values = this.widget.options.values;
        this.fields.mapon.attr('checked', values.is_map);
        this.fields.wkt.val(to_s(values.wkt));
        this.fields.zoom.val(to_s(values.zoom));
        this.fields.center_lon.val(to_s((_ref = values.center) != null ? _ref.lon : void 0));
        this.fields.center_lat.val(to_s((_ref2 = values.center) != null ? _ref2.lat : void 0));
        this.fields.text.val(to_s(values.text));
        return this.fields.free.val(stripFirstLine(values.text));
      };

      EditWidget.prototype.wire = function() {
        var updateFields,
          _this = this;
        updateFields = function() {
          return _this.updateFields();
        };
        this.fields.free.change(updateFields);
        return this.nlfeatures.element.bind('featureadded.nlfeatures', updateFields).bind('update.nlfeatures', updateFields).bind('delete.nlfeatures', updateFields).bind('saveview.nlfeatures', function() {
          _this.nlfeatures.saveViewport();
          return _this.updateFields();
        });
      };

      EditWidget.prototype.usesHtml = function() {
        return this.fields.html.is(':checked');
      };

      EditWidget.prototype.usesMap = function() {
        return this.fields.mapon.is(':checked');
      };

      EditWidget.prototype.showMap = function() {
        return this.fields.map_container.show();
      };

      EditWidget.prototype.hideMap = function() {
        return this.fields.map_container.hide();
      };

      EditWidget.prototype._onUseMap = function() {
        if (this.usesMap()) {
          this.showMap();
        } else {
          this.hideMap();
        }
        return this.updateFields();
      };

      EditWidget.prototype._updateTinyEvents = function() {
        var freeId,
          _this = this;
        if (this.usesHtml()) {
          freeId = this.fields.free.attr('id');
          return poll(function() {
            return tinyMCE.get(freeId) != null;
          }, function() {
            _this.fields.free.unbind('change');
            return tinyMCE.get(freeId).onChange.add(function() {
              return _this.updateFields();
            });
          });
        } else {
          return this.fields.free.change(function() {
            return _this.updateFields();
          });
        }
      };

      EditWidget.prototype.updateFields = function() {
        var center, free, wkt, zoom;
        wkt = this.nlfeatures.getWktForSave();
        this.fields.wkt.val(wkt);
        zoom = this.nlfeatures.getSavedZoom();
        if (zoom != null) this.fields.zoom.val(zoom);
        center = this.nlfeatures.getSavedCenter();
        if (center != null) {
          this.fields.center_lon.val(center.lon);
          this.fields.center_lat.val(center.lat);
        }
        free = this.fields.free.val();
        return this.fields.text.val("" + wkt + "/" + zoom + "/" + (center != null ? center.lon : void 0) + "/" + (center != null ? center.lat : void 0) + "\n" + free);
      };

      return EditWidget;

    })(BaseWidget);
    return $.widget('nlfeatures.featurewidget', {
      options: {
        mode: 'view',
        id_prefix: null,
        name_prefix: null,
        map_options: {},
        values: {
          wkt: null,
          zoom: null,
          center: null,
          text: null,
          is_html: null,
          is_map: null
        }
      },
      _create: function() {
        var id, _base, _base2;
        id = this.element.attr('id');
        if ((_base = this.options).id_prefix == null) {
          _base.id_prefix = '#' + id.substring(0, id.length - 'widget'.length);
        }
        if ((_base2 = this.options).name_prefix == null) {
          _base2.name_prefix = this._idPrefixToNamePrefix();
        }
        this.mode = this.options.mode === 'edit' ? new EditWidget(this) : new ViewWidget(this);
        this.mode.init();
        if (!this.options.values.is_map) return this.mode.hideMap();
      },
      _idPrefixToNamePrefix: function(id_prefix) {
        var base, indices, p, parts;
        if (id_prefix == null) id_prefix = this.options.id_prefix;
        id_prefix = derefid(id_prefix);
        parts = (function() {
          var _i, _len, _ref, _results;
          _ref = id_prefix.split('-');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (p.length > 0) _results.push(p);
          }
          return _results;
        })();
        base = parts.shift();
        indices = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            p = parts[_i];
            _results.push("[" + p + "]");
          }
          return _results;
        })();
        return "" + base + (indices.join(''));
      },
      destroy: function() {
        return $.Widget.prototype.destroy.call(this);
      },
      _setOptions: function(key, value) {
        return $.Widget.prototype._setOption.apply(this, arguments);
      }
    });
  })(jQuery);

}).call(this);
