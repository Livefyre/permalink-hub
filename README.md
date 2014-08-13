The gist of this example is communicating relavent information for permalinks through the use of postMessage. Since postMessage can be used on anyone the following messaging format is used:

{
    subject: 'im-your-friend'
    sender: 'me'
    action: 'put' || 'post' || 'get'
    data: { some: 'payload' }
}

The object should be JSONified using JSON.stringify (or whatever method your choose) to maximize compatibility. 


The code is broken down into three parts: hub, modal, and app.

Hub
The hub is loaded before anything else is required on the page. In this simple example I'm not pulling down everything as is, so I just insantiate it first. Hub acts as a proxy between the permalink modal and any apps that may have permalink functionality built in. The reason the Hub sits between the Apps and the Modal is to simplify determining what can deal with permalinking on a given page and when the time comes who actually should.


Hub listens to three messages: 
Permalink Modal Registration 
App Registration
Request For App To Permalink.


Hub sends two messages:
App Info to Modal - on Permalink Modal and App Registration 
Command For App to Permalink - on Request For App to Permalink 



Modal
This code will go in the actual permalink app with a few tweaks. The idea is that the Modal will be told by the Hub what apps are on the page, so that the Modal can populate buttons on itself for alernative viewing options when apps can handle doing so. When one of these buttons are clicked Modal should perform whatever work it needs to do in itself and then send a message to the Hub asking it to tell the appropriate app to open up the permalink content


Hub listens to one message:
App Info to Modal

Hub sends two messages:
Permalink Modal Registration - on load
Request For App to Permalink - on button click



App
This code or something like it belongs in any App that wants to handle the permalinking for its own collection. 


App listens to one message:
Command For App to Permalink

App sends one message:
App Registration - on load



Messages:
Permalink Modal Registration 
{
    subject: 'permalink'
    sender: 'permalink-modal'
    action: 'post' 
    data: {}
}


App Registration
{
    subject: 'permalink'
    sender: 'a-id-for-your-app' 
    action: 'post' 
    data: {
        id: 'a-id-for-your-app' (same as sender)
        name: 'Text Used For Button'
        collectionId: 'whatever-collection-your-app-is-watching'
    }
}

Request For App To Permalink
{
    subject: 'permalink'
    sender: 'permalink-modal' 
    action: 'put' 
    data: {
        id: 'app-associated-with-button'
        name: 'Button Text' (not required, but echoes whatever the modal passes)
        collectionId: 'a-collection-that-you-should-be-listening-to',
        contentId: 'id-of-content-to-show'
    }
}

App Info to Modal
{
    subject: 'permalink-modal'
    sender: 'permalink' 
    action: 'post' 
    data: {
        id: 'app-id'
        name: 'Text To Use For Button'
        collectionId: 'whatever-collection-the-app-is-watching'
    }
}

Command For App to Permalink
{
    subject: 'id-of-app-handling-this-message'
    sender: 'permalink' 
    action: 'put' 
    data: same as Request For App To Permalink
}





{
    subject: 'permalink'
    sender: 'permalink-modal'
    action: 'put' || 'post' 
    data: 
}