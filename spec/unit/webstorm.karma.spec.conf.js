var karmaConf = require('./karma.conf');

module.exports = function(config) {
    var adapter = {
        set: function(conf) {
            // Webstorm overrides the coverage plugin, which prevents
            // the coffeescript parser from running on these two globs
            // Rather than duplicate the conf, just fix these two paths
            conf.preprocessors['src/util/**/*.coffee'] = ['coffee'];
            conf.preprocessors['src/**/coffee/*.coffee'] = ['coffee'];
            config.set(conf);
        }
    };
    karmaConf(adapter);
};
