module.exports = {
    translate: function(str, currentHTML, storageContainer) {
            var parsedAML = currentHTML || '';
            var storage = storageContainer || [];
            
            var htmlMapping = {
                '^~':'<em>',
                '^!~':'</em>',
                '^%':'<strong>',
                '^!%':'</strong>',
                '^&': '<u>',
                '^!&': '</u>'
            };
            var open = ['^~', '^%', '^&'];
            var close = ['^!~', '^!%', '^!&'];
            
            if (str.length === 0) {
                return currentHTML;
            }
            
            var i = 0;
            while ((close.indexOf(str.substring(i, i + 3)) === -1) && (i < str.length)) {
                var elOpening = str.substring(i, i + 2);
                if (open.indexOf(elOpening) > -1) {
                    if (storage.length) {
                        if (elOpening === storage[storage.length - 1]) {
                            return "You can't open the same element twice!";
                        }
                    }
                    storage.push(elOpening)
                    parsedAML += htmlMapping[elOpening];
                    i++
                } else {
                    parsedAML += str[i];
                }
                i++
            }

            var lastClose = str.substring(i, i + 3);
            var currentStr = str.slice(i + 3);
            if (!storage.length) {
                if (i < str.length) {
                    return "String can't start with a closing element!";
                } else if (str.length != 0) {
                    return this.translate(currentStr, parsedAML);
                } else if (i === str.length) {
                    return str;
                }
            } else if (storage.length > 0 && i === str.length) {
                return 'You must close all elements!';
            }

            var lastOpen = storage.pop();
            if (open.indexOf(lastOpen) === close.indexOf(lastOpen)) {
                parsedAML += htmlMapping[lastOpen];
                return this.translate(currentStr, parsedAML, storage);
            }

            var unclosedTagsStorage = [];
            parsedAML += htmlMapping[close[open.indexOf(lastOpen)]];
            while (open.indexOf(lastOpen) != close.indexOf(lastClose)) {
                if (!storage.length) {
                    return 'You must close all elements!';
                }
                unclosedTagsStorage.push(lastOpen);
                lastOpen = storage.pop();
                parsedAML += htmlMapping[close[open.indexOf(lastOpen)]];
            }

            unClosedTags = unclosedTagsStorage.join('');
            newstr = unClosedTags + currentStr;

            return this.translate(newstr, parsedAML, storage);

        }
}
