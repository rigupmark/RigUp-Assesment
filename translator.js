module.exports = {
    translate: function(str, currentHTML, storageContainer) {
            var parsedAML = currentHTML || '';
            var storage = storageContainer || [];
            // I been in communication with these aliens
            // and have discovered a new element, which 
            // translates to an <u> element.
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
            // Base case
            if (str.length === 0) {
                return currentHTML;
            }
            // Iterate through string while collecting all open elements. Terminate
            // when closing element is found or end of string.
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
                    //Translate open elements as we go.
                    parsedAML += htmlMapping[elOpening];
                    //Increment i twice so that we dont iterate over same items
                    //after finding an open element.
                    i++
                } else {
                    parsedAML += str[i];
                }
                i++
            }

            var lastClose = str.substring(i, i + 3);
            var currentStr = str.slice(i + 3);
            // Cases when no open elements are found so far, but a close element is found.
            if (!storage.length) {
                if (i < str.length) {
                    // When there are no opens elements seen so far, but func
                    // has hit an closing element.
                    return "String can't start with a closing element!";
                } else if (str.length != 0) {
                    //When open and close elements have been matched,
                    //but we haven't finished iterating through AML
                    return this.translate(currentStr, parsedAML);
                } else if (i === str.length) {
                    // When no AML elements are found and finished iterating.
                    return str;
                }
            } else if (storage.length > 0 && i === str.length) {
                // When finished iterating and not all opening elements
                // have a pair.
                return 'You must close all elements!';
            }

            //Begin AML translation

            // The general process of translation handles two cases when
            // finding a closing element and storage.length > 1 .

            // Compare last opening element from the storage container
            // to the closing element that was just found. If they are pairs
            // then replace the AML closing element with corresponding the HTML,
            // update storage, and call translate again.

            var lastOpen = storage.pop();
            if (open.indexOf(lastOpen) === close.indexOf(lastOpen)) {
                parsedAML += htmlMapping[lastOpen];
                return this.translate(currentStr, parsedAML, storage);
            }

            //If the last opening element is not a pair with the
            //closing element that was just found then look through
            //storage for previously found elements until this
            //closing element is matched with its opening element.

            // If a match is made then then store all open elements that
            // that were contained between this match and concatenate
            // these AML elements to currentString. If a match is never found
            // then return error.

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
