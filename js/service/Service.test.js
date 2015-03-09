/*global dessert, troop, sntls, e$, b$, m$, s$, poodle, c$, $ */
/*global module, test, start, asyncTest, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Service", {
        setup: function () {
            poodle.Throttler.promiseRegistry.clear();
        },

        teardown: function () {
            poodle.Throttler.promiseRegistry.clear();
        }
    });

    test("Instantiation", function () {
        raises(function () {
            poodle.Service.create();
        }, "should raise exception on absent argument");

        raises(function () {
            poodle.Service.create('foo');
        }, "should raise exception on invalid argument");

        var request = 'foo/bar'.toRequest(),
            service = poodle.Service.create(request);

        strictEqual(service.request, request, "should set request property");
        equal(service.retryCount, 0, "should set retryCount property to 0");
        equal(service.retryDelay, 1000, "should set retryDelay property to 1000 [ms]");
        strictEqual(service.eventPath, service.request.endpoint.eventPath, "should set eventPath property");
    });

    test("Conversion from Request", function () {
        var request = 'foo/bar'.toRequest(),
            service = request.toService();

        ok(service.isA(poodle.Service), "should return Service instance");
        strictEqual(service.request, request, "should set request property");
    });

    test("Retry count setter", function () {
        var service = 'foo/bar'.toRequest().toService();

        raises(function () {
            service.setRetryCount();
        }, "should raise exception on missing arguments");

        raises(function () {
            service.setRetryCount('foo');
        }, "should raise exception on invalid arguments");

        strictEqual(service.setRetryCount(3), service, "should be chainable");
        equal(service.retryCount, 3, "should set retryCount property");
    });

    test("Retry count setter", function () {
        var service = 'foo/bar'.toRequest().toService();

        raises(function () {
            service.setRetryDelay();
        }, "should raise exception on missing arguments");

        raises(function () {
            service.setRetryDelay('foo');
        }, "should raise exception on invalid arguments");

        strictEqual(service.setRetryDelay(3000), service, "should be chainable");
        equal(service.retryDelay, 3000, "should set retryDelay property");
    });

    test("Ajax option addition", function () {
        expect(4);

        var service = 'foo/bar'.toRequest().toService();

        raises(function () {
            service.setAjaxOption({});
        }, "should raise exception on invalid arguments");

        service.ajaxOptions.addMocks({
            setItem: function (key, value) {
                equal(key, 'hello', "should pass key to ajax option collection item setter");
                equal(value, 'world', "should pass value to ajax option collection item setter");
            }
        });

        strictEqual(service.setAjaxOption('hello', 'world'), service, "should be chainable");
    });

    test("Ajax options addition", function () {
        var service = 'foo/bar'.toRequest().toService(),
            addedItems = [];

        service.ajaxOptions.addMocks({
            setItem: function (key, value) {
                addedItems.push([key, value]);
            }
        });

        strictEqual(service.addAjaxOptions({
            hello: 'world',
            mona : 'lisa'
        }), service, "should be chainable");

        deepEqual(addedItems, [
            ['hello', 'world'],
            ['mona', 'lisa']
        ], "should add all key-value pairs to ajax option collection");
    });

    test("Calling service", function () {
        expect(7);

        var request = 'foo/bar'.toRequest(),
            service = request.toService()
                .setRetryCount(3),
            promise = $.Deferred().promise();

        raises(function () {
            service.callService('foo');
        }, "should raise exception on invalid custom ajax options");

        service.addMocks({
            _ajaxProxy: function (options) {
                deepEqual(
                    options,
                    {
                        dataType: "json",
                        type    : 'GET',
                        url     : 'foo/bar'.toEndpoint().toString(),
                        headers : {},
                        data    : {},
                        timeout : this.SERVICE_TIMEOUT
                    },
                    "should call jQuery ajax with correct options"
                );
                return promise;
            }
        });

        poodle.PromiseLoop.addMocks({
            retryOnFail: function (handler, retryCount, retryDelay) {
                equal(retryCount, 3, "should pass retry count to promise loop");
                equal(retryDelay, 1000, "should pass retry delay to promise loop");
                return handler();
            }
        });

        poodle.Throttler.promiseRegistry.addMocks({
            setItem: function (key, value) {
                equal(key, request.toString(), "should set promise in registry");
                strictEqual(value, promise, "should pass promise to registry setter");
            }
        });

        strictEqual(service.callService(), promise, "should return promise from ajax call");

        poodle.PromiseLoop.removeMocks();
        poodle.Throttler.promiseRegistry.removeMocks();
    });

    test("Calling service with custom options", function () {
        expect(1);

        var request = 'foo/bar'.toRequest(),
            service = request.toService()
                .setAjaxOption('foo', 'bar');

        service.addMocks({
            _ajaxProxy: function (options) {
                equal(options.foo, 'bar', "should merge custom ajax options from request");
                return $.Deferred().promise();
            }
        });

        service.callService();
    });

    test("Calling service with ad hoc custom options", function () {
        expect(1);

        var request = 'foo/bar'.toRequest(),
            service = request.toService();

        service.addMocks({
            _ajaxProxy: function (options) {
                equal(options.async, false, "should merge specified custom ajax options");
                return $.Deferred().promise();
            }
        });

        service.callService({
            async: false
        });
    });

    test("Calling service with custom override options", function () {
        expect(1);

        var request = 'foo/bar'.toRequest(),
            service = request.toService();

        service.addMocks({
            _ajaxProxy: function (options) {
                equal(options.timeout, 0, "should override specified ajax options");
                return $.Deferred().promise();
            }
        });

        service.callService({
            timeout: 0
        });
    });

    test("Successful service call", function () {
        expect(6);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            deferred = $.Deferred(),
            responseNode = {},
            textStatus = 'hello',
            jqXhr = {};

        service.addMocks({
            _ajaxProxy: function () {
                return deferred.resolve(responseNode, textStatus, jqXhr);
            }
        });

        poodle.ServiceEvent.addMocks({
            triggerSync: function (path) {
                if (this.eventName === poodle.Service.EVENT_SERVICE_SUCCESS) {
                    ok(true, "should trigger success event");
                    ok(path.equals(request.endpoint.eventPath, "should trigger event on endpoint's event path"));
                    strictEqual(this.request, request, "should set request on event");
                    strictEqual(this.responseNode, responseNode, "should set responseNode on event");
                    strictEqual(this.jqXhr, jqXhr, "should set jqXhr on event");
                }
            }
        });

        poodle.Throttler.promiseRegistry.addMocks({
            deleteItem: function (key) {
                equal(key, request.toString(), "should remove promise from registry");
            }
        });

        service.callService();

        poodle.ServiceEvent.removeMocks();
        poodle.Throttler.promiseRegistry.removeMocks();
    });

    test("Failed service call", function () {
        expect(6);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            deferred = $.Deferred(),
            responseNode = {},
            textStatus = 'hello',
            errorThrown = 'error',
            jqXhr = {};

        service.addMocks({
            _ajaxProxy: function () {
                return deferred.reject(jqXhr, textStatus, errorThrown);
            }
        });

        poodle.ServiceEvent.addMocks({
            triggerSync: function (path) {
                if (this.eventName === poodle.Service.EVENT_SERVICE_FAILURE) {
                    ok(true, "should trigger failure event");
                    ok(path.equals(request.endpoint.eventPath, "should trigger event on endpoint's event path"));
                    strictEqual(this.request, request, "should set request on event");
                    strictEqual(this.responseNode, errorThrown, "should set responseNode on event");
                    strictEqual(this.jqXhr, jqXhr, "should set jqXhr on event");
                }
            }
        });

        poodle.Throttler.promiseRegistry.addMocks({
            deleteItem: function (key) {
                equal(key, request.toString(), "should remove promise from registry");
            }
        });

        service.callService();

        poodle.ServiceEvent.removeMocks();
        poodle.Throttler.promiseRegistry.removeMocks();
    });

    test("Synchronous service call", function () {
        expect(2);

        var service = 'foo/bar'.toRequest().toService(),
            promise = {};

        service.addMocks({
            callService: function (ajaxOptions) {
                deepEqual(ajaxOptions, {async: false, foo: 'bar'}, "should add async:false to custom ajax options");
                return promise;
            }
        });

        strictEqual(service.callServiceSync({foo: 'bar'}), promise, "should return promise from .callService");
    });

    test("Synchronous service call with conflict", function () {
        expect(1);

        var service = 'foo/bar'.toRequest().toService();

        service.addMocks({
            callService: function (ajaxOptions) {
                deepEqual(ajaxOptions, {async: false}, "should override async ajax option");
            }
        });

        service.callServiceSync({async: 'foo'});
    });

    test("Calling service on JSON request", function () {
        expect(2);

        var params = {
                hello: 'world'
            },
            service = 'foo/bar'.toRequest()
                .setBodyFormat('json')
                .addParams(params)
                .toService();

        service.addMocks({
            _ajaxProxy: function (ajaxOptions) {
                equal(ajaxOptions.data, JSON.stringify(params), "should set ajax data option to stringified params");
                equal(ajaxOptions.headers['Content-Type'], 'application/json', "should set/overwrite content type header");
                return $.Deferred().resolve();
            }
        });

        service.callService();
    });

    asyncTest("Successful offline service call", function () {
        expect(3);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            offlineResponseNode = {};

        service.addMocks({
            _triggerEvents: function (ajaxPromise) {
                ajaxPromise.done(function (responseNode, textStatus, jqXHR) {
                    strictEqual(responseNode, offlineResponseNode, "should pass response node to resolved promise");
                    strictEqual(textStatus, null, "should pass null as textStatus to resolved promise");
                    deepEqual(jqXHR, {status: 200}, "should pass object with status as jqXhr to resolved promise");
                    start();
                });
            }
        });

        service.callOfflineServiceWithSuccess(offlineResponseNode);
    });

    asyncTest("Failed offline service call", function () {
        expect(3);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            offlineErrorThrown = {};

        service.addMocks({
            _triggerEvents: function (ajaxPromise) {
                ajaxPromise.fail(function (jqXHR, textStatus, errorThrown) {
                    deepEqual(jqXHR, {status: 400}, "should pass object with status as jqXhr to rejected promise");
                    strictEqual(textStatus, null, "should pass null as textStatus to rejected promise");
                    strictEqual(errorThrown, offlineErrorThrown, "should pass errorThrown to rejected promise");
                    start();
                });
            }
        });

        service.callOfflineServiceWithFailure(offlineErrorThrown);
    });

    test("Successful synchronous offline service call", function () {
        expect(4);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            offlineResponseNode = {};

        service.addMocks({
            _triggerEvents: function (ajaxPromise) {
                equal(ajaxPromise.state(), 'resolved', "should call internal service method with resolved ajax promise");
                ajaxPromise.done(function (responseNode, textStatus, jqXHR) {
                    strictEqual(responseNode, offlineResponseNode, "should pass response node to resolved promise");
                    strictEqual(textStatus, null, "should pass null as textStatus to resolved promise");
                    strictEqual(jqXHR, null, "should pass null as jqXhr to resolved promise");
                });
            }
        });

        service.callOfflineServiceWithSuccessSync(offlineResponseNode);
    });

    test("Failed synchronous offline service call", function () {
        expect(4);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            offlineErrorThrown = {};

        service.addMocks({
            _triggerEvents: function (ajaxPromise) {
                equal(ajaxPromise.state(), 'rejected', "should call internal service method with rejected ajax promise");
                ajaxPromise.fail(function (jqXHR, textStatus, errorThrown) {
                    strictEqual(jqXHR, null, "should pass null as jqXhr to rejected promise");
                    strictEqual(textStatus, null, "should pass null as textStatus to rejected promise");
                    strictEqual(errorThrown, offlineErrorThrown, "should pass errorThrown to rejected promise");
                });
            }
        });

        service.callOfflineServiceWithFailureSync(offlineErrorThrown);
    });
}());
