/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'ImageLocation', function () {
    "use strict";

    var base = poodle.Location,
        self = base.extend();

    /**
     * @name poodle.ImageLocation.create
     * @function
     * @param {sntls.Path} imagePath
     * @returns {poodle.ImageLocation}
     */

    /**
     * @class
     * @extends poodle.Location
     */
    poodle.ImageLocation = self
        .setEventSpace(poodle.imageEventSpace)
        .addConstants(/** @lends poodle.ImageLocation */{
            /**
             * Root path for all image event paths.
             * @constant
             * @type {string}
             */
            EVENT_PATH_ROOT: 'image'
        })
        .addMethods(/** @lends poodle.ImageLocation# */{
            /**
             * Initiates loading of image.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                return poodle.ImageLoader.loadImage(this);
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path# */{
        /** @returns {poodle.ImageLocation} */
        toImageLocation: function () {
            return poodle.ImageLocation.create(this);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {poodle.ImageLocation} */
            toImageLocation: function () {
                return poodle.ImageLocation.create(this
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
            /** @returns {poodle.ImageLocation} */
            toImageLocation: function () {
                return poodle.ImageLocation.create(this.toPath());
            }
        },
        false, false, false
    );
}());
