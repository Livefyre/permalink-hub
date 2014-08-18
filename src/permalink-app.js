define([], function(){
    function PermalinkApp(opts){
        this.$el = opts.el || document.createElement('div');
        this.name = opts.name;
        this.collectionId = opts.collectionId;
        this.contentId = opts.contentId;

        this.render();
        
        if(opts.permalink !== false){
            this.sendRegistration();
            window.addEventListener('message', this.onPostMessage.bind(this), false);
        }
        else{

        }
    }

    //If msg is for me "show modal"
    //For this example that just means toggling status color
    PermalinkApp.prototype.onPostMessage = function(event){
        var msg = null; 
        var status = this.$el.getElementsByClassName('status')[0];
        var comms = this.$el.getElementsByClassName('comms')[0];

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

        if(msg.to !== this.name || !msg.data || msg.action !== 'put') 
            return;

        toggleStatusTo(status, 'success');
        comms.innerHTML = comms.innerHTML + '<li>'+ msg.action +'</li>';
    };

    PermalinkApp.prototype.sendRegistration = function(){
        var msg = {
            from: this.name,
            to: 'permalink',
            action: 'post',
            data: {
                name: this.name,
                collectionId: this.collectionId,
                networkId: this.networkId,
            }
        };
        window.postMessage(JSON.stringify(msg),'*');
    };

    PermalinkApp.prototype.render = function(){
        var template = '<div class="header"> <div class="collection-stuff">'+ this.name +'</div> </div>\
            <div class="status"></div>\
            <ul class="comms"></ul>\
            <div class="footer"></div>';
        this.$el.innerHTML = template;
    };


    return PermalinkApp;
});