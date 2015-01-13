/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'fileSystemEventSpace', function () {
    "use strict";

    /**
     * Event space for image related events.
     * @type {evan.EventSpace}
     */
    poodle.fileSystemEventSpace = evan.EventSpace.create();
});
