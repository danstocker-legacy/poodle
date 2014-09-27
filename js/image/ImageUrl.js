/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageUrl', function () {
    "use strict";

    var base = poodle.Location,
        self = base.extend();

    /**
     * Creates an ImageUrl instance.
     * @name poodle.ImageUrl.create
     * @function
     * @param {sntls.Path} imagePath
     * @returns {poodle.ImageUrl}
     */

    /**
     * The ImageUrl is a Location that allows dynamic loading of images via DOM image element.
     * @class
     * @extends poodle.Location
     */
    poodle.ImageUrl = self
        .setEventSpace(poodle.imageEventSpace)
        .addConstants(/** @lends poodle.ImageUrl */{
            /**
             * Root path for all image event paths.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'image'
        })
        .addMethods(/** @lends poodle.ImageUrl# */{
            /**
             * Initiates loading of image.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                return poodle.Image.create(this).loadImage();
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path# */{
        /**
         * Converts `Path` to `ImageUrl`.
         * @returns {poodle.ImageUrl}
         */
        toImageUrl: function () {
            return poodle.ImageUrl.create(this);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `ImageUrl`.
             * @returns {poodle.ImageUrl}
             */
            toImageUrl: function () {
                return poodle.ImageUrl.create(this
                    .replace(poodle.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                    .split('/') // splitting up slash-separated path
                    .toPath());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `ImageUrl`.
             * @returns {poodle.ImageUrl}
             */
            toImageUrl: function () {
                return poodle.ImageUrl.create(this.toPath());
            }
        },
        false, false, false
    );
}());
