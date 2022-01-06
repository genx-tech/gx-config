// babel config for node.js app
const targetLTSVersion = '14';

module.exports = function (api) {
    const isProduction = api.env(['production']);

    const targets = {
        targets: {
            node: targetLTSVersion,
        },
    };

    const plugins = [];

    if (isProduction) {
        plugins.push('source-map-support');
    }

    plugins.push(
        ...[
            [
                '@babel/plugin-proposal-decorators',
                {
                    legacy: true,
                },
            ],
            [
                '@babel/plugin-proposal-class-properties',
                {
                    loose: true,
                },
            ],
        ]
    );

    const opts = {        
        sourceMaps: isProduction ? true : 'inline',
        presets: [
            [
                '@babel/env',
                {
                    debug: !isProduction,
                    loose: true,
                    ...targets,
                    exclude: [
                        '@babel/plugin-transform-regenerator'
                    ]
                },
            ],
        ],
        comments: false,
        ignore: ['node_modules'],
        plugins,
    };

    return opts;
};
