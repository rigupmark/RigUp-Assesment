var translateModule = process.argv[2];  // Make the 'document' global available, in case it is needed.
var MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser(); GLOBAL.document = mock.getDocument();
var AMLTranslator = require('./translator.js');
var testStrings = [
  ["Hello, World!",     "Hello, World!"],
  ["Hello, ^%World!^!%",     "Hello, <strong>World!</strong>"],
  ["Greetings ^%from ^~Glornix^!% Beta-Nine^!~.",     "Greetings <strong>from <em>Glornix</em></strong><em> Beta-Nine</em>."],
  ["This string ^% has an element that isn't closed.", "You must close all elements!"],
  ["This string has an element that isn't closed.^%", "You must close all elements!"],
  ["This string starts begins ^!& element with closing element", "String can't start with a closing element!"],
  ["This string ^% has wrong closing string ^!~ oh no!", "You must close all elements!"],
  ["This string ^% has ^%wrong closing string ^!% ^!% oh no!", "You can't open the same element twice!"],
  ["^~Hello, ^%Earth!^!~ We are pleased ^~to^!% meet you.^!~", "<em>Hello, <strong>Earth!</strong></em><strong> We are pleased <em>to</em></strong><em> meet you.</em>"],
  //Test for extensibility 
  ['^~This is ^% bold, italic, and ^& underlined ^!% not bold ^!& only italic^!~', '<em>This is <strong> bold, italic, and <u> underlined </u></strong><u> not bold </u> only italic</em>']

]

testStrings.forEach(function(val, idx, array) {
  translated = AMLTranslator.translate(val[0]);
  if (translated.toLowerCase() != val[1].toLowerCase()) {
    console.log("Example " + (idx + 1) + " incorrect:");
    console.log('undefined', val);
    console.log("");
    console.log("Expected:");
    console.log(val[1]);
    console.log("Received:");
    console.log(translated);   } else {
    console.log("Example " + (idx + 1) + " correct.");
  } });
