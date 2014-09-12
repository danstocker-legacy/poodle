/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'Endpoint', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTraitAndExtend(evan.Evented);

    /**
     * Creates an Endpoint instance.
     * @name poodle.Endpoint.create
     * @function
     * @param {sntls.Path} endpointPath
     * @returns {poodle.Endpoint}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Endpoint = self
        .setEventSpace(poodle.serviceEventSpace)
        .addConstants(/** @lends poodle.Endpoint */{
            /**
             * @constant
             * @type {string}
             */
            ENDPOINT_EVENT_ROOT_PATH: 'endpoint',

            /**
             * @constant
             * @type {RegExp}
             */
            LEADING_TRAILING_SLASHES: /(^\/+)|(\/+$)/g
        })
        .addMethods(/** @lends poodle.Endpoint# */{
            /**
             * @param {sntls.Path} endpointPath
             * @ignore
             */
            init: function (endpointPath) {
                dessert.isPath(endpointPath, "Invalid endpoint path");

                /**
                 * Path associated with endpoint.
                 * @type {sntls.Path}
                 */
                this.endpointPath = endpointPath;

                var eventPath = endpointPath.clone()
                    .prependKey(this.ENDPOINT_EVENT_ROOT_PATH);

                // setting event path as self
                this.setEventPath(eventPath);
            },

            /**
             * Tells if the specified endpoint is equivalent to the current one.
             * @param {poodle.Endpoint} endpoint
             * @returns {boolean}
             */
            equals: function (endpoint) {
                dessert.isEndpointOptional(endpoint, "Invalid endpoint");
                return endpoint && this.endpointPath.equals(endpoint.endpointPath);
            },

            /** @returns {string} */
            toString: function () {
                return this.endpointPath.asArray.join('/');
            }
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

    dessert.addTypes(/** @lends dessert */{
        isEndpoint: function (expr) {
            return poodle.Endpoint.isBaseOf(expr);
        },

        isEndpointOptional: function (expr) {
            return typeof expr === 'undefined' ||
                poodle.Endpoint.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {poodle.Endpoint} */
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
            /** @returns {poodle.Endpoint} */
            toEndpoint: function () {
                return poodle.Endpoint.create(this.toPath());
            }
        },
        false, false, false
    );
}());