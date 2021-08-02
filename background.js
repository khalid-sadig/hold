let locationIsHeld;

browser.browserAction.onClicked.addListener(initiateExtension);

function initiateExtension() {
    //add the abillity to stop extension when clicked again 
    browser.browserAction.onClicked.removeListener(initiateExtension);
    browser.browserAction.onClicked.addListener(stopExtension); 

    console.log("extension started");

    //inititalize gloal variables used by content scripts when starting navify
    browser.tabs.executeScript({
        code: `
            let heldLocation;
        `
 });
    //initially no location is held
    locationIsHeld = false;
    //start listening to keyboard commands 
    browser.commands.onCommand.addListener(processCommand);
}

function stopExtension() {
    //start extension when clicked again
    browser.browserAction.onClicked.removeListener(stopExtension);
    browser.browserAction.onClicked.addListener(initiateExtension);
  
    console.log("you have stopped the extension"); 
    
}

function processCommand(command) {
    if (command === 'holdExtCommand' && !locationIsHeld) {
        locationIsHeld = true;
        //hold current location
        browser.tabs.executeScript({
            code: `
                    heldLocation = document.scrollingElement.scrollTop;
            `
        }).catch(() => { console.log('something went wrong with injecting content scripts') });
    } else if (command === 'holdExtCommand' && locationIsHeld) {
        //got to current location
         browser.tabs.executeScript({
            code: `
                    window.scroll(
                        {
                            top: heldLocation,
                            behavior: 'smooth'
                        }
                    );
                `
        });

        //unhold location
        locationIsHeld = false;
    }
}


