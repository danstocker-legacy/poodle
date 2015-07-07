/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'Endpoint', function () {
    "use strict";

    var base = poodle.Location,
        self = base.extend();

    /**
     * Creates an Endpoint instance.
     * @name poodle.Endpoint.create
     * @function
     * @param {sntls.Path} endpointPath
     * @returns {poodle.Endpoint}
     */

    /**
     * The Endpoint is a Location that represents a service endpoint.
     * @class
     * @extends poodle.Location
     */
    poodle.Endpoint = self
        .addConstants(/** @lends poodle.Endpoint */{
            /**
             * Event root path specifically for endpoints.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'endpoint'
        })
        .addMethods(/** @lends poodle.Endpoint# */{
            /**
             * @param {sntls.Path} endpointPath
             * @ignore
             */
            init: function (endpointPath) {
                base.init.call(this, endpointPath);
                this.setEventSpace(poodle.serviceEventSpace);
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path# */{
        /**
         * Converts `Path` instance to `Endpoint`
         * @returns {poodle.Endpoint}
         */
        toEndpoint: function () {
            return poodle.Endpoint.create(this);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `Endpoint`
             * @returns {poodle.Endpoint}
             */
            toEndpoint: function () {
                return poodle.Endpoint.create(this
                    .replace(poodle.Endpoint.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                    .split('/') // splitting up slash-separated path
                    .toPath());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `Endpoint`
             * @returns {poodle.Endpoint}
             */
            toEndpoint: function () {
                return poodle.Endpoint.create(this.toPath());
            }
        },
        false, false, false
    );
}());