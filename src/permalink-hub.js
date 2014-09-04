define([], function(){
    function PermalinkHub(opts){
        this.collectionHandlers = {};
        this.hasPermalinkModal = false;
        this.bus = opts.bus || window;

        var msgEvent = this.bus.addEventListener ? 'message' : 'onmessage';
        var addEvent = this.bus.addEventListener || this.bus.attachEvent;

        var self = this;
        addEvent(msgEvent, function(event){
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
                this.receiveModalHaveAppPermalink(msg.data);
        }      
    };

    PermalinkHub.prototype.receiveModalHaveAppPermalink = function(data){
        var apps = this.collectionHandlers[data.collectionId] || [];
        for(var i = 0; i < apps.length; i++)
            this.messageAppToPermalink(apps[i].name, data);        
    };


    //This isn't as important as before now that we broadcast to all apps
    //listening to the model collection. We could remoe this entirely and 
    //send the Model a message to show or not show its button.
    PermalinkHub.prototype.receiveModalRegistration = function(data){
        if(this.hasPermalinkModal) return;

        this.hasPermalinkModal = true;
        for(key in this.collectionHandlers)
            for(var i = 0; i < this.collectionHandlers[key].length; i++)
                this.messageModalAppInfo(this.collectionHandlers[key][i]);
    };

    PermalinkHub.prototype.receiveAppRegistration = function(data){
        this.collectionHandlers[data.collectionId] = this.collectionHandlers[data.collectionId] || []
        this.collectionHandlers[data.collectionId].push(data);
        if(this.hasPermalinkModal)
            this.messageModalAppInfo(data);
    };

    PermalinkHub.prototype.messageAppToPermalink = function(appName, data){
        var msg = {
            from: 'permalink',
            to: appName,
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