/**
 * Shows the data supplied by the processor.
 *
 * Thanks to Lukas Beierle and Kevin Wieczorek for the cooperation.
 */



const Vizualizer = {

    /**
     * Do things here that need to be done when add-on is loaded.
     */
    init() {
        var vizualizeListener = this.getVizualizeListener();
        // This problem was discussed with Lukas Beierle.
        browser.browserAction.onClicked.addListener(vizualizeListener);

    },

    /**
     * erstellt ein Listener um die vizualize Methode
     * kann somit aus einem Callback aufgerufen
     * bound-function? -> nochmal genauer nachlesen
     */
    getVizualizeListener() {
        return this.vizualize.bind(this);
    },

    /**
     * Returns the domain name of the website loaded in the active tab
     */
    getCurrentTabDomain(callback) {
        // Returns the domain name loaded in the current tab as callback.
        // This problem was discussed with Lukas Beierle and Kevin Wieczorek.
        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {let tab = tabs[0];
            // Creates the url of the current tab.
            var url = new URL(tab.url);
            callback(url.hostname);
        }, console.error);
        return callback;


    },

    /**
     * This method vizualizes, the current amount of CSRs on the current tab.
     * This method is called when the Toolbar Button gets clicked.
     */
    vizualize() {
        // Output to the console.
        console.log('Vizualizer button clicked.');
        // Function is called as callback.
        this.getCurrentTabDomain(function(currentTabDomain) {
            var csr = Processor.getCSR(currentTabDomain);

            // Output has been split to make it look cleaner.
            var lineOne = 'You are currently on ' + currentTabDomain + '. \\n';
            var lineTwo = '';
            if (csr[currentTabDomain]) {
                var csrCount = Object.keys(csr[currentTabDomain]).length;
                lineTwo += 'Here are ' + csrCount + ' 3rd party domains referenced.\\n';
            }
            // Iterated over the json objects.
            // CalledDomains are displayed, as well as the different types.
            var calledDomains = 'The following calledDomain with their types were found:';
            var typeString = '';
            for (var calledDomain in csr[currentTabDomain]) {
                calledDomains += '\\n \\t' + calledDomain + ': ';
                // types: Array [ "stylesheet", "script" ]
                var types = csr[currentTabDomain][calledDomain];
                for (var type in types) {
                    // Array [ "stylesheet", "script" ]
                    for (var i in types[type]) {
                        // Access to the individual types.
                        // Formatting
                        if (typeString === "") {
                            typeString += types[type][i];
                        } else {
                            typeString += ", " + types[type][i];
                        }
                    }
                    // Joining
                    calledDomains += typeString;
                    typeString = ""
                }
            }
            console.log(calledDomains);
            //return calledDomains
            // AllertWindow is created.
            var alertWindow = 'alert("' + lineOne + lineTwo + calledDomains + '");';
            // 'alert ... ' is transferred as string
            browser.tabs.executeScript({code: alertWindow});
        });

    }

};

// Aufruf
Vizualizer.init();

