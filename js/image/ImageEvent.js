/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * Creates an ImageEvent instance.
     * @name poodle.ImageEvent.create
     * @function
     * @param {string} eventName Event name
     * @returns {poodle.ImageEvent}
     */

    /**
     * The ImageEvent class pertains to dynamic loading of images. The purpose of such events is to carry information
     * about the image being / having been loaded.
     * Image events are usually triggered at various stages of the loading process.
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

                /**
                 * Location of image associated with event.
                 * @type {poodle.ImageUrl}
                 */
                this.imageUrl = undefined;

                /**
                 * Image DOM element associated with event.
                 * @type {HTMLImageElement}
                 */
                this.imageElement = undefined;
            },

            /**
             * Sets image location property.
             * @param {poodle.ImageUrl} imageUrl
             * @returns {poodle.ImageEvent}
             */
            setImageLocation: function (imageUrl) {
                dessert.isLocation(imageUrl, "Invalid location");
                this.imageUrl = imageUrl;
                return this;
            },

            /**
             * Sets image DOM element property.
             * @param {HTMLImageElement} imageElement
             */
            setImageElement: function (imageElement) {
                dessert.isImageElement(imageElement, "Invalid image element");
                this.imageElement = imageElement;
                return this;
            },

            /**
             * Clones event instance. In addition to `evan.Event.clone()`, also copies image-specific properties
             * (by reference).
             * @param {sntls.Path} [currentPath]
             * @returns {poodle.ImageEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {poodle.ImageEvent} */base.clone.call(this, currentPath);

                return clone
                    .setImageLocation(this.imageUrl)
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
        /** @param {HTMLImageElement} expr */
        isImageElement: function (expr) {
            return expr instanceof HTMLImageElement;
        },

        /** @param {HTMLImageElement} [expr] */
        isImageElementOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   expr instanceof HTMLImageElement;
        }
    });
}());