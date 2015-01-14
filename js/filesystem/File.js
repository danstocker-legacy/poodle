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
     * TODO: Perhaps throttler could be class-level?
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
            EVENT_FILE_READ_START: 'file-read-start',

            /**
             * Signals that image has finished loading.
             * @constant
             */
            EVENT_FILE_READ_SUCCESS: 'file-read-success',

            /**
             * Signals that image failed to load.
             * @constant
             */
            EVENT_FILE_READ_FAILURE: 'file-read-failure'
        })
        .addPrivateMethods(/** @lends poodle.File# */{
            /**
             * @param {string} filename
             * @param {object} options
             * @param {function} callback
             * @private
             */
            _readFileProxy: function (filename, options, callback) {
                return fs.readFile(filename, options, callback);
            },

            /**
             * @param {string} filename
             * @param {object} options
             * @returns {*}
             * @private
             */
            _readFileSyncProxy: function (filename, options) {
                return fs.readFileSync(filename, options);
            },

            /**
             * @returns {Q.Promise}
             * @private
             */
            _readFile: function () {
                var that = this,
                    filePath = this.filePath,
                    eventPath = this.eventPath,
                    deferred = Q.defer(),
                    event;

                this.spawnEvent(this.EVENT_FILE_READ_START)
                    .setFilePath(filePath)
                    .triggerSync(eventPath);

                this._readFileProxy(filePath.toString(), null, function (err, data) {
                    if (err) {
                        event = that.spawnEvent(that.EVENT_FILE_READ_FAILURE)
                            .setFilePath(filePath)
                            .setFileError(err)
                            .triggerSync(eventPath);

                        deferred.reject(event);
                    } else {
                        event = that.spawnEvent(that.EVENT_FILE_READ_SUCCESS)
                            .setFilePath(filePath)
                            .setFileData(data)
                            .triggerSync(eventPath);

                        deferred.resolve(event);
                    }
                });

                return deferred.promise;
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

                this.elevateMethod('_readFile');

                /**
                 * Local path to the current file.
                 * @type {poodle.FilePath}
                 */
                this.filePath = filePath;

                /** @type {poodle.Throttler} */
                this.readFileThrottler = this._readFile.toThrottler();

                this
                    .setEventSpace(poodle.fileSystemEventSpace)
                    .setEventPath(filePath.eventPath);
            },

            /**
             * Reads the current local file, triggering events and returning a promise.
             * @returns {Q.Promise}
             */
            readFile: function () {
                return this.readFileThrottler.runThrottled(this.filePath.toString());
            },

            /**
             * Reads the current local file synchronously, triggering events, and returning the buffer.
             * @returns {*}
             */
            readFileSync: function () {
                var filePath = this.filePath,
                    eventPath = this.eventPath,
                    data;

                this.spawnEvent(this.EVENT_FILE_READ_START)
                    .setFilePath(filePath)
                    .triggerSync(eventPath);

                try {
                    data = this._readFileSyncProxy(filePath.toString(), null);

                    this.spawnEvent(this.EVENT_FILE_READ_SUCCESS)
                        .setFilePath(filePath)
                        .setFileData(data)
                        .triggerSync(eventPath);
                } catch (e) {
                    this.spawnEvent(this.EVENT_FILE_READ_FAILURE)
                        .setFilePath(filePath)
                        .setFileError(e)
                        .triggerSync(eventPath);
                }

                return data;
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
