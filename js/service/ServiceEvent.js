/*global dessert, troop, sntls, evan, poodle */
troop.postpone(poodle, 'ServiceEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * @name poodle.ServiceEvent.create
     * @function
     * @param {string} eventName Event name
     * @returns {poodle.ServiceEvent}
     */

    /**
     * @class
     * @extends evan.Event
     */
    poodle.ServiceEvent = self
        .addMethods(/** @lends poodle.ServiceEvent# */{
            /**
             * @param {string} eventName Event name
             * @ignore
             */
            init: function (eventName) {
                base.init.call(this, eventName, poodle.serviceEventSpace);

                /** @type {poodle.Request} */
                this.request = undefined;

                /** @type {*} */
                this.responseNode = undefined;

                /** @type {jQuery.jqXHR} */
                this.jqXhr = undefined;
            },

            /**
             * @param {poodle.Request} request
             * @returns {poodle.ServiceEvent}
             */
            setRequest: function (request) {
                dessert.isRequest(request, "Invalid request");
                this.request = request;
                return this;
            },

            /**
             * @param {string} paramName
             * @returns {string}
             */
            getRequestParam: function (paramName) {
                return this.request ?
                    this.request.params.getItem(paramName) :
                    undefined;
            },

            /**
             * @param {*} responseNode
             * @returns {poodle.ServiceEvent}
             */
            setResponseNode: function (responseNode) {
                this.responseNode = responseNode;
                return this;
            },

            /**
             * @param {sntls.Path} [path]
             * @returns {*}
             */
            getResponseNode: function (path) {
                dessert.isPathOptional(path, "Invalid path");
                return path ?
                    sntls.Tree.create(this.responseNode).getNode(path) :
                    this.responseNode;
            },

            /**
             * @param {sntls.Path} path
             * @returns {sntls.Hash}
             */
            getResponseNodeAsHash: function (path) {
                dessert.isPathOptional(path, "Invalid path");
                return path ?
                    sntls.Tree.create(this.responseNode).getNodeAsHash(path) :
                    sntls.Hash.create(this.responseNode);
            },

            /**
             * @param {string} fieldName
             * @returns {*}
             */
            getResponseField: function (fieldName) {
                dessert.isString(fieldName, "Invalid field name");
                var responseNode = this.responseNode;
                return responseNode ?
                    responseNode[fieldName] :
                    undefined;
            },

            /**
             * @param {jQuery.jqXHR} jqXhr
             * @returns {poodle.ServiceEvent}
             */
            setJqXhr: function (jqXhr) {
                this.jqXhr = jqXhr;
                return this;
            },

            /**
             * @param {sntls.Path} [currentPath]
             * @returns {poodle.ServiceEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {poodle.ServiceEvent} */base.clone.call(this, currentPath);

                return clone
                    .setRequest(this.request)
                    .setResponseNode(this.responseNode)
                    .setJqXhr(this.jqXhr);
            }
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event
        .addSurrogate(poodle, 'ServiceEvent', function (eventName, eventSpace) {
            return eventSpace === poodle.serviceEventSpace;
        });
});
