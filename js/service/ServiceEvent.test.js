/*global dessert, troop, sntls, e$, b$, m$, s$, poodle, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Service Event");

    test("Instantiation", function () {
        var serviceEvent = poodle.ServiceEvent.create('foo');

        ok(serviceEvent.hasOwnProperty('request'), "should initialize request property");
        equal(serviceEvent.request, undefined, "should set request property to undefined");
        ok(serviceEvent.hasOwnProperty('responseNode'), "should initialize responseNode property");
        equal(serviceEvent.responseNode, undefined, "should set responseNode property to undefined");
        ok(serviceEvent.hasOwnProperty('jqXhr'), "should initialize jqXhr property");
        equal(serviceEvent.jqXhr, undefined, "should set jqXhr property to undefined");
    });

    test("Event surrogate", function () {
        ok(e$.Event.create('foo', poodle.serviceEventSpace).isA(poodle.ServiceEvent), "should return ServiceEvent instance");
    });

    test("Spawning event", function () {
        ok(poodle.serviceEventSpace.spawnEvent('foo').isA(poodle.ServiceEvent), "should return ServiceEvent instance");
    });

    test("Request setter", function () {
        var request = 'foo/bar'.toRequest(),
            serviceEvent = poodle.ServiceEvent.create('foo');

        raises(function () {
            serviceEvent.setRequest('foo');
        }, "should raise exception on invalid argument");

        strictEqual(serviceEvent.setRequest(request), serviceEvent, "should be chainable");
        strictEqual(serviceEvent.request, request, "should set request property");
    });

    test("Request parameter getter", function () {
        expect(3);

        var serviceEvent = poodle.ServiceEvent.create('foo'),
            requestParam = {};

        equal(serviceEvent.getRequestParam('bar'), undefined,
            "should return undefined when there is no request set");

        serviceEvent.setRequest('foo/bar'.toRequest());

        serviceEvent.request.params.addMocks({
            getItem: function (key) {
                equal(key, 'bar', "should fetch specified item from request params");
                return requestParam;
            }
        });

        var result = serviceEvent.getRequestParam('bar');

        strictEqual(result, requestParam, "should return value taken from request params collection");
    });

    test("Response node setter", function () {
        var responseNode = {},
            serviceEvent = poodle.ServiceEvent.create('foo');

        strictEqual(serviceEvent.setResponseNode(responseNode), serviceEvent, "should be chainable");
        strictEqual(serviceEvent.responseNode, responseNode, "should set responseNode property");
    });

    test("Response node getter", function () {
        expect(5);

        var serviceEvent = poodle.ServiceEvent.create('foo')
                .setResponseNode({}),
            responseNode = {};

        raises(function () {
            serviceEvent.getResponseNode('foo');
        }, "should raise exception on invalid argument");

        strictEqual(serviceEvent.getResponseNode(), serviceEvent.responseNode,
            "should return responseNode property when no path is specified");

        sntls.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this.items, serviceEvent.responseNode, "should fetch node from responseNode");
                equal(path.toString(), 'foo>bar', "should fetch node from specified path");
                return responseNode;
            }
        });

        strictEqual(serviceEvent.getResponseNode('foo>bar'.toPath()), responseNode,
            "should return node fetched from within tha responseNode property");

        sntls.Tree.removeMocks();
    });

    test("Response hash getter", function () {
        expect(7);

        var serviceEvent = poodle.ServiceEvent.create('foo')
                .setResponseNode({}),
            responseNode = {},
            result;

        raises(function () {
            serviceEvent.getResponseNode('foo');
        }, "should raise exception on invalid argument");

        result = serviceEvent.getResponseNodeAsHash();
        ok(result.isA(sntls.Hash), "should return a Hash instance");
        strictEqual(result.items, serviceEvent.responseNode,
            "should return responseNode property when no path is specified");

        sntls.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this.items, serviceEvent.responseNode, "should fetch node from responseNode");
                equal(path.toString(), 'foo>bar', "should fetch node from specified path");
                return responseNode;
            }
        });

        result = serviceEvent.getResponseNodeAsHash('foo>bar'.toPath());

        sntls.Tree.removeMocks();

        ok(result.isA(sntls.Hash), "should return a Hash instance");
        strictEqual(result.items, responseNode,
            "should return node fetched from within the responseNode property");
    });

    test("Response field getter", function () {
        var serviceEvent = poodle.ServiceEvent.create('foo');

        equal(serviceEvent.getResponseField('hello'), undefined,
            "should return undefined when no responseNode is set");

        serviceEvent.setResponseNode({
            hello: 'world',
            mona : 'lisa'
        });

        equal(serviceEvent.getResponseField('mona'), 'lisa',
            "should return specified property of responseNode");
    });

    test("XHR setter", function () {
        var jqXhr = {},
            serviceEvent = poodle.ServiceEvent.create('foo');

        strictEqual(serviceEvent.setJqXhr(jqXhr), serviceEvent, "should be chainable");
        strictEqual(serviceEvent.jqXhr, jqXhr, "should set jqZhr property");
    });

    test("HTTP status getter", function () {
        var jqXhr = {status: 1},
            serviceEvent = poodle.ServiceEvent.create('foo')
                .setJqXhr(jqXhr);

        equal(serviceEvent.getHttpStatus(), 1, "should return jqXHR object's status property");
    });

    test("Cloning", function () {
        var serviceEvent = poodle.ServiceEvent.create('foo')
                .setRequest('foo/bar'.toRequest())
                .setResponseNode({})
                .setJqXhr({}),
            result;

        result = serviceEvent.clone('foo>bar'.toPath());

        ok(result.isA(poodle.ServiceEvent), "should return ServiceEvent instance");
        notStrictEqual(result, serviceEvent, "should return a different ServiceEvent instance");
        strictEqual(result.request, serviceEvent.request, "should set request property on clone");
        strictEqual(result.responseNode, serviceEvent.responseNode, "should set responseNode property on clone");
        strictEqual(result.jqXhr, serviceEvent.jqXhr, "should set jqXhr property on clone");
    });
}());
