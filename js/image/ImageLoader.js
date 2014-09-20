/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageLoader', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * @name poodle.ImageLoader.create
     * @function
     * @param {poodle.ImageUrl} imageUrl
     * @returns {poodle.ImageLoader}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.ImageLoader = self
        .setEventSpace(poodle.imageEventSpace)
        .addConstants(/** @lends poodle.ImageUrl */{
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
             * Loads image dynamically.
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
            /** @returns {poodle.ImageLoader} */
            toImageLoader: function () {
                return poodle.ImageLoader.create(this);
            }
        });
});


