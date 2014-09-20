/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/utils/Deferred.js',
            'js/utils/Promise.js',
            'js/utils/PromiseCollection.js',
            'js/service/serviceEventSpace.js',
            'js/service/Endpoint.js',
            'js/service/Request.js',
            'js/service/ServiceEvent.js',
            'js/service/Service.js',
            'js/image/imageEventSpace.js',
            'js/image/ImageUrl.js',
            'js/image/ImageEvent.js',
            'js/image/ImageLoader.js',
            'js/exports.js'
        ],

        test: [
            'js/utils/jsTestDriver.conf',
            'js/service/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true,
            evan   : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
