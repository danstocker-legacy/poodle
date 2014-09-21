/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'Location', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTraitAndExtend(evan.Evented);

    /**
     * @name poodle.Location.create
     * @function
     * @param {sntls.Path} path
     * @returns {poodle.Location}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Location = self
        .addConstants(/** @lends poodle.Location */{
            /**
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'location',

            /**
             * @constant
             * @type {string}
             */
            LOCATION_ROOT_PATH: undefined,

            /**
             * @constant
             * @type {RegExp}
             */
            LEADING_TRAILING_SLASHES: /(^\/+)|(\/+$)/g
        })
        .addMethods(/** @lends poodle.Location# */{
            /**
             * @param {sntls.Path} locationPath
             * @ignore
             */
            init: function (locationPath) {
                dessert.isPath(locationPath, "Invalid path");

                /**
                 * Path associated with endpoint.
                 * @type {sntls.Path}
                 */
                this.locationPath = locationPath;

                var eventPath = locationPath.clone()
                    .prependKey(this.EVENT_ROOT_PATH);

                // setting event path for Evented
                this.setEventPath(eventPath);
            },

            /**
             * Tells if the specified location is equivalent to the current one.
             * @param {poodle.Location} location
             * @returns {boolean}
             */
            equals: function (location) {
                dessert
                    .isLocationOptional(location, "Invalid location")
                    .assert(!location || this.getBase() === location.getBase(), "Invalid kind of location");

                return location && this.locationPath.equals(location.locationPath);
            },

            /** @returns {string} */
            toString: function () {
                var LOCATION_ROOT_PATH = this.LOCATION_ROOT_PATH,
                    asArray = this.locationPath.asArray;

                asArray = LOCATION_ROOT_PATH ?
                    [LOCATION_ROOT_PATH].concat(asArray) :
                    asArray;

                return asArray.join('/');
            }
        });
});
(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isLocation: function (expr) {
            return poodle.Location.isBaseOf(expr);
        },

        isLocationOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   poodle.Location.isBaseOf(expr);
        }
    });
}());