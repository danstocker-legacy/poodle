/*global dessert, troop, sntls, evan, jQuery, poodle */
troop.postpone(poodle, 'FilePath', function () {
    "use strict";

    var base = poodle.Location,
        self = base.extend();

    /**
     * Creates an FilePath instance.
     * @name poodle.FilePath.create
     * @function
     * @param {sntls.Path} imagePath
     * @returns {poodle.FilePath}
     */

    /**
     * The FilePath is a Location that allows loading of local files.
     * @class
     * @extends poodle.Location
     */
    poodle.FilePath = self
        .addConstants(/** @lends poodle.FilePath */{
            /**
             * Root path for all file event paths.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'file'
        })
        .addMethods(/** @lends poodle.FilePath# */{
            /**
             * @param {sntls.Path} filePath
             * @ignore
             */
            init: function (filePath) {
                base.init.call(this, filePath);
                this.setEventSpace(poodle.fileSystemEventSpace);
            },

            /**
             * Reads the file at the current path.
             * @returns {Q.Promise}
             */
            readFile: function () {
                return poodle.File.create(this).readFile();
            },

            /**
             * @returns {*}
             */
            readFileSync: function () {
                return poodle.File.create(this).readFileSync();
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path# */{
        /**
         * Converts `Path` to `FilePath`.
         * @returns {poodle.FilePath}
         */
        toFilePath: function () {
            return poodle.FilePath.create(this);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `FilePath`.
             * @returns {poodle.FilePath}
             */
            toFilePath: function () {
                return poodle.FilePath.create(this
                    .replace(poodle.FilePath.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
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
             * Converts `Array` to `FilePath`.
             * @returns {poodle.FilePath}
             */
            toFilePath: function () {
                return poodle.FilePath.create(this.toPath());
            }
        },
        false, false, false
    );
}());
