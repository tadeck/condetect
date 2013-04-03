=====================
``condetect`` Library
=====================

This library is small utility originally designed for connection-related
detections. Consider it a shorthand for protocol checks and connection-related
tasks.

The library is in development stage, so any feedback is encouraged. Please do
not hesitate to use it - any issues should be reported through GitHub issues
page.

Changelog
=========

+---------+------------+------------------------------------------------------+
| Version | Date       | Changes                                              |
+=========+============+======================================================+
| 0.0.1   | 2013-04-03 | - initial release,                                   |
|         |            | - support for detection of SPDY availability,        |
|         |            | - support for SSL check,                             |
+---------+------------+------------------------------------------------------+

Features
========

The following features are available:

- detect if current connection uses SPDY protocol,
- detect if current connection uses SSL,

The following features are planned:

- connection features detection (eg. compression),
- connectivity issues detection,
- ability to work with separate AJAX calls or by intercepting existing ones,
- configurable endpoints for AJAX tests,

How to use the library
======================

When loaded, the library creates global object called ``condetect`` (as the
name off the library, abbreviation of "*connection detect*"). This object has
some useful properties, such as:

- ``condetect.isSSL()`` - returns ``true`` if connection is done through SSL,
  ``false`` if connection is not done through SSL, and returns ``undefined``,
  when the protocol cannot be identified,
- ``condetect.isSPDY()`` - returns ``true`` if connection is done through SPDY,
  ``false`` when not, and ``undefined`` when the library cannot distinguish it,

Both ``condetect.isSSL()`` and ``condetect.isSPDY()`` accept window object as
an argument, if you want to check some specific window. If you have
insufficient permissions for specific window (eg. for ``iframe`` from external
site), do not be surprised with ``undefined`` returned by the above calls.

Example no. 1 - redirect to SSL
-------------------------------

To redirect to secure connection you can do the following::

    function secureLocation(oldLocation){
        // build location by changing the protocol
        return 'https://' + oldLocation.hostname + oldLocation.pathname;
    }

    if (!condetect.isSSL()){
        // connection is not secure, redirect to secure location
        window.location = secureLocation(window.location);
    }

Example no. 2 - switch for SPDY
-------------------------------

Since you are able to detect SPDY on some browsers, you may wish to let user
know, that he is using some pretty cool technology::

    if (condetect.isSPDY()){
        // user is connecting through SPDY, let him know
        alert('You are using faster connection version. Congratulations!');
    }

Of course, you can apply similar checks for more advanced features provided by
SPDY protocol.

Browser compatibility
=====================

Right now the compatibility with older (deprecated) browsers is not planned,
but further tests should reveal the degree of library's compatibility with such
browsers. Any test results giving some insight into this subject are
encouraged.

The module has been tested so far with:

- Google Chrome 25,
- Mozilla Firefox 18,
- Opera 12.14,

License
=======

The license has not been chosen yet. You can use the library for free, modify
it and distribute. However, please include the reference to the original
library or its author. The library is provided free of charge and without any
guarantee, of any kind. In return please consider giving feedback on it, eg.
testing it for different browsers and providing the results and/or fixes.
