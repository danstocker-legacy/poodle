/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageLoader', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * @name poodle.ImageLoader.create
     * @function
     * @param {poodle.ImageLocation} imageLocation
     * @returns {poodle.ImageLoader}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.ImageLoader = self
        .setEventSpace(poodle.imageEventSpace)
        .addConstants(/** @lends poodle.ImageLocation */{
            /** @constant */
            EVENT_IMAGE_LOAD_START: 'image-load-start',

            /** @constant */
            EVENT_IMAGE_LOAD_SUCCESS: 'image-load-success',

            /** @constant */
            EVENT_IMAGE_LOAD_FAILURE: 'image-load-failure'
        })
        .addPrivateMethods(/** @lends poodle.ImageLoader# */{
            /**
             * @returns {HTMLImageElement}
             * @private
             */
            _createImageElementProxy: function () {
                return document.createElement('img');
            },

            /**
             * @param imageElement
             * @param srcAttribute
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
        .addMethods(/** @lends poodle.ImageLoader# */{
            /**
             * @param {poodle.ImageLocation} imageLocation
             * @ignore
             */
            init: function (imageLocation) {
                dessert.isLocation(imageLocation, "Invalid image location");

                evan.Evented.init.call(this);

                /** @type {poodle.ImageLocation} */
                this.imageLocation = imageLocation;

                this.setEventPath(imageLocation.eventPath);
            },

            /**
             * Loads image dynamically.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                var that = this,
                    imageLocation = this.imageLocation,
                    eventPath = this.eventPath,
                    imageElement = this._createImageElementProxy(),
                    deferred = $.Deferred();

                this.spawnEvent(this.EVENT_IMAGE_LOAD_START)
                    .setImageLocation(imageLocation)
                    .setImageElement(imageElement)
                    .triggerSync(eventPath);

                this._loadImage(imageElement, imageLocation.toString())
                    .done(function () {
                        that.spawnEvent(that.EVENT_IMAGE_LOAD_SUCCESS)
                            .setImageLocation(imageLocation)
                            .setImageElement(imageElement)
                            .triggerSync(eventPath);

                        deferred.resolve(imageLocation, imageElement);
                    })
                    .fail(function () {
                        that.spawnEvent(that.EVENT_IMAGE_LOAD_FAILURE)
                            .setImageLocation(imageLocation)
                            .setImageElement(imageElement)
                            .triggerSync(eventPath);

                        deferred.reject(imageLocation, imageElement);
                    });

                return deferred.promise();
            }
        });
}, jQuery);

troop.amendPostponed(poodle, 'ImageLocation', function () {
    "use strict";

    poodle.ImageLocation
        .addMethods(/** @lends poodle.ImageLocation */{
            /** @returns {poodle.ImageLoader} */
            toImageLoader: function () {
                return poodle.ImageLoader.create(this);
            }
        });
});


