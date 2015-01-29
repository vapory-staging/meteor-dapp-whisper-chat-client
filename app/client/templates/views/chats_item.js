/**
Template Controllers

@module Templates
*/

/**
The chats item template

@class [template] views_chats_item
@constructor
*/


Template['views_chats_item'].rendered = function(){
    var template = this;

    // Fade in the chat item
    Tracker.afterFlush(function() {
        var $items = template.$('.animate');
        $items.width();
        $items.removeClass('animate');
    });
};


Template['views_chats_item'].helpers({
    /**
    Returns true, if the current message data context is from myself.
    Means has my `from.identity`.

    @method (isYou)
    @param (from)
    @return {Boolean}
    */
    'isYou': function(from){
        return from && from.identity === Whisper.getIdentity().identity;
    },
    /**
    Checks if the its the current user and the message type is not 'notification'

    @method (canEdit)
    @return {Boolean}
    */
    'canEdit': function(from){
        return (from && from.identity === Whisper.getIdentity().identity && this.type !== 'notification');
    },
    /**
    Check whether the iterated user is in your following list.

    @method (inContacts)
    @return {Boolean}
    */
    'inContacts': function(){
        var user = User.findOne();
        return (user && _.contains(user.following, this.from.identity));
    },
    /**
    Return the right notification message

    @method (notificationType)
    @return {String}
    */
    'notificationType': function() {
        console.log(this);
        if(this.message === 'invitation') {

            return TAPi18n.__('whisper.chat.notifications.'+ this.message, {
                users: _.map(this.data, function(item) {
                    // add the invited users to your local user collection
                    Users.upsert(item.identity, {
                        _id: item.identity,
                        identity: item.identity,
                        name: item.name
                    });

                    // return the notification text
                    return '<a href="'+ Router.path('userProfile', {userId: item.identity}) +'">'+ item.name +'</a>';
                }).join(', ')
            });
        }
    }
});
