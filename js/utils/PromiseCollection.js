/*global dessert, troop, sntls, jQuery, poodle */
troop.postpone(poodle, 'PromiseCollection', function (ns, className, /**jQuery*/$) {
    "use strict";

    var modelPromise = $.Deferred().promise();

    /**
     * Creates a PromiseCollection instance.
     * @name poodle.PromiseCollection.create
     * @function
     * @param {object} items
     * @returns {poodle.PromiseCollection}
     */

    /**
     * The PromiseCollection offers a `Collection`-based solution for joining multiple promises.
     * (The joined promise resolves when *all* promises resolve, and reject when *any* of the promises reject.)
     * @class
     * @extends sntls.Collection
     * @extends jQuery.Promise
     */
    poodle.PromiseCollection = sntls.Collection.of(modelPromise)
        .addMethods(/** @lends poodle.PromiseCollection# */{
            /**
             * Obtains joined promise for all promises in the collection.
             * @returns {jQuery.Promise}
             */
            getJoinedPromise: function () {
                return $.when.apply($, this.getValues());
            }
        });
}, jQuery);

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash */{
            /**
             * Converts `Hash` to `PromiseCollection`.
             * @returns {poodle.PromiseCollection}
             */
            toPromiseCollection: function () {
                return poodle.PromiseCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `PromiseCollection`.
             * @returns {poodle.PromiseCollection}
             */
            toPromiseCollection: function () {
                return poodle.PromiseCollection.create(this);
            }
        },
        false, false, false
    );
}());
