$(function() {
    // Get handle to the chat div 
    var $chatWindow = $('#chat-messages');

    // Our interface to the Chat service
    var chatClient;

    // A handle to the "general" chat channel - the one and only channel we
    // will have in this sample app
    var privateChannel;

    // The server will assign the client a random username - store that value
    // here
    var username;

    // Helper function to print info messages to the chat window
    function print(infoMessage, asHtml) {
        var $msg = $('<div class="info">');
        if (asHtml) {
            $msg.html(infoMessage);
        } else {
            $msg.text(infoMessage);
        }
        $chatWindow.append($msg);
    }

    // Helper function to print chat message to the chat window
    function printMessage(fromUser, message) {
        var $user = $('<span class="username">').text(fromUser + ':');
        if (fromUser === username) {
            $user.addClass('me');
        }
        var $message = $('<span class="message">').text(message);
        var $container = $('<div class="message-container">');
        $container.append($user).append($message);
        $chatWindow.append($container);
        $chatWindow.scrollTop($chatWindow[0].scrollHeight);
    }

    // Alert the user they have been assigned a random username
    print('Logging in...');

    // Get an access token for the current user, passing a username (identity)
    // and a device ID - for browser-based apps, we'll always just use the 
    // value "browser"
    $.getJSON('/token', {
        device: 'browser'
    }, function(data) {
        // Alert the user they have been assigned a random username
        username = data.identity;
        print('Hello ' 
            + '<span class="me">' + username + '</span>', true);

        // Initialize the Chat client
        chatClient = new Twilio.Chat.Client(data.token);
        chatClient.getSubscribedChannels().then(createOrJoinPrivateChannel);        
    });

    function createOrJoinPrivateChannel() {
        // Get the general chat channel, which is where all the messages are
        // sent in this simple application
        chatClient.on('channelInvited', function(channel) {
        console.log('Invited to channel ' + channel.friendlyName);
  // Join the channel that you were invited to
        channel.join();}
);
        print('Attempting to join "Private" chat channel...');
        var promise = chatClient.getChannelByUniqueName('private');
        promise.then(function(channel) {
            privateChannel = channel;
            console.log('Found private channel:');
            console.log(privateChannel);
            setupChannel();
        }).catch(function() {
            // If it doesn't exist, let's create it
            console.log('Creating private channel');
            chatClient.createChannel({
                uniqueName: 'private',
                friendlyName: 'Private Chat Channel'
            }).then(function(channel) {
                console.log('Created Private channel:');
                console.log(channel);
                generalChannel = channel;
                setupChannel();
            });
        });
    }

    // Set up channel after it has been found
    function setupChannel() {
        // Join the general channel
        privateChannel.join().then(function(channel) {
            print('Joined channel as ' 
                + '<span class="me">' + username + '</span>.', true);
        });

        // Listen for new messages sent to the channel
        privateChannel.on('messageAdded', function(message) {
            printMessage(message.author, message.body);
        });
        privateChannel.invite('overwatch793@gmail.com').then(function() {
        console.log('Your friend has been invited!');
});
    }

    // Send a new message to the general channel
    var $input = $('#chat-input');
    $input.on('keydown', function(e) {
        if (e.keyCode == 13) {
            privateChannel.sendMessage($input.val())
            $input.val('');
        }
    });
});