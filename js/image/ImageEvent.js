/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * @name poodle.ImageEvent.create
     * @function
     * @param {string} eventName Event name
     * @returns {poodle.ImageEvent}
     */

    /**
     * @class
     * @extends evan.Event
     */
    poodle.ImageEvent = self
        .addMethods(/** @lends poodle.ImageEvent# */{
            /**
             * @param {string} eventName Event name
             * @ignore
             */
            init: function (eventName) {
                base.init.call(this, eventName, poodle.imageEventSpace);

                /** @type {poodle.ImageLocation} */
                this.imageLocation = undefined;

                /** @type {HTMLImageElement} */
                this.imageElement = undefined;
            },

            /**
             * @param {poodle.ImageLocation} imageLocation
             * @returns {poodle.ImageEvent}
             */
            setImageLocation: function (imageLocation) {
                dessert.isLocation(imageLocation, "Invalid location");
                this.imageLocation = imageLocation;
                return this;
            },

            /** @param {HTMLImageElement} imageElement */
            setImageElement: function (imageElement) {
                dessert.isImageElement(imageElement, "Invalid image element");
                this.imageElement = imageElement;
                return this;
            },

            /**
             * @param {sntls.Path} [currentPath]
             * @returns {poodle.ImageEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {poodle.ImageEvent} */base.clone.call(this, currentPath);

                return clone
                    .setImageLocation(this.imageLocation)
                    .setImageElement(this.imageElement);
            }
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event
        .addSurrogate(poodle, 'ImageEvent', function (eventName, eventSpace) {
            return eventSpace === poodle.imageEventSpace;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isImageElement: function (expr) {
            return expr instanceof HTMLImageElement;
        },

        isImageElementOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   expr instanceof HTMLImageElement;
        }
    });
}());