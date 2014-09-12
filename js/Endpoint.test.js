/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Endpoint");

    test("Instantiation", function () {
        expect(4);

        raises(function () {
            p$.Endpoint.create();
        }, "should raise exception on absent argument");

        raises(function () {
            p$.Endpoint.create('foo>bar');
        }, "should raise exception on invalid argument");

        p$.Endpoint.addMocks({
            setEventPath: function (eventPath) {
                equal(eventPath.toString(), 'endpoint>foo>bar', "should set event path prepended with root key");
            }
        });

        var endpointPath = 'foo>bar'.toPath(),
            endpoint = p$.Endpoint.create(endpointPath);

        p$.Endpoint.removeMocks();

        strictEqual(endpoint.endpointPath, endpointPath, "should set endpointPath to the passed argument");
    });

    test("Conversion from string", function () {
        var endpoint = 'foo/bar'.toEndpoint();

        ok(endpoint.isA(p$.Endpoint), "should return Endpoint instance");
        equal(endpoint.endpointPath.toString(), 'foo>bar',
            "should set endpointPath to the one specified in slash notation");

        equal('//foo/bar//'.toEndpoint().endpointPath.toString(), 'foo>bar',
            "should remove leading and trailing slashes from string notation");
    });

    test("Conversion from array", function () {
        var endpoint = ['foo', 'bar'].toEndpoint();

        ok(endpoint.isA(p$.Endpoint), "should return Endpoint instance");
        equal(endpoint.endpointPath.toString(), 'foo>bar',
            "should set endpointPath to the one specified as array");
    });

    test("Conversion from Path", function () {
        var endpointPath = 'foo>bar'.toPath(),
            endpoint = endpointPath.toEndpoint();

        ok(endpoint.isA(p$.Endpoint), "should return Endpoint instance");
        strictEqual(endpoint.endpointPath, endpointPath,
            "should set endpointPath to the one that was converted");
    });

    test("Equality tester", function () {
        raises(function () {
            'foo/bar'.toEndpoint().equals('foo');
        }, "should raise exception on invalid argument");

        ok(!'foo/bar'.toEndpoint().equals(undefined), "should return false for no argument");
        ok(!'foo/bar'.toEndpoint().equals('hello/world'.toEndpoint()), "should return false for different endpoint");
        ok('foo/bar'.toEndpoint().equals('foo/bar'.toEndpoint()), "should return true for endpoint w/ same endpointPath");
    });

    test("Conversion to string", function () {
        var endpoint = 'foo/bar'.toEndpoint();
        equal(endpoint.toString(), 'foo/bar', "should return endpoint in slash notation");
    });
}());
