/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'serviceEventSpace', function () {
    "use strict";

    /**
     * Event space for service related events.
     * @type {evan.EventSpace}
     */
    poodle.serviceEventSpace = evan.EventSpace.create();
});