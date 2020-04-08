/**
 * Intercepts requests and reads them all
 * before sending them to the vizualizer.
 *
 * I created an object because I had a look at the code of
 * the processor.js and capturer.js before and wanted it to be easy to use.
 * Also, to be honest, I haven't done object-oriented programming
 * for a very long time and have no experience with JavaScript.
 * For this reason I stuck to the given structure and
 * tried to implement it. When it worked
 * I was happy that there were no errors.
 */



const Capturer = {

    /**
     * Records all requests and forwards this.
     */
    init() {
        var trackRequestListener = Processor.getTrackRequestListener();
        browser.webRequest.onBeforeRequest.addListener(
            trackRequestListener,
            {urls: ["<all_urls>"]}
        );
    },
};

Capturer.init();

