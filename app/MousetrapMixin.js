/** @jsx React.DOM */

// NOTE: This file is formatted for React.js + Browserify
// You might need to make some changes to use it without Browserify

var MousetrapMixin,

    Mousetrap = require('mousetrap');
    
    /**
     * adds a bindGlobal method to Mousetrap that allows you to
     * bind specific keyboard shortcuts that will still work
     * inside a text input field
     *
     * usage:
     * Mousetrap.bindGlobal('ctrl+s', _saveChanges);
     */
    /* global Mousetrap:true */
    (function(Mousetrap) {
        var _globalCallbacks = {};
        var _originalStopCallback = Mousetrap.prototype.stopCallback;

        Mousetrap.prototype.stopCallback = function(e, element, combo, sequence) {
            console.log('combo', combo);
            console.log('sequence', sequence);
            var self = this;

            if (self.paused) {
                return true;
            }

            if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
                return false;
            }

            return _originalStopCallback.call(self, e, element, combo);
        };

        Mousetrap.prototype.bindGlobal = function(keys, callback, action) {
            var self = this;
            self.bind(keys, callback, action);

            if (keys instanceof Array) {
                for (var i = 0; i < keys.length; i++) {
                    _globalCallbacks[keys[i]] = true;
                }
                return;
            }

            _globalCallbacks[keys] = true;
        };

        Mousetrap.init();
    }) (Mousetrap);

MousetrapMixin = {
    /**
     * Array for keeping track of shortcuts bindings
     */
    mousetrapBindings: [],

    /**
     * Bind a function to a keyboard shortcut
     *
     * @param key
     * @param callback
     */
    bindShortcut: function(key, callback) {
        Mousetrap.bind(key, callback);

        this.mousetrapBindings.push(key);
    },
    bindGlobal: function(key, callback) {
        Mousetrap.bindGlobal(key, callback);

        this.mousetrapBindings.push(key);
    },

    /**
     * Unbind a keyboard shortcut
     *
     * @param key
     */
    unbindShortcut: function(key) {
        var index = this.mousetrapBindings.indexOf(key);

        if (index > -1) {
            this.mousetrapBindings.splice(index, 1);
        }

        Mousetrap.unbind(binding);
    },

    /**
     * Remove any Mousetrap bindings
     */
    unbindAllShortcuts: function() {
        if (this.mousetrapBindings.length < 1) {
            return;
        }

        this.mousetrapBindings.forEach(function(binding) {
            Mousetrap.unbind(binding);
        });
    },

    /**
     * Handle component unmount
     */
    componentWillUnmount: function() {
        // Remove any Mousetrap bindings before unmounting
        this.unbindAllShortcuts();
    }
};

module.exports = MousetrapMixin;