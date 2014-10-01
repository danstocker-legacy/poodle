/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Request");

    test("Instantiation", function () {
        raises(function () {
            p$.Request.create();
        }, "should raise exception on absent arguments");

        raises(function () {
            p$.Request.create('foo');
        }, "should raise exception on invalid endpoint argument");

        raises(function () {
            p$.Request.create('foo/bar'.toEndpoint(), 'foo');
        }, "should raise exception on invalid parameters argument");

        var endpoint = 'foo/bar'.toEndpoint(),
            params = {},
            request = p$.Request.create(endpoint, params);

        strictEqual(request.endpoint, endpoint, "should set endpoint property to the one specified");
        equal(request.httpMethod, 'GET', "should set HTTP method property to 'GET'");
        ok(request.headers.isA(sntls.Collection), "should initialize headers property as Collection instance");
        equal(request.headers.getKeyCount(), 0, "should set headers property to an empty Collection");
        ok(request.params.isA(sntls.Collection), "should initialize params property as Collection instance");
        strictEqual(request.params.items, params, "should set params buffer to the one specified");
    });

    test("Conversion from string", function () {
        var params = {},
            request = 'foo/bar'.toRequest(params);

        ok(request.isA(p$.Request), "should return a Request instance");
        equal(request.endpoint.toString(), 'foo/bar', "should set endpoint to one based on the string");
        strictEqual(request.params.items, params, "should set params to the one specified");
    });

    test("Conversion from array", function () {
        var params = {},
            request = ['foo', 'bar'].toRequest(params);

        ok(request.isA(p$.Request), "should return a Request instance");
        equal(request.endpoint.toString(), 'foo/bar', "should set endpoint to one based on the array");
        strictEqual(request.params.items, params, "should set params to the one specified");
    });

    test("Conversion from Endpoint", function () {
        var params = {},
            endpoint = 'foo/bar'.toEndpoint(),
            request = endpoint.toRequest(params);

        ok(request.isA(p$.Request), "should return a Request instance");
        strictEqual(request.endpoint, endpoint, "should set endpoint property to the endpoint converted");
        strictEqual(request.params.items, params, "should set params to the one specified");
    });

    test("HTTP method setter", function () {
        var request = 'foo/bar'.toRequest();

        raises(function () {
            request.setHttpMethod('foo');
        }, "should raise exception on invalid HTTP method name");

        strictEqual(request.setHttpMethod('OPTIONS'), request, "should be chainable");
        equal(request.httpMethod, 'OPTIONS', "should set HTTP method property to the one specified");
    });

    test("Request body format setter", function () {
        var request = 'foo/bar'.toRequest();

        raises(function () {
            request.setBodyFormat('foo');
        }, "should raise exception on invalid body format");

        strictEqual(request.setBodyFormat('json'), request, "should be chainable");
        equal(request.bodyFormat, 'json', "should set bodyFormat property to the one specified");
    });

    test("Header addition", function () {
        expect(4);

        var request = 'foo/bar'.toRequest();

        raises(function () {
            request.setHeader({});
        }, "should raise exception on invalid arguments");

        request.headers.addMocks({
            setItem: function (key, value) {
                equal(key, 'hello', "should pass key to header collection item setter");
                equal(value, 'world', "should pass value to header collection item setter");
            }
        });

        strictEqual(request.setHeader('hello', 'world'), request, "should be chainable");
    });

    test("Headers addition", function () {
        var request = 'foo/bar'.toRequest(),
            addedItems = [];

        request.headers.addMocks({
            setItem: function (key, value) {
                addedItems.push([key, value]);
            }
        });

        strictEqual(request.addHeaders({
            hello: 'world',
            mona : 'lisa'
        }), request, "should be chainable");

        deepEqual(addedItems, [
            ['hello', 'world'],
            ['mona', 'lisa']
        ], "should add all key-value pairs to headers collection");
    });

    test("Parameter addition", function () {
        expect(4);

        var request = 'foo/bar'.toRequest();

        raises(function () {
            request.addParam({});
        }, "should raise exception on invalid arguments");

        request.params.addMocks({
            setItem: function (key, value) {
                equal(key, 'hello', "should pass key to param collection item setter");
                equal(value, 'world', "should pass value to param collection item setter");
            }
        });

        strictEqual(request.setParam('hello', 'world'), request, "should be chainable");
    });

    test("Parameters addition", function () {
        var request = 'foo/bar'.toRequest(),
            addedItems = [];

        request.params.addMocks({
            setItem: function (key, value) {
                addedItems.push([key, value]);
            }
        });

        strictEqual(request.addParams({
            hello: 'world',
            mona : 'lisa'
        }), request, "should be chainable");

        deepEqual(addedItems, [
            ['hello', 'world'],
            ['mona', 'lisa']
        ], "should add all key-value pairs to params collection");
    });

    test("Ajax option addition", function () {
        expect(4);

        var request = 'foo/bar'.toRequest();

        raises(function () {
            request.setAjaxOption({});
        }, "should raise exception on invalid arguments");

        request.ajaxOptions.addMocks({
            setItem: function (key, value) {
                equal(key, 'hello', "should pass key to ajax option collection item setter");
                equal(value, 'world', "should pass value to ajax option collection item setter");
            }
        });

        strictEqual(request.setAjaxOption('hello', 'world'), request, "should be chainable");
    });

    test("Ajax options addition", function () {
        var request = 'foo/bar'.toRequest(),
            addedItems = [];

        request.ajaxOptions.addMocks({
            setItem: function (key, value) {
                addedItems.push([key, value]);
            }
        });

        strictEqual(request.addAjaxOptions({
            hello: 'world',
            mona : 'lisa'
        }), request, "should be chainable");

        deepEqual(addedItems, [
            ['hello', 'world'],
            ['mona', 'lisa']
        ], "should add all key-value pairs to ajax option collection");
    });
}());
