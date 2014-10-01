/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'Request', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name poodle.Request.create
     * @function
     * @param {poodle.Endpoint} endpoint
     * @param {object} [params]
     * @returns {poodle.Request}
     */

    /**
     * The Request class describes a service request.
     * @class
     * @extends troop.Base
     */
    poodle.Request = self
        .addConstants(/** @lends poodle.Request */{
            /**
             * @type {object}
             * @constant
             */
            METHODS: {
                "OPTIONS": "OPTIONS",
                "GET"    : "GET",
                "HEAD"   : "HEAD",
                "POST"   : "POST",
                "PUT"    : "PUT",
                "DELETE" : "DELETE"
            }
        })
        .addMethods(/** @lends poodle.Request# */{
            /**
             * @param {poodle.Endpoint} endpoint
             * @param {object} [params]
             * @ignore
             */
            init: function (endpoint, params) {
                dessert
                    .isLocation(endpoint, "Invalid endpoint")
                    .isObjectOptional(params, "Invalid parameters");

                /**
                 * Endpoint the request addresses.
                 * @type {poodle.Endpoint}
                 */
                this.endpoint = endpoint;

                /**
                 * HTTP method associated with the request.
                 * @type {string}
                 */
                this.httpMethod = 'GET';

                /**
                 * Collection of header key-value pairs.
                 * @type {sntls.Collection}
                 */
                this.headers = sntls.Collection.create();

                /**
                 * Collection of query parameter key-value pairs.
                 * @type {sntls.Collection}
                 */
                this.params = sntls.Collection.create(params);
            },

            /**
             * Sets HTTP method property.
             * @param httpMethod
             * @returns {poodle.Request}
             */
            setHttpMethod: function (httpMethod) {
                dessert.isHttpMethod(httpMethod, "Invalid HTTP method");
                this.httpMethod = httpMethod;
                return this;
            },

            /**
             * Sets a header key-value pair. Overwrites existing header entry by the same `headerName`.
             * @example
             * request.addHeader('Content-Type', 'application/json);
             * @param {string} headerName Name of header entry.
             * @param {string} headerValue Header entry value.
             * @returns {poodle.Request}
             */
            addHeader: function (headerName, headerValue) {
                this.headers.setItem(headerName, headerValue);
                return this;
            },

            /**
             * Sets multiple header key-value pairs. Overwrites existing header entries having the same keys.
             * @param {object} headers
             * @returns {poodle.Request}
             */
            addHeaders: function (headers) {
                dessert.isObject(headers, "Invalid headers");

                var that = this;

                sntls.Collection.create(headers)
                    .forEachItem(function (value, key) {
                        that.headers.setItem(key, value);
                    });

                return this;
            },

            /**
             * Sets query parameter key-value pair. Overwrites existing parameter entry by the same `paramName`.
             * @param {string} paramName Name of query parameter.
             * @param {string} paramValue Query parameter value.
             * @returns {poodle.Request}
             */
            addParam: function (paramName, paramValue) {
                this.params.setItem(paramName, paramValue);
                return this;
            },

            /**
             * Sets multiple query parameter key-value pairs. Overwrites existing query parameter entries
             * having the same keys.
             * @param {object} params
             * @returns {poodle.Request}
             */
            addParams: function (params) {
                dessert.isObject(params, "Invalid params");

                var that = this;

                sntls.Collection.create(params)
                    .forEachItem(function (value, key) {
                        that.params.setItem(key, value);
                    });

                return this;
            },

            /**
             * Sets a JSON request body. Overwrites previously set JSON body or parameters.
             * TODO: Add tests.
             * @param {object} params
             * @returns {poodle.Request}
             */
            setJsonBody: function (params) {
                dessert.isObject(params, "Invalid params");
                this.params.items = JSON.stringify(params);
                return this;
            },

            /**
             * Serializes request as a path consisting of the HTTP method, endpoint and parameters.
             * TODO: Include headers as well?
             * @returns {string}
             */
            toString: function () {
                return [
                    this.httpMethod,
                    this.endpoint,
                    JSON.stringify(this.params.items)
                ].toPath().toString();
            }
        });
});

troop.amendPostponed(poodle, 'Endpoint', function () {
    "use strict";

    poodle.Endpoint
        .addMethods(/** @lends poodle.Endpoint# */{
            /**
             * Converts endpoint to `Request`.
             * @param {object} [params]
             * @returns {poodle.Request}
             */
            toRequest: function (params) {
                return poodle.Request.create(this, params);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * @param {string} expr
         * @returns {boolean}
         */
        isHttpMethod: function (expr) {
            return poodle.Request.METHODS[expr] === expr;
        },

        /**
         * @param {poodle.Request} expr
         * @returns {boolean}
         */
        isRequest: function (expr) {
            return poodle.Request.isBaseOf(expr);
        },

        /**
         * @param {poodle.Request} [expr]
         * @returns {boolean}
         */
        isRequestOptional: function (expr) {
            return typeof expr === 'undefined' ||
                poodle.Request.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `Request`.
             * @param {object} [params]
             * @returns {poodle.Request}
             * @example
             * ['foo', 'bar'].toRequest()
             */
            toRequest: function (params) {
                return poodle.Request.create(this.toEndpoint(), params);
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `Request`.
             * @param {object} [params]
             * @returns {poodle.Request}
             * @example
             * 'foo/bar'.toRequest()
             */
            toRequest: function (params) {
                return poodle.Request.create(this.toEndpoint(), params);
            }
        },
        false, false, false
    );
}());