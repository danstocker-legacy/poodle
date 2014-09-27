Poodle
======

*Transport framework*

Provides an API for managing service calls and static image loading that is a) evented (based on [evan](https://github.com/danstocker/evan)) and b) is consistent with the OOP principles laid down in [troop](https://github.com/production-minds/troop).

[Reference](http://danstocker.github.io/poodle)

Examples
--------

[jsFiddle](http://jsfiddle.net/danstocker/gua4vLdn/)

POSTing to an endpoint:

    '/endpoint/path'.toEndpoint().toRequest()
        .setHttpMethod('POST')
        .addParam('param', 'value')
        .toService()
            .callService();

Capturing the service's successful return:

    '/endpoint/path'.toEndpoint()
        .subscribeTo(p$.Service.EVENT_SERVICE_SUCCESS, function (event) {
            console.log("service returned with response", event.responseNode);
        })

Loading a static image:

    '/images/foo.jpg'.toImageUrl()
        .loadImage();

Capturing the successful loading of the image into an image element:

    '/images/foo.jpg'.toImageUrl()
        .subscribeTo(p$.Image.EVENT_IMAGE_LOAD_SUCCESS, function (event) {
            console.log("image loaded into", event.imageElement);
        });
