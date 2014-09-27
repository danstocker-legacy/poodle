/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'Image', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * Creates an Image instance.
     * @name poodle.Image.create
     * @function
     * @param {poodle.ImageUrl} imageUrl Location of image.
     * @returns {poodle.Image}
     */

    /**
     * The Image class represents an image file, and manages its dynamic loading via a DOM element.
     * Triggers events upon start, success, and failure of loading an image.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.Image = self
        .setEventSpace(poodle.imageEventSpace)
        .addConstants(/** @lends poodle.ImageUrl */{
            /**
             * Signals that image started loading.
             * @constant
             */
            EVENT_IMAGE_LOAD_START: 'image-load-start',

            /**
             * Signals that image has finished loading.
             * @constant
             */
            EVENT_IMAGE_LOAD_SUCCESS: 'image-load-success',

            /**
             * Signals that image failed to load.
             * @constant
             */
            EVENT_IMAGE_LOAD_FAILURE: 'image-load-failure'
        })
        .addPrivateMethods(/** @lends poodle.Image# */{
            /**
             * @returns {HTMLImageElement}
             * @private
             */
            _createImageElementProxy: function () {
                return document.createElement('img');
            },

            /**
             * Applies the specified src attribute to the specified image DOM element, and subscribes to its events.
             * @param {HTMLImageElement} imageElement
             * @param {string} srcAttribute
             * @returns {jQuery.Promise}
             * @private
             */
            _loadImage: function (imageElement, srcAttribute) {
                var deferred = $.Deferred();

                imageElement.onload = deferred.resolve.bind(deferred);
                imageElement.onerror = deferred.reject.bind(deferred);

                imageElement.src = srcAttribute;

                return deferred.promise();
            }
        })
        .addMethods(/** @lends poodle.Image# */{
            /**
             * @param {poodle.ImageUrl} imageUrl
             * @ignore
             */
            init: function (imageUrl) {
                dessert.isLocation(imageUrl, "Invalid image URL");

                evan.Evented.init.call(this);

                /** @type {poodle.ImageUrl} */
                this.imageUrl = imageUrl;

                this.setEventPath(imageUrl.eventPath);
            },

            /**
             * Loads image dynamically. Triggers appropriate events at each stage of the loading process.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                var that = this,
                    imageUrl = this.imageUrl,
                    eventPath = this.eventPath,
                    imageElement = this._createImageElementProxy(),
                    deferred = $.Deferred();

                this.spawnEvent(this.EVENT_IMAGE_LOAD_START)
                    .setImageLocation(imageUrl)
                    .setImageElement(imageElement)
                    .triggerSync(eventPath);

                this._loadImage(imageElement, imageUrl.toString())
                    .done(function () {
                        that.spawnEvent(that.EVENT_IMAGE_LOAD_SUCCESS)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync(eventPath);

                        deferred.resolve(imageUrl, imageElement);
                    })
                    .fail(function () {
                        that.spawnEvent(that.EVENT_IMAGE_LOAD_FAILURE)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync(eventPath);

                        deferred.reject(imageUrl, imageElement);
                    });

                return deferred.promise();
            }
        });
}, jQuery);

troop.amendPostponed(poodle, 'ImageUrl', function () {
    "use strict";

    poodle.ImageUrl
        .addMethods(/** @lends poodle.ImageUrl */{
            /**
             * Converts `ImageUrl` to `Image`.
             * @returns {poodle.Image}
             */
            toImage: function () {
                return poodle.Image.create(this);
            }
        });
});


