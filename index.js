'use strict';

module.exports = function (content, file, options) {

    var this_id = file.id.replace(file.ext, '');

    return '<!DOCTYPE html>\r\n' + content
            .replace(/["']![^'"\s]+["']/g, function (str) {
                return str.replace('.js', '').replace('!this', this_id);
            })
            .replace(/<(script|template).*?data-name=["'](.*?)["'].*?>([\s\S]*?)<\/(script|template)>/g, function (str, type, name, value) {
                name = file.realpathNoExt + name.replace('this', '');
                var f = fis.file.wrap(name);
                f.setContent(value);
                fis.compile(f);
                file.derived.push(f);
                return '';
            })
            .match(/<html.*?>[\s\S]*?<\/html>/);
};