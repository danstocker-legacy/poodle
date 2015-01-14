/*global console, dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'Service', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * Creates a Service instance.
     * @name poodle.Service.create
     * @function
     * @param {poodle.Request} request
     * @returns {poodle.Service}
     */

    /**
     * The Service class represents a service associated with a specific request.
     * Implements an API to call the service in online or offline, asynchronous or synchronous modes.
     * Triggers events upon start, success, and failure of service calls.
     * TODO: Replace jQuery promise with Q (0.4.0).
     * TODO: Perhaps throttler could be class-level?
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Service = self
        .addConstants(/** @lends poodle.Service */{
            /**
             * Signals the start of a service call.
             * @constant
             */
            EVENT_SERVICE_START: 'service-start',

            /**
             * Signals the successful return of a service call.
             * @constant
             */
            EVENT_SERVICE_SUCCESS: 'service-success',

            /**
             * Signals a failed service call. The reason for failure is included in the event.
             * @constant
             */
            EVENT_SERVICE_FAILURE: 'service-failure',

            /**
             * Default timeout for service calls in [ms].
             * @constant
             */
            SERVICE_TIMEOUT: 30000
        })
        .addPrivateMethods(/** @lends poodle.Service# */{
            /**
             * @param {object} ajaxOptions
             * @returns {jQuery.Promise}
             * @private
             */
            _ajaxProxy: function (ajaxOptions) {
                return $.ajax(ajaxOptions);
            },

            /**
             * Triggers service related events (start - success/failure).
             * @param {jQuery.Promise} ajaxPromise
             * @returns {jQuery.Promise}
             * @private
             */
            _triggerEvents: function (ajaxPromise) {
                var that = this,
                    request = this.request,
                    eventPath = this.eventPath;

                // sending notification about starting the service
                this.spawnEvent(this.EVENT_SERVICE_START)
                    .setRequest(request)
                    .triggerSync(eventPath);

                // adding handlers
                ajaxPromise
                    .done(function (responseNode, textStatus, jqXHR) {
                        that.spawnEvent(that.EVENT_SERVICE_SUCCESS)
                            .setRequest(request)
                            .setResponseNode(responseNode)
                            .setJqXhr(jqXHR)
                            .triggerSync(eventPath);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        that.spawnEvent(that.EVENT_SERVICE_FAILURE)
                            .setRequest(request)
                            .setResponseNode(errorThrown)
                            .setJqXhr(jqXHR)
                            .triggerSync(eventPath);
                    });

                return ajaxPromise;
            },

            /**
             * @param ajaxOptions
             * @returns {jQuery.Promise}
             * @private
             */
            _callService: function (ajaxOptions) {
                var request = this.request,
                    requestBody,
                    requestHeaders;

                switch (request.bodyFormat) {
                case 'json':
                    requestBody = JSON.stringify(request.params.items);
                    requestHeaders = request.headers.clone()
                        .setItem('Content-Type', 'application/json')
                        .items;
                    break;
                default:
                case 'default':
                    requestBody = request.params.items;
                    requestHeaders = request.headers.items;
                }

                // merging default ajax options with custom options
                // custom options taking precedence
                ajaxOptions = sntls.Collection.create(ajaxOptions)
                    .mergeWith(this.ajaxOptions)
                    .mergeWith(sntls.Collection.create({
                        dataType: "json",
                        type    : request.httpMethod,
                        url     : request.endpoint.toString(),
                        headers : requestHeaders,
                        data    : requestBody,
                        timeout : this.SERVICE_TIMEOUT
                    }))
                    .items;

                var promise = this._ajaxProxy(ajaxOptions);

                this._triggerEvents(promise);

                return promise;
            }
        })
        .addMethods(/** @lends poodle.Service# */{
            /**
             * @param {poodle.Request} request
             * @ignore
             */
            init: function (request) {
                dessert.isRequest(request, "Invalid request");

                evan.Evented.init.call(this);

                this.elevateMethod('_callService');

                /** @type {poodle.Request} */
                this.request = request;

                /**
                 * Custom options to be passed to jQuery.ajax().
                 * Options stored in here override the default ajax options, and thus might break the ajax call.
                 * @type {sntls.Collection}
                 */
                this.ajaxOptions = sntls.Collection.create();

                /** @type {poodle.Throttler} */
                this.callServiceThrottler = this._callService.toThrottler();

                // setting event path to endpoint's event path
                this.setEventSpace(poodle.serviceEventSpace)
                    .setEventPath(request.endpoint.eventPath);
            },

            /**
             * Sets custom ajax option key-value pair. Overwrites existing option entry by the same `optionName`.
             * @param {string} optionName
             * @param {*} optionValue
             * @returns {poodle.Service}
             */
            setAjaxOption: function (optionName, optionValue) {
                dessert.isString(optionName, "Invalid ajax option name");
                this.ajaxOptions.setItem(optionName, optionValue);
                return this;
            },

            /**
             * Sets multiple custom ajax option key-value pairs. Overwrites existing ajax option entries
             * having the same keys.
             * @param {object} ajaxOptions
             * @returns {poodle.Service}
             */
            addAjaxOptions: function (ajaxOptions) {
                dessert.isObject(ajaxOptions, "Invalid ajax options");

                var that = this;

                sntls.Collection.create(ajaxOptions)
                    .forEachItem(function (value, key) {
                        that.ajaxOptions.setItem(key, value);
                    });

                return this;
            },

            /**
             * Calls service in offline mode, that will return with success, carrying the specified response body.
             * Offline service calls behave exactly like online calls except they don't make any ajax requests.
             * @example
             * service.callOfflineServiceWithSuccess({foo: 'bar'});
             * @param {*} responseNode Response body to be returned.
             * @returns {jQuery.Promise}
             */
            callOfflineServiceWithSuccess: function (responseNode) {
                var deferred = $.Deferred();

                // making sure service call will be async, just like a real ajax call
                setTimeout(function () {
                    deferred.resolve(responseNode, null, null);
                }, 0);

                return this._triggerEvents(deferred.promise());
            },

            /**
             * Calls service in offline mode, that will return with failure, carrying the specified error value.
             * Offline service calls behave exactly like online calls except they don't make any ajax requests.
             * @param {*} errorThrown Error value to be returned.
             * @returns {jQuery.Promise}
             */
            callOfflineServiceWithFailure: function (errorThrown) {
                var deferred = $.Deferred();

                // making sure service call will be async, just like a real ajax call
                setTimeout(function () {
                    deferred.reject(null, null, errorThrown);
                }, 0);

                return this._triggerEvents(deferred.promise());
            },

            /**
             * Calls service in online mode, dispatching an ajax request in the end. No ajax request will be made
             * if an identical service call is currently in progress.
             * @param {object} [ajaxOptions] Custom options for jQuery ajax.
             * In case of conflict, custom option overrides default.
             * @returns {jQuery.Promise}
             */
            callService: function (ajaxOptions) {
                dessert.isObjectOptional(ajaxOptions, "Invalid ajax options");

                var request = this.request,
                    requestId = request.toString();

                return this.callServiceThrottler.runThrottled(requestId, ajaxOptions);
            },

            /**
             * Calls service in offline mode, synchronously, that will return with success, carrying the specified response body.
             * Offline service calls behave exactly like online calls except they don't make any ajax requests.
             * @example
             * service.callOfflineServiceWithSuccessSync({foo: 'bar'});
             * @param {*} responseNode Response body to be returned.
             * @returns {jQuery.Promise}
             */
            callOfflineServiceWithSuccessSync: function (responseNode) {
                return this._triggerEvents($.Deferred().resolve(responseNode, null, null));
            },

            /**
             * Calls service in offline mode, synchronously, that will return with failure, carrying the specified error value.
             * Offline service calls behave exactly like online calls except they don't make any ajax requests.
             * @param {*} errorThrown Error value to be returned.
             * @returns {jQuery.Promise}
             */
            callOfflineServiceWithFailureSync: function (errorThrown) {
                return this._triggerEvents($.Deferred().reject(null, null, errorThrown));
            },

            /**
             * Calls service synchronously. Overrides `async` option passed in `ajaxOptions`.
             * @example
             * // loading static JSON file
             * 'files/data.json'.toRequest().toService().callServiceSync();
             * @param {object} [ajaxOptions] Custom options for jQuery ajax.
             * @returns {jQuery.Promise}
             */
            callServiceSync: function (ajaxOptions) {
                ajaxOptions = sntls.Collection.create({async: false})
                    .mergeWith(sntls.Collection.create(ajaxOptions))
                    .items;

                return this.callService(ajaxOptions);
            }
        });
}, jQuery);

troop.amendPostponed(poodle, 'Request', function () {
    "use strict";

    poodle.Request
        .addMethods(/** @lends poodle.Request */{
            /** @returns {poodle.Service} */
            toService: function () {
                return poodle.Service.create(this);
            }
        });
});

troop.postpone(poodle, 'logServiceEvents', function () {
    "use strict";

    /**
     * Starts logging all service related events to the console.
     * @type {function}
     */
    poodle.logServiceEvents = function () {
        [].toEndpoint()
            .subscribeTo(poodle.Service.EVENT_SERVICE_START, function (event) {
                console.info("service start", event.request.endpoint.toString(), event);
            })
            .subscribeTo(poodle.Service.EVENT_SERVICE_SUCCESS, function (event) {
                console.info("service success", event.request.endpoint.toString(), event);
            })
            .subscribeTo(poodle.Service.EVENT_SERVICE_FAILURE, function (event) {
                console.info("service failed", event.request.endpoint.toString(), event);
            });
    };
});
