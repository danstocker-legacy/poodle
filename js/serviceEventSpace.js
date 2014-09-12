/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'serviceEventSpace', function () {
    "use strict";

    /**
     * Dedicated event space for service events.
     * @type {evan.EventSpace}
     */
    poodle.serviceEventSpace = evan.EventSpace.create();
});