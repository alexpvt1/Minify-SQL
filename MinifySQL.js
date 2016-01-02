/*
Minify and Compress SQL
Copyright (C) 2015 Alex Moura

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Name       : MinifySQL.js
Version    : 1.0.3
Author URL : www.960.co.za
*/


(function($) {

  function createShiftArr(step) {
    var space = '    ';
    if (isNaN(parseInt(step))) {
      space = step;
    } else {
      space = new Array(step + 1).join(' ');
    }
    var shift = ['\n'];
    for (var ix = 0; ix < 100; ix++) {
      shift.push(shift[ix] + space);
    }
    return shift;
  };

  function isSubquery(str, parenthesisLevel) {
    return parenthesisLevel - (str.replace(/\(/g, '').length - str.replace(/\)/g, '').length);
  };

  function split_sql(str, tab) {
    return str.replace(/\s{1,}/g, " ")
      .replace("--", " ")
      .replace(" -- ", " ")
      .replace(/ AND /ig, "~::~" + tab + tab + "AND ")
      .replace(/ BETWEEN /ig, "~::~" + tab + "BETWEEN ")
      .replace(/ CASE /ig, "~::~" + tab + "CASE ")
      .replace(/ ELSE /ig, "~::~" + tab + "ELSE ")
      .replace(/ END /ig, "~::~" + tab + "END ")
      .replace(/ FROM /ig, "~::~FROM ")
      .replace(/ GROUP\s{1,}BY/ig, "~::~GROUP BY ")
      .replace(/ HAVING /ig, "~::~HAVING ")
      .replace(/ IN /ig, " IN ")
      .replace(/ JOIN /ig, "~::~JOIN ")
      .replace(/ CROSS~::~{1,}JOIN /ig, "~::~CROSS JOIN ")
      .replace(/ INNER~::~{1,}JOIN /ig, "~::~INNER JOIN ")
      .replace(/ LEFT~::~{1,}JOIN /ig, "~::~LEFT JOIN ")
      .replace(/ RIGHT~::~{1,}JOIN /ig, "~::~RIGHT JOIN ")
      .replace(/ ON /ig, "~::~" + tab + "ON ")
      .replace(/ OR /ig, "~::~" + tab + tab + "OR ")
      .replace(/ ORDER\s{1,}BY/ig, "~::~ORDER BY ")
      .replace(/ OVER /ig, "~::~" + tab + "OVER ")
      .replace(/\(\s{0,}SELECT /ig, "~::~(SELECT ")
      .replace(/\)\s{0,}SELECT /ig, ")~::~SELECT ")
      .replace(/ THEN /ig, " THEN~::~" + tab + "")
      .replace(/ UNION /ig, "~::~UNION~::~")
      .replace(/ USING /ig, "~::~USING ")
      .replace(/ WHEN /ig, "~::~" + tab + "WHEN ")
      .replace(/ WHERE /ig, "~::~WHERE ")
      .replace(/ WITH /ig, "~::~WITH ")
      .replace(/ ALL /ig, " ALL ")
      .replace(/ AS /ig, " AS ")
      .replace(/ ASC /ig, " ASC ")
      .replace(/ DESC /ig, " DESC ")
      .replace(/ DISTINCT /ig, " DISTINCT ")
      .replace(/ EXISTS /ig, " EXISTS ")
      .replace(/ NOT /ig, " NOT ")
      .replace(/ NULL /ig, " NULL ")
      .replace(/ LIKE /ig, " LIKE ")
      .replace(/\s{0,}SELECT /ig, "SELECT ")
      .replace(/\s{0,}UPDATE /ig, "UPDATE ")
      .replace(/ SET /ig, " SET ")
      .replace(/~::~{1,}/g, "~::~")
      .replace(/ -- /ig, " ")
      .replace(/--/ig, " ")
      .split('~::~');
  };


  var Formatter = function(options) {
    this.init(options);
    //TODO
    var methodName = this.options.method;
    if (!$.isFunction(this[methodName])) {
      $.error("'" + methodName + "' is not a Formatter method.");
    };
    this.format = function(text) {
      return this[this.options.method].call(this, text);
    };
  };

  Formatter.prototype = {
    options: {},

    init: function(options) {
      this.options = $.extend({}, $.fn.format.defaults, options);
      this.step = this.options.step;
      this.preserveComments = this.options.preserveComments;
      this.shift = createShiftArr(this.step);
    },

    sqlmin: function(text) {
      return text.replace(/\s{1,}/g, " ")
        .replace(/\s{1,}\(/, "(")
        .replace(/\s{1,}\)/, ")")
        .replace(/\s{1,}\)/, "--")
        .replace("--", "")
        .replace(" -- ", "");
    }
  };

  $.fn.format = function(options) {
    var fmt = new Formatter(options);
    return this.each(function() {
      var node = $(this);
      var text = node.val();
      text = fmt.format(text);
      node.val(text);
    });
  };

  $.format = function(text, options) {
    var fmt = new Formatter(options);
    return fmt.format(text);
  };

  $.fn.format.defaults = {
    method: 'xml',
    step: '    ',
    preserveComments: false
  };

})(jQuery);
