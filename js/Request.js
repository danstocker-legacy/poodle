/*global dessert, troop, sntls, evane, poodle */
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
                    .isEndpoint(endpoint, "Invalid endpoint")
                    .isObjectOptional(params, "Invalid parameters");

                /** @type {poodle.Endpoint} */
                this.endpoint = endpoint;

                /** @type {string} */
                this.httpMethod = 'GET';

                /** @type {sntls.Collection} */
                this.headers = sntls.Collection.create();

                /** @type {sntls.Collection} */
                this.params = sntls.Collection.create(params);
            },

            /**
             * @param httpMethod
             * @returns {poodle.Request}
             */
            setHttpMethod: function (httpMethod) {
                dessert.isHttpMethod(httpMethod, "Invalid HTTP method");
                this.httpMethod = httpMethod;
                return this;
            },

            /**
             * @param {string} headerName
             * @param {string} headerValue
             * @returns {poodle.Request}
             */
            addHeader: function (headerName, headerValue) {
                this.headers.setItem(headerName, headerValue);
                return this;
            },

            /**
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
             * @param {string} paramName
             * @param {string} paramValue
             * @returns {poodle.Request}
             */
            addParam: function (paramName, paramValue) {
                this.params.setItem(paramName, paramValue);
                return this;
            },

            /**
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

            /** @returns {string} */
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
             * @param {object} [params]
             * @returns {poodle.Request}
             */
            toRequestDescriptor: function (params) {
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
        isRequestDescriptor: function (expr) {
            return poodle.Request.isBaseOf(expr);
        },

        /**
         * @param {poodle.Request} [expr]
         * @returns {boolean}
         */
        isRequestDescriptorOptional: function (expr) {
            return typeof expr === 'undefined' ||
                poodle.Request.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * @param {object} [params]
             * @returns {poodle.Request}
             * @example
             * ['foo', 'bar'].toRequestDescriptor()
             */
            toRequestDescriptor: function (params) {
                return poodle.Request.create(this.toEndpoint(), params);
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @param {object} [params]
             * @returns {poodle.Request}
             * @example
             * 'foo/bar'.toRequestDescriptor()
             */
            toRequestDescriptor: function (params) {
                return poodle.Request.create(this.toEndpoint(), params);
            }
        },
        false, false, false
    );
}());