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
     * The ServiceEvent class represents an event that relates to services. Offers an API to access the internals
     * of relevant properties, eg. the response node of the service that triggered the event.
     * Service events are usually triggered at different stages of a service call.
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

                /**
                 * Request associated with the event.
                 * @type {poodle.Request}
                 */
                this.request = undefined;

                /**
                 * Custom data associated with the event.
                 * @type {*}
                 */
                this.responseNode = undefined;

                /**
                 * jQuery XHR object associated with the event.
                 * @type {jQuery.jqXHR}
                 */
                this.jqXhr = undefined;
            },

            /**
             * Sets request property.
             * @param {poodle.Request} request
             * @returns {poodle.ServiceEvent}
             */
            setRequest: function (request) {
                dessert.isRequest(request, "Invalid request");
                this.request = request;
                return this;
            },

            /**
             * Fetches the value of the specified request parameter.
             * @param {string} paramName
             * @returns {string}
             */
            getRequestParam: function (paramName) {
                return this.request ?
                    this.request.params.getItem(paramName) :
                    undefined;
            },

            /**
             * Sets the response data node property.
             * @param {*} responseNode
             * @returns {poodle.ServiceEvent}
             */
            setResponseNode: function (responseNode) {
                this.responseNode = responseNode;
                return this;
            },

            /**
             * Fetches a data node from inside the response node at the specified path.
             * Treats the response node as a `Tree` instance.
             * @example
             * var node = event.getResponseNode('foo>bar'.toPath());
             * @param {sntls.Path} [path] Path pointing to the node to be fetched. When absent,
             * the entire `responseNode` will be returned.
             * @returns {*}
             */
            getResponseNode: function (path) {
                dessert.isPathOptional(path, "Invalid path");
                return path ?
                    sntls.Tree.create(this.responseNode).getNode(path) :
                    this.responseNode;
            },

            /**
             * Fetches data node from the response node, wrapped in a `Hash` instance.
             * @param {sntls.Path} [path] Path pointing to the node to be fetched. When absent,
             * the entire `responseNode` will be returned.
             * @returns {sntls.Hash}
             * @see poodle.ServiceEvent#getResponseNode
             */
            getResponseNodeAsHash: function (path) {
                dessert.isPathOptional(path, "Invalid path");
                return path ?
                    sntls.Tree.create(this.responseNode).getNodeAsHash(path) :
                    sntls.Hash.create(this.responseNode);
            },

            /**
             * Fetches the value of the specified response field. Equivalent to `.getResponseNode()` called
             * with a primitive path.
             * @example
             * var field = event.getResponseField('foo');
             * // equivalent to:
             * var node = event.getResponseNode('foo'.toPath());
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
             * Sets jQuery XHR property.
             * @param {jQuery.jqXHR} jqXhr
             * @returns {poodle.ServiceEvent}
             */
            setJqXhr: function (jqXhr) {
                this.jqXhr = jqXhr;
                return this;
            },

            /**
             * Clones event. In addition to `evan.Event.clone()`, also copies service-specific properties
             * (by reference).
             * @param {sntls.Path} [currentPath]
             * @returns {poodle.ServiceEvent}
             * @see evan.Event#clone
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
