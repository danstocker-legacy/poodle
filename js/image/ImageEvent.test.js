/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Image Event");

    test("Instantiation", function () {
        var serviceEvent = p$.ImageEvent.create('foo');

        ok(serviceEvent.hasOwnProperty('imageLocation'), "should initialize imageLocation property");
        equal(serviceEvent.imageLocation, undefined, "should set imageLocation property to undefined");
        ok(serviceEvent.hasOwnProperty('imageElement'), "should initialize imageElement property");
        equal(serviceEvent.imageElement, undefined, "should set imageElement property to undefined");
    });

    test("Event surrogate", function () {
        ok(e$.Event.create('foo', p$.imageEventSpace).isA(p$.ImageEvent), "should return ImageEvent instance");
    });

    test("Spawning event", function () {
        ok(p$.imageEventSpace.spawnEvent('foo').isA(p$.ImageEvent), "should return ImageEvent instance");
    });

    test("Image location setter", function () {
        var imageLocation = 'foo/bar'.toImageLocation(),
            imageEvent = p$.ImageEvent.create('foo');

        raises(function () {
            imageEvent.setImageLocation('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageLocation(imageLocation), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageLocation, imageLocation, "should set imageLocation property");
    });

    test("Image element setter", function () {
        var imageElement = document.createElement('img'),
            imageEvent = p$.ImageEvent.create('foo');

        raises(function () {
            imageEvent.setImageElement('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageElement(imageElement), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageElement, imageElement, "should set imageElement property");
    });

    test("Cloning", function () {
        var imageEvent = p$.ImageEvent.create('foo')
                .setImageLocation('foo/bar'.toImageLocation())
                .setImageElement(document.createElement('img')),
            result;

        result = imageEvent.clone('foo>bar'.toPath());

        ok(result.isA(p$.ImageEvent), "should return ImageEvent instance");
        notStrictEqual(result, imageEvent, "should return a different ImageEvent instance");
        strictEqual(result.imageLocation, imageEvent.imageLocation, "should set imageLocation property on clone");
        strictEqual(result.imageElement, imageEvent.imageElement, "should set imageElement property on clone");
    });
}());
