/**
 * condetect 0.0.1-alpha library
 * @version 0.0.1-alpha
 * @author Tomasz Jaskowski (https://github.com/tadeck)
 */
(function (window) {
    "use strict";
    var that = {}, // main container object
        api = {}; // external interface

    /**
     * Log message to the console
     * @param msg
     */
    that.log = function (msg) {
        if (window.console !== undefined && window.console.log !== undefined) {
            window.console.log(msg);
        }
    };

    /**
     * Indicate there was some kind of error. Such cases should be eliminated
     * during the development (this call is mostly for debugging problems).
     * @param msg the message to be displayed as error
     */
    that.error = function (msg) {
        that.log('ERROR: ' + msg); // just pass it to log for now
    };

    /**
     * Allows external dependency injection (use only for deep testing)
     * @param name name of the method
     * @param new_method new method to override current one
     */
    that.overrideMethod = function (name, new_method) {
        that[name] = new_method;
    };

    /**
     * Check if AJAX request to specific URL shows specific SPDY request
     * @param location URL to call with AJAX request
     * @returns {boolean|undefined}
     */
    that.ajaxCallUsesSPDY = function (location) {
        var opera_check, req, result, spdy_header;
        opera_check = /^:?version: /m; // Opera seems to add this header
        req = new window.XMLHttpRequest();
        req.open('GET', location, false); // synchronous check
        try {
            req.send(null);
            // making synchronous call, so no need for event-based approach
            spdy_header = req.getResponseHeader('X-Firefox-Spdy');
            if (spdy_header === null) {
                result = false;
                // try Opera check anyway:
                if (opera_check.test(req.getAllResponseHeaders())) {
                    result = true; // match!
                }
            } else {
                // header found and is text, check if is bigger than "1"
                result = spdy_header > 1;
            }
        } catch (e) {
            that.error('Issue making AJAX call: ' + e.toString());
            result = undefined;
        }
        return result;
    };

    /**
     * Get location object associated with given window
     * @param window_obj window object
     * @returns {boolean|undefined}
     */
    that.getLocation = function (window_obj) {
        if (window_obj === undefined) {
            window_obj = window;
        }
        var result;
        if (window_obj.location !== undefined) {
            result = window_obj.location;
        } else {
            result = window_obj.document.location;
        }
        return result;
    };

    /**
     * Check if connection for specific window was invoked using SPDY protocol
     * @param window_obj window which needs to be checked
     * @returns {boolean|undefined} true (yes), false (no), undefined (unknown)
     */
    that.isSPDY = function (window_obj) {
        if (window_obj === undefined) {
            window_obj = window;
        }
        var result;
        if (window_obj.chrome !== undefined &&
                window_obj.chrome.loadTimes !== undefined) {
            // we are dealing with Chrome-like browser
            result = window_obj.chrome.loadTimes().wasFetchedViaSpdy;
        } else {
            result = that.ajaxCallUsesSPDY(that.getLocation(window_obj));
        }
        return result;
    };

    /**
     * Check if connection for specific window was invoked using SSL.
     * @param window_obj window to check
     * @returns {boolean|undefined}
     */
    that.isSSL = function (window_obj) {
        if (window_obj === undefined) {
            window_obj = window;
        }
        var location, result;
        location = that.getLocation(window_obj);
        if (location.protocol !== undefined) {
            result = that.protocolIsSecure(location.protocol);
        } else {
            that.error('cannot retrieve protocol');
            result = undefined;
        }
        return result;
    };

    /**
     * Check if passed protocol is secure. May return undefined, if cannot
     * decide either way.
     * @param protocol the string contained in eg. location.protocol
     * @returns {boolean|undefined}
     */
    that.protocolIsSecure = function (protocol) {
        var patterns, result;
        patterns = {
            'secure': /^https:/,
            'insecure': /^(http|file|ftp):/
        };
        if (patterns.secure.test(protocol)) {
            result = true;
        } else if (patterns.insecure.test(protocol)) {
            result = false;
        } else {
            that.error(
                'encountered unknown protocol: ' + protocol
            );
            result = undefined;
        }
        return result;
    };

    // publish external interface:
    api.isSPDY = that.isSPDY;
    api.isSSL = that.isSSL;

    // deep interference with library:
    api.overrideMethod = that.overrideMethod;

    window.condetect = api;
}(window));
