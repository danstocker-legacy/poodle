/*global dessert, troop, sntls, evan, Q, jQuery, poodle */
/*jshint node:true */
troop.postpone(poodle, 'File', function () {
    "use strict";

    var fs = require('fs'),
        base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * Creates an File instance.
     * @name poodle.File.create
     * @function
     * @param {poodle.FilePath} filePath File location.
     * @returns {poodle.File}
     */

    /**
     * File implements file operations for local files using the Node filesystem (fs) API.
     * New methods should follow the fs naming conventions.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    poodle.File = self
        .addConstants(/** @lends poodle.File */{
            /**
             * Signals that file started loading.
             * @constant
             */
            EVENT_FILE_LOAD_START: 'file-load-start',

            /**
             * Signals that image has finished loading.
             * @constant
             */
            EVENT_FILE_LOAD_SUCCESS: 'file-load-success',

            /**
             * Signals that image failed to load.
             * @constant
             */
            EVENT_FILE_LOAD_FAILURE: 'file-load-failure'
        })
        .addPrivateMethods(/** @lends poodle.File# */{
            /**
             * @param {string} filename
             * @param {object} options
             * @param {function} callback
             * @private
             */
            _readFileProxy: function (filename, options, callback) {
                fs.readFile(filename, options, callback);
            }
        })
        .addMethods(/** @lends poodle.File# */{
            /**
             * @param {poodle.FilePath} filePath
             * @ignore
             */
            init: function (filePath) {
                dessert.isLocation(filePath, "Invalid image URL");

                evan.Evented.init.call(this);

                /**
                 * Local path to the current file.
                 * @type {poodle.FilePath}
                 */
                this.filePath = filePath;

                this
                    .setEventSpace(poodle.fileSystemEventSpace)
                    .setEventPath(filePath.eventPath);
            },

            /**
             * Reads the current local file, triggering events and returning a promise.
             * @returns {Q.Promise}
             */
            readFile: function () {
                var that = this,
                    filePath = this.filePath,
                    eventPath = this.eventPath,
                    deferred = Q.defer(),
                    event;

                this.spawnEvent(this.EVENT_FILE_LOAD_START)
                    .setFilePath(filePath)
                    .triggerSync(eventPath);

                this._readFileProxy(filePath.toString(), null, function (err, data) {
                    if (err) {
                        event = that.spawnEvent(that.EVENT_FILE_LOAD_FAILURE)
                            .setFilePath(filePath)
                            .setFileError(err)
                            .triggerSync(eventPath);

                        deferred.reject(event);
                    } else {
                        event = that.spawnEvent(that.EVENT_FILE_LOAD_SUCCESS)
                            .setFilePath(filePath)
                            .setFileData(data)
                            .triggerSync(eventPath);

                        deferred.resolve(event);
                    }
                });

                return deferred.promise;
            }
        });
}, jQuery);

troop.amendPostponed(poodle, 'FilePath', function () {
    "use strict";

    poodle.FilePath
        .addMethods(/** @lends poodle.ImageUrl */{
            /**
             * Converts `FilePath` to `File`.
             * @returns {poodle.File}
             */
            toFile: function () {
                return poodle.File.create(this);
            }
        });
});
