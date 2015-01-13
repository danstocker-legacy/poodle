/*global dessert, troop, sntls, evan, jQuery, poodle */
/*jshint node:true */
troop.postpone(poodle, 'FileEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * Creates an FileEvent instance.
     * @name poodle.FileEvent.create
     * @function
     * @param {string} eventName Event name
     * @returns {poodle.FileEvent}
     */

    /**
     * @class
     * @extends evan.Event
     */
    poodle.FileEvent = self
        .addMethods(/** @lends poodle.FileEvent# */{
            /**
             * @param {string} eventName Event name
             * @ignore
             */
            init: function (eventName) {
                base.init.call(this, eventName, poodle.fileSystemEventSpace);

                /** @type {poodle.FilePath} */
                this.filePath = undefined;

                /** @type {Error} */
                this.fileError = undefined;

                /** @type {*} */
                this.fileData = undefined;
            },

            /**
             * @param {poodle.FilePath} filePath
             * @returns {poodle.FileEvent}
             */
            setFilePath: function (filePath) {
                dessert.isLocation(filePath, "Invalid location");
                this.filePath = filePath;
                return this;
            },

            /**
             * @param {Error} fileError
             * @returns {poodle.FileEvent}
             */
            setFileError: function (fileError) {
                dessert.assert(fileError instanceof Error, "Invalid file error");
                this.fileError = fileError;
                return this;
            },

            /**
             * @param {string} fileData
             * @returns {poodle.FileEvent}
             */
            setFileData: function (fileData) {
                this.fileData = fileData;
                return this;
            },

            /**
             * Clones event instance. In addition to `evan.Event.clone()`, also copies file-specific properties
             * (by reference).
             * @param {sntls.Path} [currentPath]
             * @returns {poodle.FileEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {poodle.FileEvent} */base.clone.call(this, currentPath);

                return clone
                    .setFilePath(this.filePath)
                    .setFileError(this.fileError)
                    .setFileData(this.fileData);
            }
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event
        .addSurrogate(poodle, 'FileEvent', function (eventName, eventSpace) {
            return eventSpace === poodle.fileSystemEventSpace;
        });
});
