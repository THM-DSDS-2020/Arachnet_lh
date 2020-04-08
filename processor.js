/**
 * The processor is responsible for storing incoming requests and for filtering
 * those requests in order to display them in the vizualizer.
 * 
 * Thanks to Kevin Wieczorek for the cooperation.
 */

const Processor = {

    /**
     * Dictionary to store a list of resources ordered by the domain that
     * requested them
     */
    resourcesByDomain: {},


    /**
     * Pass in the web request captured in the capturer. One request at a time.
     * If all works, there should be a console output.
     * @param {WebRequest} req 
     */
    trackRequest(req) {
        var currentDomain = new URL(req.documentUrl).hostname;
        var calledDomain = new URL(req.url).hostname;
        // This problem was discussed with Kevin Wieczorek and we tried to find a solution.
        // The calledDomain was splitted so you could check
        // if the splitted file is equal to the currentDomain.
        // The first variable splits calledDomain at the points
        var splitDomain = calledDomain.split(".");
        // The second builds a domain without subdomain from the split domain.
        var splitDomain2 = splitDomain[splitDomain.length-2] + "." + splitDomain[splitDomain.length-1];
        var isCrossDomain = currentDomain !== splitDomain2;

        //Only handle requests, that are cross domain.
        if (isCrossDomain)
        {
            // It is checked whether the found currentDomain already exists.
            // If the currentDomain is undefined a json object is created.
            // Key = currentDomain with an empty object
            // e.g. "dl.web.de": {}
            if (typeof this.resourcesByDomain[currentDomain] === 'undefined')
            {
                this.resourcesByDomain[currentDomain] = {};
            }
            // It is checked whether the found calledDomain already exists for the currentDomain.
            // If not, the calledDomain is added to the curredDomain and an empty types list is created.
            // e.g. "dl.web.de": {
            //         "pagead2.googlesyndication.com": {
            //              "types": []}}
            if (typeof this.resourcesByDomain[currentDomain][calledDomain] === 'undefined')
            {
                this.resourcesByDomain[currentDomain][calledDomain] = {
                    types: []
                };
            }
            // The system checks whether the type found exists in the types-list.
            // If the type does not yet exist in the list, it will be added.
            // Examples of the different types are: xmlhttprequest, image, script, beacon,...
            if (this.resourcesByDomain[currentDomain][calledDomain].types.indexOf(req.type) === -1)
            {
                this.resourcesByDomain[currentDomain][calledDomain].types.push(req.type);
            }
        }

        // After each request, there is this console output showing the current
        // state of the stored data.
        console.log('----------------\nresourcesByDomain:\n' + JSON.stringify(this.resourcesByDomain, null, 4));
    },

    /**
     * This creates a listener around the trackRequest method, so it can
     * be called from within a callback.
     * A bound-function is created by this.
     */
    getTrackRequestListener() {
        return this.trackRequest.bind(this);
    },


    /**
     * Call this method either like this: Processor.getCSR('web.de')
     * or like this:                      Processor.getCSR(['web.de', 'gmx.net])
     * 
     * The spread operator can process either one element or a list of multiple elements.
     * Simply put, you can specify a variable number of arguments.
     * 
     * This method shall be called from within the vizualizer, whenever the user
     * wants to see the data.
     * @param  {...string} domains 
     */
    getCSR(...domains) {
        var results = {};
        for (var i = 0; i < domains.length; i++) {
            if (this.resourcesByDomain[domains[i]]) {
                results[domains[i]] = this.resourcesByDomain[domains[i]];
            }
        }
        return results;
    }

};