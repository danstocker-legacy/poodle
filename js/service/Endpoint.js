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
     * @class
     * @extends poodle.Location
     */
    poodle.Endpoint = self
        .setEventSpace(poodle.serviceEventSpace)
        .addConstants(/** @lends poodle.Endpoint */{
            /**
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'endpoint'
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path# */{
        /** @returns {poodle.Endpoint} */
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
            /** @returns {poodle.Endpoint} */
            toEndpoint: function () {
                return poodle.Endpoint.create(this
                    .replace(poodle.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                    .split('/') // splitting up slash-separated path
                    .toPath());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /** @returns {poodle.Endpoint} */
            toEndpoint: function () {
                return poodle.Endpoint.create(this.toPath());
            }
        },
        false, false, false
    );
}());