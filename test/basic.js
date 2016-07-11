/// <reference path="../typings/index.d.ts" />
'use strict';

const assert = require('assert');
const fs = require('fs');
const proxyConfig = require('../lib/index');

describe("proxy-config", function () {
    let TEST_CONFIG = "./test/helpers/test-config.json";

    beforeEach(function () {
        // we create this before the tests
        fs.writeFileSync(TEST_CONFIG, JSON.stringify({
            a: true,
            b: false,
            c: "string",
            d: 1
        }));
    });

    afterEach(function () {
        // we kill this after the tests
        try {
        fs.unlinkSync(TEST_CONFIG);
        } catch (ex) {
            // we swallow this since it's nbd if the file is already gone
        }
    });

    it("should preload", function () {
        let obj = proxyConfig(TEST_CONFIG, true);

        fs.unlinkSync(TEST_CONFIG);

        assert.equal(obj.a, true);
        assert.equal(obj.b, false);
        assert.equal(obj.c, "string");
        assert.equal(obj.d, 1);
    });

    it("should proxy", function () {
        let obj = proxyConfig(TEST_CONFIG, false);
        assert.equal(obj.a, true);

        let implicitFalse = proxyConfig(TEST_CONFIG);
        assert.equal(implicitFalse.b, false);

        fs.unlinkSync(TEST_CONFIG);

        assert.throws(function () {
            assert.equal(implicitFalse.c, "string");
        }, "expected inability to access un-cached property c");

        assert.equal(implicitFalse.b, false, "expect ability to access cached property b");
    });

    it("should write", function () {
        fs.unlinkSync(TEST_CONFIG);

        let obj = proxyConfig(TEST_CONFIG);

        obj["kittens"] = "so cute";

        var json = JSON.parse(fs.readFileSync(TEST_CONFIG).toString());

        assert.equal(json["kittens"], "so cute");
    });
});