/*global dessert, troop, sntls, poodle */
troop.postpone(poodle, 'UrlUtils', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     */
    poodle.UrlUtils = self
        .addConstants(/** @lends poodle.UrlUtils */{
            /**
             * @constant
             * @type {RegExp}
             */
            LEADING_TRAILING_SLASHES: /(^\/+)|(\/+$)/g
        });
});
