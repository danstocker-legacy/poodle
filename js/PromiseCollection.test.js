/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$, jQuery */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function (/**jQuery*/$) {
    "use strict";

    var deferreds, promises;

    module("Promise Collection", {
        setup: function () {
            deferreds = [
                $.Deferred(),
                $.Deferred(),
                $.Deferred(),
                $.Deferred()
            ];

            promises = [
                deferreds[0].promise(),
                deferreds[1].promise(),
                deferreds[2].promise(),
                deferreds[3].promise()
            ];
        }
    });

    test("Conversion from array", function () {
        var promiseCollection = promises.toPromiseCollection();

        ok(promiseCollection.isA(p$.PromiseCollection), "should return a PromiseCollection instance");
        strictEqual(promiseCollection.items, promises, "should set items buffer to promises array");
    });

    test("Conversion from Hash", function () {
        var promiseHash = promises.toHash(),
            promiseCollection = promiseHash.toPromiseCollection();

        ok(promiseCollection.isA(p$.PromiseCollection), "should return a PromiseCollection instance");
        strictEqual(promiseCollection.items, promises, "should set items buffer to promises array");
    });

    test("Joining", function () {
        var promiseCollection = [
                deferreds[0].promise(),
                deferreds[1].promise(),
                deferreds[2].promise(),
                deferreds[3].promise()
            ]
                .toPromiseCollection(),
            resolved = false;

        promiseCollection.getJoinedPromise()
            .done(function () {
                resolved = true;
            });

        deferreds[0].resolve();
        ok(!resolved);

        deferreds[3].resolve();
        ok(!resolved);

        deferreds[1].resolve();
        ok(!resolved);

        deferreds[2].resolve();
        ok(resolved, "should resolve when all promises in the collection are resolved");
    });
}(jQuery));
