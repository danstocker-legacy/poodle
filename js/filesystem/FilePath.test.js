/*global dessert, troop, sntls, poodle */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("FilePath");

    test("Conversion from string", function () {
        var filePath = 'foo/bar'.toFilePath();

        ok(filePath.isA(poodle.FilePath), "should return FilePath instance");
        equal(filePath.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified in slash notation");

        equal('//foo/bar//'.toFilePath().locationPath.toString(), 'foo>bar',
            "should remove leading and trailing slashes from string notation");
    });

    test("Conversion from array", function () {
        var filePath = ['foo', 'bar'].toFilePath();

        ok(filePath.isA(poodle.FilePath), "should return FilePath instance");
        equal(filePath.locationPath.toString(), 'foo>bar',
            "should set locationPath to the one specified as array");
    });

    test("Conversion from Path", function () {
        var locationPath = 'foo>bar'.toPath(),
            filePath = locationPath.toFilePath();

        ok(filePath.isA(poodle.FilePath), "should return FilePath instance");
        strictEqual(filePath.locationPath, locationPath,
            "should set locationPath to the one that was converted");
    });

    test("File loading", function () {
        expect(2);

        var filePath = 'foo/bar'.toFilePath(),
            promise = {};

        poodle.File.addMocks({
            readFile: function () {
                strictEqual(this.filePath, filePath, "should load file for specified path");
                return promise;
            }
        });

        strictEqual(filePath.readFile(), promise, "should return promise from File.readFile");

        poodle.File.removeMocks();
    });

    test("Synchronous file loading", function () {
        expect(2);

        var filePath = 'foo/bar'.toFilePath(),
            promise = {};

        poodle.File.addMocks({
            readFileSync: function () {
                strictEqual(this.filePath, filePath, "should load file for specified path synchronously");
                return promise;
            }
        });

        strictEqual(filePath.readFileSync(), promise, "should return promise from File.readFileSync");

        poodle.File.removeMocks();
    });
}());
