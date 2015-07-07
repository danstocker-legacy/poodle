/*global dessert, troop, sntls, e$, b$, m$, s$, poodle, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Endpoint");

    test("Conversion from string", function () {
        var endpoint = 'foo/bar'.toEndpoint();

        ok(endpoint.isA(poodle.Endpoint), "should return Endpoint instance");
        equal(endpoint.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified in slash notation");

        equal('//foo/bar//'.toEndpoint().locationPath.toString(), '>foo>bar',
            "should remove leading and trailing slashes from string notation");
    });

    test("Conversion from array", function () {
        var endpoint = ['foo', 'bar'].toEndpoint();

        ok(endpoint.isA(poodle.Endpoint), "should return Endpoint instance");
        ok(endpoint.isA(poodle.Endpoint), "should return Endpoint instance");
        equal(endpoint.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified as array");
    });

    test("Conversion from Path", function () {
        var locationPath = 'foo>bar'.toPath(),
            endpoint = locationPath.toEndpoint();

        ok(endpoint.isA(poodle.Endpoint), "should return Endpoint instance");
        strictEqual(endpoint.locationPath, locationPath,
            "should set locationPath to the one that was converted");
    });
}());
