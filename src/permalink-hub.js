define([], function(){

function PermalinkHub(opts){
    this.collectionHandlers = {};
    this.hasPermalinkModal = false;

    window.addEventListener('message', this.onPostMessage.bind(this), false);
}

PermalinkHub.prototype.onPostMessage = function(event){
    var msg = null; 

    if(typeof event.data === 'object') 
        msg = event.data 
    else {
        try{ 
            msg = JSON.parse(event.data)
        } catch(e){ 
            return; 
        }       
    }

    if(msg.subject !== 'permalink' || !msg.data || !msg.action) 
        return;

    if(msg.action === 'post'){
        if(msg.sender === 'permalink-modal')
            this.receiveModalRegistration(msg.data);
        else
            this.receiveAppRegistration(msg.data);
    }

    if(msg.action === 'put'){
        if(msg.sender === 'permalink-modal')
            this.messageAppToPermalink(msg.data);
    }      
};

PermalinkHub.prototype.receiveModalHaveAppPermalink = function(data){
    this.messageAppToPermalink(data);
};

PermalinkHub.prototype.receiveModalRegistration = function(data){
    if(this.hasPermalinkModal) return;
    this.hasPermalinkModal = true;
    for(key in this.collectionHandlers)
        this.messageModalAppInfo(this.collectionHandlers[key]);
};

PermalinkHub.prototype.receiveAppRegistration = function(data){
    this.collectionHandlers[data.collectionId] = data;
    if(this.hasPermalinkModal)
        this.messageModalAppInfo(data);
};

PermalinkHub.prototype.messageAppToPermalink = function(data){
    var msg = {
        sender: 'permalink',
        subject: data.name,
        action: 'put',
        data: data
    }
    window.postMessage(JSON.stringify(msg),'*');
};

PermalinkHub.prototype.messageModalAppInfo = function(data){
    var msg = {
        sender: 'permalink',
        subject: 'permalink-modal',
        action: 'post',
        data: data
    }
    window.postMessage(JSON.stringify(msg),'*');
};


return PermalinkHub;
});