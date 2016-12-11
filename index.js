'use strict';

module.exports = function (content, file, options) {

    var this_id = '', libs = '';

    this_id = file.getId().replace(file.ext, '');

    options.libs.forEach(function (lib) {
        libs += '<script type="text/javascript" src="' + lib + '" data-loader></script>\r\n'
    });

    return '<!DOCTYPE html>\r\n' + content
            .replace(/["']![^'"\s]+["']/g, function (str) {
                return str.replace('.js', '').replace('!this', this_id);
            })
            .replace(/<(script|template).*?data-name=["'](.*?)["'].*?>([\s\S]*?)<\/(script|template)>/g, function (str, type, name, value) {
                name = file.realpathNoExt + name.replace('this', '');
                var f = fis.file.wrap(name);
                f.cache = file.cache;
                f.setContent(value);
                fis.compile.process(f);
                f.links.forEach(function (derived) {
                    file.addLink(derived);
                });
                file.derived.push(f);
                file.addRequire(f.getId());
                return '';
            })
            .replace(/<script.*?>[\s\S]*?<\/script>/, function (str) {
                return libs + str;
            })
            .replace(/\{config\.host\}/g, options.host)
            .match(/<html.*?>[\s\S]*?<\/html>/);
};