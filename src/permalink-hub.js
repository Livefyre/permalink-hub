define([], function(){
    function PermalinkHub(opts){
        this.collectionHandlers = {};
        this.hasPermalinkModal = false;
        this.bus = opts.bus || window;

        this._msgEvent = bus.addEventListener ? 'message' : 'onmessage';
        this._addEvent = bus.addEventListener || bus.attachEvent;

        var self = this;
        this._addEvent(this._msgEvent, function(event){
            self.onPostMessage.call(self, event);
        }, false);
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

        if(msg.to !== 'permalink' || !msg.data || !msg.action) 
            return;

        if(msg.action === 'post'){
            if(msg.from === 'permalink-modal')
                this.receiveModalRegistration(msg.data);
            else
                this.receiveAppRegistration(msg.data);
        }

        if(msg.action === 'put'){
            if(msg.from === 'permalink-modal')
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
            from: 'permalink',
            to: data.name,
            action: 'put',
            data: data
        }
        this.bus.postMessage(JSON.stringify(msg),'*');
    };

    PermalinkHub.prototype.messageModalAppInfo = function(data){
        var msg = {
            from: 'permalink',
            to: 'permalink-modal',
            action: 'post',
            data: data
        }
        this.bus.postMessage(JSON.stringify(msg),'*');
    };

    return PermalinkHub;
});