/*global dessert, troop, sntls, poodle, jQuery */
troop.postpone(poodle, 'PromiseLoop', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     */
    poodle.PromiseLoop = self
        .addMethods(/** @lends poodle.PromiseLoop */{
            /**
             * Runs handler and re-tries the specified number of times if the promise fails.
             * @param {function} handler Expected to return a jQuery promise.
             * @param {number} [retryCount]
             * @param {function} [retryHandler] Function to be ran before retrying
             * @return {jQuery.Promise}
             */
            retryOnFail: function (handler, retryCount, retryHandler) {
                var deferred = $.Deferred(),
                    i = retryCount || 0;

                (function next() {
                    handler()
                        // resolving returned promise when callback was successful
                        .done(deferred.resolve.bind(this))

                        // processing failed callback
                        .fail(function () {
                            if (i) {
                                // there are retries left

                                if (retryHandler) {
                                    // calling retry handler with retry index
                                    retryHandler(retryCount - i);
                                }

                                // decreasing retry counter
                                i--;

                                // re-trying
                                next();
                            } else {
                                // no more retries left, rejecting returned promise
                                deferred.reject.apply(deferred, arguments);
                            }
                        });
                }());

                return deferred.promise();
            }
        });
}, jQuery);
