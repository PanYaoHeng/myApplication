const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function(source) {
    if (this.resourceQuery && loaderUtils.parseQuery(this.resourceQuery).iconImport) {
        const fileNames = fs.readdirSync(this.context);
        let importStr = '';
        fileNames.forEach((fileName) => {
            let fileStat = fs.statSync(this.context + path.sep + fileName);
            if (fileStat.isFile() && this.request.indexOf(fileName) === -1) {
                let iconName = fileName.split('.')[0];
                importStr += `.icon-${iconName} { background-image: url("./${fileName}");}\n`;
            }
        });
        return importStr + source;
    } else {
        return source;
    }
};
