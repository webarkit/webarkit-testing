; (function () {
    'use strict'

    var scope;
    if (typeof window !== 'undefined') {
        scope = window;
    } else {
        scope = self;
    }

var ARtest = function () {
  console.log('This is a test from the js API!');
}

ARtest.prototype.log = function () {
  scope.webarkit.test();
}

ARtest.prototype.init = function (data, cols, rows) {
  scope.webarkit.initTracking(data, cols, rows);
}

// WebARKit exported JS API
//
var webarkit = {
  //test: test
};

var FUNCTIONS = [
    'test',
    'initTracking'
];

function runWhenLoaded() {
    FUNCTIONS.forEach(function (n) {
        webarkit[n] = Module[n];
    });

    for (var m in Module) {
        if (m.match(/^AR/))
            webarkit[m] = Module[m];
    }
}


/* Exports */
scope.webarkit = webarkit;
scope.ARtest = ARtest;

if (scope.Module) {
    scope.Module.onRuntimeInitialized = function () {
        runWhenLoaded();
        var event = new Event('webarkit-loaded');
        scope.dispatchEvent(event);
    };
} else {
    scope.Module = {
        onRuntimeInitialized: function () {
            runWhenLoaded();
        }
    };
}
})();
