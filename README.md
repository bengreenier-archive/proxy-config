# proxy-config

[![Build Status](https://travis-ci.org/bengreenier/proxy-config.svg?branch=master)](https://travis-ci.org/bengreenier/proxy-config)

use es6 proxies to read and write config files

# How?

## To Install?

Well that's easy - just `npm install proxy-config`

## To Use?

> Note: You need a version of node that supports proxies! See [node.green](http://node.green/#Proxy)

Example:
```
let proxyConfig = require('proxy-config');

# Create a proxy
let myConfigProxy = proxyConfig("config.json");

# access properties
let value = myConfigProxy.value;
myConfigProxy.value2 = "value2";
```

Values will be read from config when they are accessed and stored to config when they are set.

See more in [the tests](./test).

## To Optimize?

If you're using this in __production__, you probably don't want to hit the disk to get all your config options.
To preload all values in config into the cache at construction, pass `true` as the second argument:
```
let proxyConfig = require('proxy-config');

# Create a proxy
let conf = proxyConfig("config.json", true); # hits disk

# cache is populated
let value1 = conf.value1; # doesn't hit disk
let value2 = conf.value2; # doesn't hit disk
conf.value3 = "value3"; # hits disk
```

# License

MIT