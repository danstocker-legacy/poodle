/*global dessert, troop, sntls, jQuery, poodle */
troop.postpone(poodle, 'PromiseCollection', function (ns, className, /**jQuery*/$) {
    "use strict";

    var modelPromise = $.Deferred().promise();

    /**
     * @name poodle.PromiseCollection.create
     * @function
     * @param {object} items
     * @returns {poodle.PromiseCollection}
     */

    /**
     * @class
     * @extends sntls.Collection
     * @extends jQuery.Promise
     */
    poodle.PromiseCollection = sntls.Collection.of(modelPromise)
        .addMethods(/** @lends poodle.PromiseCollection# */{
            /** @returns {jQuery.Promise} */
            getJoinedPromise: function () {
                return $.when.apply($, this.getValues());
            }
        });
}, jQuery);

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash */{
            /** @returns {poodle.PromiseCollection} */
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
            /** @returns {poodle.PromiseCollection} */
            toPromiseCollection: function () {
                return poodle.PromiseCollection.create(this);
            }
        },
        false, false, false
    );
}());