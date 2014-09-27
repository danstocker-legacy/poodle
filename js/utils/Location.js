/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'Location', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTraitAndExtend(evan.Evented);

    /**
     * Creates a Location instance.
     * Do not instantiate Location directly unless there are a surrogate rules set up.
     * @name poodle.Location.create
     * @function
     * @param {sntls.Path} locationPath Path that represents the endpoints.
     * @returns {poodle.Location}
     */

    /**
     * The Location is an abstract base class for URLs on which events can be triggered on and listened to.
     * Extend Location to add event space, or set specific root path as needed.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Location = self
        .addConstants(/** @lends poodle.Location */{
            /**
             * Root path for events triggered on the location.
             * Gets prepended to the `eventPath` of the instance.
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

            /**
             * Serializes Location into slash-separated string. Takes root path into account.
             * @returns {string}
             */
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