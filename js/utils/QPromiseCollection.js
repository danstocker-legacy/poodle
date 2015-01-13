/*global dessert, troop, sntls, Q, poodle */
troop.postpone(poodle, 'QPromiseCollection', function () {
    "use strict";

    var modelPromise = Q.defer().promise;

    /**
     * Creates a QPromiseCollection instance.
     * @name QPromiseCollection.create
     * @function
     * @param {object} items
     * @returns {QPromiseCollection}
     */

    /**
     * The QPromiseCollection offers a `Collection`-based solution for joining multiple promises.
     * (The joined promise resolves when *all* promises resolve, and reject when *any* of the promises reject.)
     * @class
     * @extends sntls.Collection
     * @extends Q.Promise
     */
    poodle.QPromiseCollection = sntls.Collection.of(modelPromise)
        .addMethods(/** @lends QPromiseCollection# */{
            /**
             * Obtains joined promise for all promises in the collection.
             * Be aware that the returned promise is asynchronous!
             * @returns {Q.Promise}
             */
            getJoinedPromise: function () {
                return Q.all(this.getValues());
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash */{
            /**
             * Converts `Hash` to `QPromiseCollection`.
             * @returns {poodle.QPromiseCollection}
             */
            toQPromiseCollection: function () {
                return poodle.QPromiseCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `QPromiseCollection`.
             * @returns {poodle.QPromiseCollection}
             */
            toQPromiseCollection: function () {
                return poodle.QPromiseCollection.create(this);
            }
        },
        false, false, false
    );
}());
