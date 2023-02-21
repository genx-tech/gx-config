# @genx/config

An environment-aware config system.

## Features

-   Multiple data source.
-   Deep override.
-   Rewrite config.
-   Support interpolation: ES6 string template, Javascript value

## Examples

     let fileSource = new JsonConfigProvider('path/to/config.json');
     let config = new ConfigLoader(fileSource);
     await config.load_()...;

     let dbSource = new DbConfigProvider(config.data.dbConnection);
     config.provider = dbSource;
     await config.reload_()...;

     // same as: let envAwareLoader = new ConfigLoader(
     //    new (EnvAwareConfigProviderF('.json', JsonConfigProvider, 'default'))('config/dir', 'app', 'production')
     // );
     let envAwareLoader = ConfigLoader.createEnvAwareJsonLoader('config/dir', 'app', 'production');

     // Loader will load config/dir/app.default.json first,
     // and then load config/dir/app.production.json,
     // and finally override the default.
     let cfg = await envAwareLoader.load_();

## Post-processor syntax

```
// config
{
    "key": "#!jst:Hello ${name}, welcome to ${place}!",
    "key2": {
        "array": [
            "#!jst:value1: ${value1}",
            "#!jst:value2: ${value2}",
            "#!jst:sum: ${value1 + value2}"
        ],
        "object": {
            "non": "nothing",
            "itpl": "#!jst:${(new Date()).toString()}"
        },
        "jsv1": "#!jsv:100+200*0.5",
        "jsv2": "#!jsv:[name, place].join(' ')",
        "jsv3": "#!swig: {{ name }} - {{ place }} "
    }
}

await config.load_({ name: 'Bob', place: 'Sydney', value1: 10, value2: 20 });

// result
{
  key: 'Hello Bob, welcome to Sydney!',
  key2: {
    array: [ 'value1: 10', 'value2: 20', 'sum: 30' ],
    object: {
      non: 'nothing',
      itpl: 'Tue Feb 21 2023 21:00:39 GMT+1100 (Australian Eastern Daylight Time)'
    },
    jsv1: 200,
    jsv2: 'Bob Sydney',
    jsv3: 'Bob - Sydney'
  }
}
```

## License

MIT
