/*global dessert, troop, sntls, evan, jQuery, poodle */
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
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Service = self
        .setEventSpace(poodle.serviceEventSpace)
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
            SERVICE_TIMEOUT: 30000,

            /**
             * Registry of service calls that are in progress. Subsequent attempts to call identical services do not
             * dispatch actual ajax requests, but return the promise for the one in progress.
             * @type {sntls.Collection}
             * @constant
             */
            promiseRegistry: sntls.Collection.create()
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
                this.triggerSync(this.EVENT_SERVICE_START, request);

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

                /** @type {poodle.Request} */
                this.request = request;

                // setting event path to endpoint's event path
                this.setEventPath(request.endpoint.eventPath);
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
                return this._triggerEvents($.Deferred().resolve(responseNode, null, null));
            },

            /**
             * Calls service in offline mode, that will return with failure, carrying the specified error value.
             * Offline service calls behave exactly like online calls except they don't make any ajax requests.
             * @param {*} errorThrown Error value to be returned.
             * @returns {jQuery.Promise}
             */
            callOfflineServiceWithFailure: function (errorThrown) {
                return this._triggerEvents($.Deferred().reject(null, null, errorThrown));
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

                var that = this,
                    request = this.request,
                    requestId = request.toString(),
                    promise = this.promiseRegistry.getItem(requestId),
                    requestBody,
                    requestHeaders;

                if (!promise) {
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
                        .mergeWith(request.ajaxOptions)
                        .mergeWith(sntls.Collection.create({
                            dataType: "json",
                            type    : request.httpMethod,
                            url     : request.endpoint.toString(),
                            headers : requestHeaders,
                            data    : requestBody,
                            timeout : this.SERVICE_TIMEOUT
                        }))
                        .items;

                    promise = this._ajaxProxy(ajaxOptions);

                    // storing promise in registry
                    this.promiseRegistry.setItem(requestId, promise);

                    // calling service and
                    this._triggerEvents(promise);

                    promise.always(function () {
                        // removing promise from registry
                        that.promiseRegistry.deleteItem(requestId);
                    });
                }

                return promise;
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
