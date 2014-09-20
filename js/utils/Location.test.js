/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Location");

    test("Instantiation", function () {
        expect(4);

        raises(function () {
            p$.Location.create();
        }, "should raise exception on absent argument");

        raises(function () {
            p$.Location.create('foo>bar');
        }, "should raise exception on invalid argument");

        p$.Location.addMocks({
            setEventPath: function (eventPath) {
                equal(eventPath.toString(), 'location>foo>bar', "should set event path prepended with root key");
            }
        });

        var locationPath = 'foo>bar'.toPath(),
            location = p$.Location.create(locationPath);

        p$.Location.removeMocks();

        strictEqual(location.locationPath, locationPath, "should set path to the passed argument");
    });

    test("Equality tester", function () {
        raises(function () {
            p$.Location.create('foo/bar'.toPath()).equals('foo');
        }, "should raise exception on invalid argument");

        ok(!p$.Location.create('foo/bar'.toPath()).equals(undefined),
            "should return false for no argument");
        ok(!p$.Location.create('foo/bar'.toPath()).equals(p$.Location.create('hello/world'.toPath())),
            "should return false for different location");
        ok(p$.Location.create('foo/bar'.toPath()).equals(p$.Location.create('foo/bar'.toPath())),
            "should return true for location w/ same path");
    });

    test("Conversion to string", function () {
        var location = p$.Location.create('foo/bar'.toPath());
        equal(location.toString(), 'foo/bar', "should return location in slash notation");
    });
}());
