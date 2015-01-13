/*global dessert, troop, sntls, evan, bookworm, milkman, shoehine, candystore, poodle, Q, app */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("QPromiseCollection");

    test("Conversion from Hash", function () {
        var hash = sntls.Hash.create(),
            promiseCollection = hash.toQPromiseCollection();

        ok(promiseCollection.isA(poodle.QPromiseCollection), "should return poodle.QPromiseCollection instance");
    });

    test("Conversion from Array", function () {
        var promise1 = Q.defer().promise,
            promise2 = Q.defer().promise,
            array = [promise1, promise2],
            promiseCollection = array.toQPromiseCollection();

        ok(promiseCollection.isA(poodle.QPromiseCollection), "should return poodle.QPromiseCollection instance");
        deepEqual(promiseCollection.items, [promise1, promise2], "should set collection contents");
    });

    asyncTest("Resolving all promises", function () {
        expect(1);

        var deferred1 = Q.defer(),
            deferred2 = Q.defer(),
            array = [deferred1.promise, deferred2.promise],
            promiseCollection = array.toQPromiseCollection();

        promiseCollection.getJoinedPromise()
            .then(function () {
                ok(true, "should resolve joined promise");
                start();
            });

        deferred1.resolve();
        deferred2.resolve();
    });

    asyncTest("Rejecting single promise", function () {
        expect(1);

        var deferred1 = Q.defer(),
            deferred2 = Q.defer(),
            array = [deferred1.promise, deferred2.promise],
            promiseCollection = array.toQPromiseCollection();

        promiseCollection.getJoinedPromise()
            .catch(function () {
                ok(true, "should reject joined promise");
                start();
            });

        deferred1.reject();
    });
}());
