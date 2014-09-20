/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Image Url");

    test("Conversion from string", function () {
        var imageUrl = 'foo/bar'.toImageUrl();

        ok(imageUrl.isA(p$.ImageUrl), "should return ImageUrl instance");
        equal(imageUrl.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified in slash notation");

        equal('//foo/bar//'.toImageUrl().locationPath.toString(), 'foo>bar',
            "should remove leading and trailing slashes from string notation");
    });

    test("Conversion from array", function () {
        var imageUrl = ['foo', 'bar'].toImageUrl();

        ok(imageUrl.isA(p$.ImageUrl), "should return ImageUrl instance");
        equal(imageUrl.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified as array");
    });

    test("Conversion from Path", function () {
        var locationPath = 'foo>bar'.toPath(),
            imageUrl = locationPath.toImageUrl();

        ok(imageUrl.isA(p$.ImageUrl), "should return ImageUrl instance");
        strictEqual(imageUrl.locationPath, locationPath,
            "should set locationPath to the one that was converted");
    });

    test("Image loading", function () {
        expect(2);

        var imageUrl = 'foo/bar'.toImageUrl(),
            promise = {};

        p$.Image.addMocks({
            loadImage: function () {
                strictEqual(this.imageUrl, imageUrl, "should load image for specified URL");
                return promise;
            }
        });

        strictEqual(imageUrl.loadImage(), promise, "should return promise from Image.loadImage");

        p$.Image.removeMocks();
    });
}());
