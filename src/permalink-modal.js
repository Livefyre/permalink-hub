define([], function(){

function PermalinkModal(opts){
    this.$el = opts.el;
    this.name = opts.name;
    this.collectionId = opts.collectionId;
    this.networkId = opts.networkId;


    this.render();
    window.addEventListener('message', this.onPostMessage.bind(this), false);
    this.sendRegistration();
}

//If message show button
PermalinkModal.prototype.onPostMessage = function(event){
    var msg = null; 
    var status = this.$el.getElementsByClassName('status')[0];
    var comms = this.$el.getElementsByClassName('comms')[0];
    var footer = this.$el.getElementsByClassName('footer')[0];
    var self = this;

    var toggleStatusTo = function($el, statusClassName){
        var classNames = ['failure', 'success'];
        for(className in classNames)
            $el.classList.remove(className);
        $el.classList.add(statusClassName);
    };

    if(typeof event.data === 'object') 
        msg = event.data 
    else {
        try{ 
            msg = JSON.parse(event.data)
        } catch(e){ 
            toggleStatusTo('failure');
            comms.innerHTML = comms.innerHTML + '<li>Failure</li>';
            return; 
        }       
    }

    if(msg.to !== 'permalink-modal' || !msg.data || msg.action !== 'post') 
        return;

    toggleStatusTo(status, 'success');
    comms.innerHTML = comms.innerHTML + '<li>'+ msg.action +'</li>';

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = msg.data.name;
    button.onclick = function(){
        self.messageHubToPermalink(msg.data);
    };


    footer.appendChild(button);
};

PermalinkModal.prototype.messageHubToPermalink = function(data){
        var message = {
            from: 'permalink-modal',
            to: 'permalink',
            action: 'put',
            data: data
        };
        window.postMessage(JSON.stringify(message),'*');
}

PermalinkModal.prototype.sendRegistration = function(){
    var msg = {
        from: 'permalink-modal',
        to: 'permalink',
        action: 'post',
        data: {}
    };
    window.postMessage(JSON.stringify(msg),'*');
};

PermalinkModal.prototype.render = function(){
    var template = '<div class="header">Permanlink Modal</div>\
        <div class="status"></div>\
        <ul class="comms"></ul>\
        <div class="footer"></div>';
    this.$el.innerHTML = template;
};


return PermalinkModal;
});