/** @jsx React.DOM */

// NOTE: This file is formatted for React.js + Browserify
// You might need to make some changes to use it without Browserify

var MousetrapMixin,

    Mousetrap = require('br-mousetrap');

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