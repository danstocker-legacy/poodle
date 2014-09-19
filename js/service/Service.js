/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'Service', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * @name poodle.Service.create
     * @function
     * @param {poodle.Request} request
     * @returns {poodle.Service}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Service = self
        .setEventSpace(poodle.serviceEventSpace)
        .addConstants(/** @lends poodle.Service */{
            /** @constant */
            EVENT_SERVICE_START: 'service-start',

            /** @constant */
            EVENT_SERVICE_SUCCESS: 'service-success',

            /** @constant */
            EVENT_SERVICE_FAILURE: 'service-failure',

            /** @constant */
            SERVICE_TIMEOUT: 30000,

            /**
             * @type {sntls.Collection}
             * @constant
             */
            promiseRegistry: sntls.Collection.create()
        })
        .addPrivateMethods(/** @lends poodle.Service */{
            /**
             * @param {object} ajaxOptions
             * @returns {jQuery.Promise}
             * @private
             */
            _ajaxProxy: function (ajaxOptions) {
                return $.ajax(ajaxOptions);
            }
        })
        .addMethods(/** @lends poodle.Service */{
            /**
             * @param {poodle.Request} request
             * @ignore
             */
            init: function (request) {
                dessert.isRequest(request, "Invalid request");

                evan.Evented.init.call(this);

                /** @type {poodle.Request} */
                this.request = request;

                this.setEventPath(request.endpoint.eventPath);
            },

            /** @returns {jQuery.Promise} */
            callService: function () {
                var that = this,
                    request = this.request,
                    requestId = request.toString(),
                    promise = this.promiseRegistry.getItem(requestId);

                if (promise) {
                    return promise;
                } else {
                    this.triggerSync(this.EVENT_SERVICE_START, request);

                    promise = this._ajaxProxy(
                        {
                            dataType: "json",
                            type    : request.httpMethod,
                            url     : request.endpoint.toString(),
                            headers : request.headers.items,
                            data    : request.params.items,
                            timeout : this.SERVICE_TIMEOUT
                        })
                        .done(function (responseNode, textStatus, jqXHR) {
                            that.spawnEvent(that.EVENT_SERVICE_SUCCESS)
                                .setRequest(request)
                                .setResponseNode(responseNode)
                                .setJqXhr(jqXHR)
                                .triggerSync(that.eventPath);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            that.spawnEvent(that.EVENT_SERVICE_FAILURE)
                                .setRequest(request)
                                .setResponseNode(errorThrown)
                                .setJqXhr(jqXHR)
                                .triggerSync(that.eventPath);
                        })
                        .always(function () {
                            that.promiseRegistry.deleteItem(requestId);
                        });

                    this.promiseRegistry.setItem(requestId, promise);

                    return promise;
                }
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
