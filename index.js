'use strict';

module.exports = function (content, file, options) {

    var this_id = file.id.replace(file.ext, '');

    content = content.replace(/["']!([^'"\s]+)["']/g, function (str) {
        return str.replace('.js', '').replace('!this', this_id);
    });

    return content.replace(/<script.*?data-name=["'](.*?)["'].*?>([\s\S]*?)<\/script>/g, function (str, name, value) {
        name = file.realpathNoExt + name.replace('this', '');

        var f = fis.file.wrap(name);
        f.setContent(value);
        fis.compile(f);
        file.derived.push(f);
        return '';
    });
};


