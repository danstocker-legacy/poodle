/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageUrl', function () {
    "use strict";

    var base = poodle.Location,
        self = base.extend();

    /**
     * @name poodle.ImageUrl.create
     * @function
     * @param {sntls.Path} imagePath
     * @returns {poodle.ImageUrl}
     */

    /**
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
            EVENT_PATH_ROOT: 'image'
        })
        .addMethods(/** @lends poodle.ImageUrl# */{
            /**
             * Initiates loading of image.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                return poodle.Image.loadImage(this);
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path# */{
        /** @returns {poodle.ImageUrl} */
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
            /** @returns {poodle.ImageUrl} */
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
            /** @returns {poodle.ImageUrl} */
            toImageUrl: function () {
                return poodle.ImageUrl.create(this.toPath());
            }
        },
        false, false, false
    );
}());
