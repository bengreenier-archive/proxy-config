/// <reference path="../typings/index.d.ts" />
'use strict';

const fs = require('fs');

/**
 * Create a proxy-config for the given json file
 * Currently only json is supported
 * 
 * @param {String} path the path to the json file
 * @param {Boolean} preload optional flag indicating we should preload all values from the json file
 * @returns {Object} proxy config object
 */
module.exports = (path, preload) => {
    preload = preload || false;

    let target = {};

    if (preload) {
        target = deserialize(path, null);
    }

    target._path = path;

    // return a proxy object
    return new Proxy(target, {
        get: (obj, prop) => {
            if (typeof(obj[prop]) === "undefined") {
                obj[prop] = deserialize(target._path, prop);
            }
            return obj[prop];
        },
        set: (obj, prop, value) => {
            obj[prop] = value;

            serialize(target._path, prop, value);

            return true;
        }
    });
};

/**
 * Write to a given property-value to a given fileName
 * This is abstracted out to support other filetypes in the future
 * 
 * @param {String} filename the filename to write to
 * @param {String} property the property name to use
 * @param {Object} value the value to write
 * @returns void
 */
const serialize = (fileName, property, value) => {
    let file;
    let json = {};

    try
    {
        file = fs.readFileSync(fileName);
        json = JSON.parse(file.toString());
        
    } catch (ex) {
        // we swallow this because it means we should just be creating the file
    }

    json[property] = value;

    return fs.writeFileSync(fileName, JSON.stringify(json));
}

/**
 * Parses a file for a given property
 * This is abstracted out to support other filetypes in the future
 * 
 * @param {String} filename the filename to parse
 * @param {String} property the property name to parse
 * @returns {Object} value if there is one
 */
const deserialize = (fileName, property) => {
    let file = fs.readFileSync(fileName);

    let json = JSON.parse(file.toString());

    return property == null ? json : json[property];
}