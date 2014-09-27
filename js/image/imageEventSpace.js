/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'imageEventSpace', function () {
    "use strict";

    /**
     * Event space for image related events.
     * @type {evan.EventSpace}
     */
    poodle.imageEventSpace = evan.EventSpace.create();
});
