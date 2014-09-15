/*global dessert, troop, sntls, e$, b$, m$, s$, p$, c$, $ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Service", {
        setup: function () {
            p$.Service.promiseRegistry.clear();
        }
    });

    test("Instantiation", function () {
        raises(function () {
            p$.Service.create();
        }, "should raise exception on absent argument");

        raises(function () {
            p$.Service.create('foo');
        }, "should raise exception on invalid argument");

        var request = 'foo/bar'.toRequest(),
            service = p$.Service.create(request);

        strictEqual(service.request, request, "should set request property");
        strictEqual(service.eventPath, service.request.endpoint.eventPath, "should set eventPath property");
    });

    test("Conversion from Request", function () {
        var request = 'foo/bar'.toRequest(),
            service = request.toService();

        ok(service.isA(p$.Service), "should return Service instance");
        strictEqual(service.request, request, "should set request property");
    });

    test("Calling service", function () {
        expect(5);

        var request = 'foo/bar'.toRequest(),
            service = request.toService(),
            promise = $.Deferred().promise();

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
            },

            triggerSync: function (eventName) {
                equal(eventName, this.EVENT_SERVICE_START, "should trigger service start event");
            }
        });

        p$.Service.promiseRegistry.addMocks({
            setItem: function (key, value) {
                equal(key, request.toString(), "should set promise in registry");
                strictEqual(value, promise, "should pass promise to registry setter");
            }
        });

        strictEqual(service.callService(), promise, "should return promise from ajax call");

        p$.Service.promiseRegistry.removeMocks();
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

        p$.ServiceEvent.addMocks({
            triggerSync: function (path) {
                if (this.eventName === p$.Service.EVENT_SERVICE_SUCCESS) {
                    ok(true, "should trigger success event");
                    ok(path.equals(request.endpoint.eventPath, "should trigger event on endpoint's event path"));
                    strictEqual(this.request, request, "should set request on event");
                    strictEqual(this.responseNode, responseNode, "should set responseNode on event");
                    strictEqual(this.jqXhr, jqXhr, "should set jqXhr on event");
                }
            }
        });

        p$.Service.promiseRegistry.addMocks({
            deleteItem: function (key) {
                equal(key, request.toString(), "should remove promise from registry");
            }
        });

        service.callService();

        p$.ServiceEvent.removeMocks();
        p$.Service.promiseRegistry.removeMocks();
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

        p$.ServiceEvent.addMocks({
            triggerSync: function (path) {
                if (this.eventName === p$.Service.EVENT_SERVICE_FAILURE) {
                    ok(true, "should trigger failure event");
                    ok(path.equals(request.endpoint.eventPath, "should trigger event on endpoint's event path"));
                    strictEqual(this.request, request, "should set request on event");
                    strictEqual(this.responseNode, errorThrown, "should set responseNode on event");
                    strictEqual(this.jqXhr, jqXhr, "should set jqXhr on event");
                }
            }
        });

        p$.Service.promiseRegistry.addMocks({
            deleteItem: function (key) {
                equal(key, request.toString(), "should remove promise from registry");
            }
        });

        service.callService();

        p$.ServiceEvent.removeMocks();
        p$.Service.promiseRegistry.removeMocks();
    });
}());
