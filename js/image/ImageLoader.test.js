/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$, $ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Image Loader");

    test("Instantiation", function () {
        raises(function () {
            p$.ImageLoader.create();
        }, "should raise exception on no arguments");

        raises(function () {
            p$.ImageLoader.create('foo');
        }, "should raise exception on invalid argument");

        var imageLocation = 'foo/bar'.toImageLocation(),
            imageLoader = p$.ImageLoader.create(imageLocation);

        strictEqual(imageLoader.imageLocation, imageLocation, "should set imageLocation property");
        strictEqual(imageLoader.eventPath, imageLocation.eventPath, "should set eventPath property");
    });

    test("Conversion from ImageLocation", function () {
        var imageLocation = 'foo/bar'.toImageLocation(),
            imageLoader = imageLocation.toImageLoader();

        ok(imageLoader.isA(p$.ImageLoader), "should return an ImageLoader instance");
        strictEqual(imageLoader.imageLocation, imageLocation, "should set imageLocation property to self");
    });

    test("Successful image loading", function () {
        expect(12);

        var imageLoader = 'foo/bar'.toImageLocation().toImageLoader(),
            imageElement = document.createElement('img'),
            deferred = $.Deferred();

        imageLoader.addMocks({
            _createImageElementProxy: function () {
                ok(true, "should create image element");
                return imageElement;
            },

            _loadImage: function (element, srcAttribute) {
                strictEqual(element, imageElement, "should load image into created image element");
                equal(srcAttribute, imageLoader.imageLocation.toString(),
                    "should set image src attribute to serialized image location");
                return deferred.promise();
            }
        });

        'foo/bar'.toImageLocation()
            .subscribeTo(p$.ImageLoader.EVENT_IMAGE_LOAD_START, function (event) {
                ok(event.isA(p$.ImageEvent), "should trigger image load start event");
                strictEqual(event.imageLocation, imageLoader.imageLocation,
                    "should set event's imageLocation to image loader's imageLocation");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            })
            .subscribeTo(p$.ImageLoader.EVENT_IMAGE_LOAD_SUCCESS, function (event) {
                ok(event.isA(p$.ImageEvent), "should trigger image load success event");
                strictEqual(event.imageLocation, imageLoader.imageLocation,
                    "should set event's imageLocation to image loader's imageLocation");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            });

        imageLoader.loadImage()
            .done(function (location, element) {
                ok(true, "should resolve returned promise");
                strictEqual(location, imageLoader.imageLocation,
                    "should set promise's  to imagimageLocatione loader's imageLocation");
                strictEqual(element, imageElement,
                    "should set promise's imageElement to created image element");
            });

        deferred.resolve();

        'foo/bar'.toImageLocation().unsubscribeFrom();
    });

    test("Failed image loading", function () {
        expect(12);

        var imageLoader = 'foo/bar'.toImageLocation().toImageLoader(),
            imageElement = document.createElement('img'),
            deferred = $.Deferred();

        imageLoader.addMocks({
            _createImageElementProxy: function () {
                ok(true, "should create image element");
                return imageElement;
            },

            _loadImage: function (element, srcAttribute) {
                strictEqual(element, imageElement, "should load image into created image element");
                equal(srcAttribute, imageLoader.imageLocation.toString(),
                    "should set image src attribute to serialized image location");
                return deferred.promise();
            }
        });

        'foo/bar'.toImageLocation()
            .subscribeTo(p$.ImageLoader.EVENT_IMAGE_LOAD_START, function (event) {
                ok(event.isA(p$.ImageEvent), "should trigger image load start event");
                strictEqual(event.imageLocation, imageLoader.imageLocation,
                    "should set event's imageLocation to image loader's imageLocation");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            })
            .subscribeTo(p$.ImageLoader.EVENT_IMAGE_LOAD_FAILURE, function (event) {
                ok(event.isA(p$.ImageEvent), "should trigger image load failure event");
                strictEqual(event.imageLocation, imageLoader.imageLocation,
                    "should set event's imageLocation to image loader's imageLocation");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            });

        imageLoader.loadImage()
            .fail(function (location, element) {
                ok(true, "should reject returned promise");
                strictEqual(location, imageLoader.imageLocation,
                    "should set promise's  to imagimageLocatione loader's imageLocation");
                strictEqual(element, imageElement,
                    "should set promise's imageElement to created image element");
            });

        deferred.reject();

        'foo/bar'.toImageLocation().unsubscribeFrom();
    });
}());
