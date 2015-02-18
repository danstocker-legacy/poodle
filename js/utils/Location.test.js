/*global dessert, troop, sntls, e$, b$, m$, s$, poodle, c$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Location");

    test("Instantiation", function () {
        expect(4);

        raises(function () {
            poodle.Location.create();
        }, "should raise exception on absent argument");

        raises(function () {
            poodle.Location.create('foo>bar');
        }, "should raise exception on invalid argument");

        poodle.Location.addMocks({
            setEventPath: function (eventPath) {
                equal(eventPath.toString(), 'location>foo>bar', "should set event path prepended with root key");
            }
        });

        var locationPath = 'foo>bar'.toPath(),
            location = poodle.Location.create(locationPath);

        poodle.Location.removeMocks();

        strictEqual(location.locationPath, locationPath, "should set path to the passed argument");
    });

    test("Equality tester", function () {
        raises(function () {
            poodle.Location.create('foo/bar'.toPath()).equals('foo');
        }, "should raise exception on invalid argument");

        var MyLocation = poodle.Location.extend();

        raises(function () {
            poodle.Location.create('foo/bar'.toPath()).equals(MyLocation.create());
        }, "should raise exception on base mismatch");

        ok(!poodle.Location.create('foo/bar'.toPath()).equals(undefined),
            "should return false for no argument");
        ok(!poodle.Location.create('foo/bar'.toPath()).equals(poodle.Location.create('hello/world'.toPath())),
            "should return false for different location");
        ok(poodle.Location.create('foo/bar'.toPath()).equals(poodle.Location.create('foo/bar'.toPath())),
            "should return true for location w/ same path");
    });

    test("Appending", function () {
        var location = poodle.Location.create('foo/bar'.toPath()),
            appended = location.append(poodle.Location.create('baz'.toPath()));

        ok(appended.isA(poodle.Location), "should return Location instance");
        notStrictEqual(location, appended, "should return different Location instance");
        equal(appended.toString(), 'foo/bar/baz', "should append specified location to current");
    });

    test("Prepending", function () {
        var location = poodle.Location.create('foo/bar'.toPath()),
            prepended = location.prepend(poodle.Location.create('baz'.toPath()));

        ok(prepended.isA(poodle.Location), "should return Location instance");
        notStrictEqual(location, prepended, "should return different Location instance");
        equal(prepended.toString(), 'baz/foo/bar', "should append specified location to current");
    });

    test("Conversion to string", function () {
        var location = poodle.Location.create('foo/bar'.toPath());
        equal(location.toString(), 'foo/bar', "should return location in slash notation");
    });

    test("Subclass conversion to string", function () {
        var MyLocation = poodle.Location.extend()
                .addConstants({
                    LOCATION_ROOT_PATH: 'baz'
                }),
            location = MyLocation.create('foo/bar'.toPath());

        equal(location.toString(), 'baz/foo/bar', "should return location with root in slash notation");
    });
}());
