/*global dessert, troop, sntls, e$, b$, m$, s$, poodle, c$, $ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Image");

    test("Instantiation", function () {
        raises(function () {
            poodle.Image.create();
        }, "should raise exception on no arguments");

        raises(function () {
            poodle.Image.create('foo');
        }, "should raise exception on invalid argument");

        var imageUrl = 'foo/bar'.toImageUrl(),
            image = poodle.Image.create(imageUrl);

        strictEqual(image.imageUrl, imageUrl, "should set imageUrl property");
        strictEqual(image.eventPath, imageUrl.eventPath, "should set eventPath property");
    });

    test("Conversion from ImageUrl", function () {
        var imageUrl = 'foo/bar'.toImageUrl(),
            image = imageUrl.toImage();

        ok(image.isA(poodle.Image), "should return an Image instance");
        strictEqual(image.imageUrl, imageUrl, "should set imageUrl property to self");
    });

    test("Successful image loading", function () {
        expect(14);

        var image = 'foo/bar'.toImageUrl().toImage(),
            imageElement = document.createElement('img'),
            deferred = $.Deferred();

        image.addMocks({
            _createImageElementProxy: function () {
                ok(true, "should create image element");
                return imageElement;
            },

            _loadImage: function (element, srcAttribute) {
                strictEqual(element, imageElement, "should load image into created image element");
                equal(srcAttribute, image.imageUrl.toString(),
                    "should set image src attribute to serialized image URL");
                return deferred.promise();
            }
        });

        'foo/bar'.toImageUrl()
            .subscribeTo(poodle.Image.EVENT_IMAGE_LOAD_START, function (event) {
                ok(event.isA(poodle.ImageEvent), "should trigger image load start event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger start event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            })
            .subscribeTo(poodle.Image.EVENT_IMAGE_LOAD_SUCCESS, function (event) {
                ok(event.isA(poodle.ImageEvent), "should trigger image load success event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger success event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            });

        image.loadImage()
            .done(function (location, element) {
                ok(true, "should resolve returned promise");
                strictEqual(location, image.imageUrl,
                    "should set promise's  to imagimageLocatione loader's imageUrl");
                strictEqual(element, imageElement,
                    "should set promise's imageElement to created image element");
            });

        deferred.resolve();

        'foo/bar'.toImageUrl().unsubscribeFrom();
    });

    test("Failed image loading", function () {
        expect(14);

        var image = 'foo/bar'.toImageUrl().toImage(),
            imageElement = document.createElement('img'),
            deferred = $.Deferred();

        image.addMocks({
            _createImageElementProxy: function () {
                ok(true, "should create image element");
                return imageElement;
            },

            _loadImage: function (element, srcAttribute) {
                strictEqual(element, imageElement, "should load image into created image element");
                equal(srcAttribute, image.imageUrl.toString(),
                    "should set image src attribute to serialized image URL");
                return deferred.promise();
            }
        });

        'foo/bar'.toImageUrl()
            .subscribeTo(poodle.Image.EVENT_IMAGE_LOAD_START, function (event) {
                ok(event.isA(poodle.ImageEvent), "should trigger image load start event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger start event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            })
            .subscribeTo(poodle.Image.EVENT_IMAGE_LOAD_FAILURE, function (event) {
                ok(event.isA(poodle.ImageEvent), "should trigger image load failure event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger failure event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            });

        image.loadImage()
            .fail(function (location, element) {
                ok(true, "should reject returned promise");
                strictEqual(location, image.imageUrl,
                    "should set promise's  to imagimageLocatione loader's imageUrl");
                strictEqual(element, imageElement,
                    "should set promise's imageElement to created image element");
            });

        deferred.reject();

        'foo/bar'.toImageUrl().unsubscribeFrom();
    });
}());
