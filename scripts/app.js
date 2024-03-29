/**
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @see https://piecioshka.github.io/wkr-faktoryzacja/
 * @license The MIT License {@link https://piecioshka.mit-license.org/}
 */
(function (root, factory) {
    root.App = factory(root._);
}(this, function (_) {
    'use strict';

    function App(options) {
        this.settings = _.extend({}, options);
        this.initialize();
    }

    App.prototype = {
        initialize: function () {
            var s = this.settings;

            _.bindAll(this, '_keyDownHandler', '_submitHandler');

            // after click submit do calculation
            s.submit.on('click', this._submitHandler);

            // print result on any input have been modify
            s.first.on('keydown', this._keyDownHandler);
            s.second.on('keydown', this._keyDownHandler);

            // set focus on first input
            s.first.focus();
        },

        _isEnter: function (e) {
            return e.keyCode === 13;
        },

        _isShortcut: function (e) {
            return e.ctrlKey || e.shiftKey || e.metaKey || e.altKey;
        },

        _keyDownHandler: function (e) {
            if (this._isShortcut(e)) {
                return;
            }

            if (this._isEnter(e)) {
                if (this._checkParams()) {
                    this._printResult(this._calculate());
                }
            } else {
                this._clearResult();
            }
        },

        _submitHandler: function (e) {
            if (this._checkParams()) {
                this._printResult(this._calculate());
            }
            e.preventDefault();
        },

        // Returns `true` if error list is empty. Otherwise return 'false'
        _checkParams: function () {
            var s = this.settings;
            var a = s.first.val();
            var b = s.second.val();

            var errors = [];
            var status;

            if (!(/^\d+$/).test(a)) {
                errors.push('Niepoprawna wartość pierwszego parametru');
            }

            if (!(/^\d+$/).test(b) || b == 1 || b == 0) {
                errors.push('Niepoprawna wartość drugiego parametru');
            }

            if (_.size(errors)) {
                alert(_.first(errors));
            }

            // update status by error list
            status = !_.size(errors);

            return status;
        },

        _calculate: function () {
            var s = this.settings;
            var a = s.first.val();
            var b = s.second.val();

            var data = [[a, b]];
            var r = 0;

            while (a != 0) {
                r = a % b;
                a = Math.floor(a / b);

                data.push([a, r]);
            }

            return data;
        },

        _printResult: function (result) {
            var $table = $('<table>').addClass('table table-bordered table-condensed');
            var $thead = $('<thead>');
            var $tbody = $('<tbody>');

            // -- header

            var $tr = $('<tr>').addClass('info');
            _.each(result.shift(), function (cell) {
                var $th = $('<th>').text(cell);
                $tr.append($th);
            });
            $thead.append($tr);
            $table.append($thead);

            // --- body

            _.each(result, function (rows) {
                var $tr = $('<tr>').addClass('active');
                _.each(rows, function (cell) {
                    var $td = $('<td>').text(cell);
                    $tr.append($td);
                });
                $tbody.append($tr);
            });

            $table.append($tbody);

            // show table
            this.settings.result.removeClass('hidden').html($table);
        },

        _clearResult: function () {
            this.settings.result.addClass('hidden');
        }
    };

    return App;
}));