/*global dessert, troop, sntls, evan, bookworm, milkman, shoehine, candystore, poodle, $ */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PromiseLoop");

    test("Successful call", function () {
        expect(2);

        poodle.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $.Deferred().resolve('foo');
            })
            .done(function (arg) {
                equal(arg, 'foo', "should return a resolved promise");
            });
    });

    test("Failure with no retries", function () {
        expect(2);

        poodle.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $.Deferred().reject('foo');
            })
            .fail(function (arg) {
                equal(arg, 'foo', "should return a failed promise");
            });
    });

    test("Failure with one retry", function () {
        expect(3);

        poodle.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler"); // will be hit 2x
                return $.Deferred().reject('foo');
            }, 1)
            .fail(function (arg) {
                equal(arg, 'foo', "should return a failed promise");
            });
    });

    test("Failure with retries and notifications", function () {
        expect(3);

        var promises = [
                $.Deferred().reject('foo'),
                $.Deferred().resolve('bar')
            ],
            i = 0;

        poodle.PromiseLoop
            .retryOnFail(function () {
                return promises[i++];
            }, 2)
            .progress(function (stop, arg) {
                equal(typeof stop, 'function', "should indicate progress");
                equal(arg, 'foo', "should pass rejection arguments to progress handler");
            })
            .done(function (arg) {
                equal(arg, 'bar', "should return first resolved promise");
            });
    });
}());
