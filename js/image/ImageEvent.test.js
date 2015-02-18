/*global dessert, troop, sntls, e$, b$, m$, s$, poodle, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Image Event");

    test("Instantiation", function () {
        var serviceEvent = poodle.ImageEvent.create('foo');

        ok(serviceEvent.hasOwnProperty('imageUrl'), "should initialize imageUrl property");
        equal(serviceEvent.imageUrl, undefined, "should set imageUrl property to undefined");
        ok(serviceEvent.hasOwnProperty('imageElement'), "should initialize imageElement property");
        equal(serviceEvent.imageElement, undefined, "should set imageElement property to undefined");
    });

    test("Event surrogate", function () {
        ok(e$.Event.create('foo', poodle.imageEventSpace).isA(poodle.ImageEvent), "should return ImageEvent instance");
    });

    test("Spawning event", function () {
        ok(poodle.imageEventSpace.spawnEvent('foo').isA(poodle.ImageEvent), "should return ImageEvent instance");
    });

    test("Image location setter", function () {
        var imageUrl = 'foo/bar'.toImageUrl(),
            imageEvent = poodle.ImageEvent.create('foo');

        raises(function () {
            imageEvent.setImageLocation('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageLocation(imageUrl), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageUrl, imageUrl, "should set imageUrl property");
    });

    test("Image element setter", function () {
        var imageElement = document.createElement('img'),
            imageEvent = poodle.ImageEvent.create('foo');

        raises(function () {
            imageEvent.setImageElement('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageElement(imageElement), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageElement, imageElement, "should set imageElement property");
    });

    test("Cloning", function () {
        var imageEvent = poodle.ImageEvent.create('foo')
                .setImageLocation('foo/bar'.toImageUrl())
                .setImageElement(document.createElement('img')),
            result;

        result = imageEvent.clone('foo>bar'.toPath());

        ok(result.isA(poodle.ImageEvent), "should return ImageEvent instance");
        notStrictEqual(result, imageEvent, "should return a different ImageEvent instance");
        strictEqual(result.imageUrl, imageEvent.imageUrl, "should set imageUrl property on clone");
        strictEqual(result.imageElement, imageEvent.imageElement, "should set imageElement property on clone");
    });
}());
