/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Image Location");

    test("Conversion from string", function () {
        var imageLocation = 'foo/bar'.toImageLocation();

        ok(imageLocation.isA(p$.ImageLocation), "should return ImageLocation instance");
        equal(imageLocation.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified in slash notation");

        equal('//foo/bar//'.toImageLocation().locationPath.toString(), 'foo>bar',
            "should remove leading and trailing slashes from string notation");
    });

    test("Conversion from array", function () {
        var imageLocation = ['foo', 'bar'].toImageLocation();

        ok(imageLocation.isA(p$.ImageLocation), "should return ImageLocation instance");
        equal(imageLocation.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified as array");
    });

    test("Conversion from Path", function () {
        var locationPath = 'foo>bar'.toPath(),
            imageLocation = locationPath.toImageLocation();

        ok(imageLocation.isA(p$.ImageLocation), "should return ImageLocation instance");
        strictEqual(imageLocation.locationPath, locationPath,
            "should set locationPath to the one that was converted");
    });
}());
