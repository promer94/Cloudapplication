var $chatWindow = $('#chat-messages');
var chatClient;
var currentChannel;
var username;

$(function () {
    $.getJSON('/token', {
        device: 'browser'
    }, function (data) {
        username = data.identity;
        print('Hello: ' +
            '<span class="me">' + username + '</span>', true);

        // Initialize the Chat client
        chatClient = new Twilio.Chat.Client(data.token);
        chatClient.on('channelInvited', function (channel) {
            console.log('You are invited to channel ' + channel.friendlyName);
        });
        try {
            chatClient.getSubscribedChannels().then(function (paginator) {
                for (i = 0; i < paginator.items.length; i++) {
                    var channel = paginator.items[i];
                    console.log('Channel: ' + channel.friendlyName);
                }
                currentChannel = channel;
                joinChannel(currentChannel);
            })
        } catch (err) {
            console.log('You have not subscribed any channel, you can create your own channel now')
        }
        //Listener for Input
        var $input = $('#chat-input');
        $input.on('keydown', function (e) {
            if (e.keyCode == 13) {
                currentChannel.sendMessage($input.val());
                $input.val('');
            }
        });
        
        var $inviteInput = $('#Invite');
        $inviteInput.on('keydown', function (e) {
            if (e.keyCode == 13) {
                currentChannel.invite($inviteInput.val()).then(function (){
                console.log($inviteInput.val() + ' has been invited!');
                })
             emailinput.val('');
            }
        }); 
    });
})






function print(infoMessage, asHtml) {
    var $msg = $('<div class="info">');
    if (asHtml) {
        $msg.html(infoMessage);
    } else {
        $msg.text(infoMessage);
    }
    $chatWindow.append($msg);
}


function printMessage(fromUser, message) {
    // Helper function to print chat message to the chat window
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

function createPrivateChannel(chatClient) {
    try {
        chatClient
            .createChannel({
                uniqueName: username + ' private',
                friendlyName: username + ' private chat channel',
                isPrivate: true
            })
            .then(function (channel) {
                console.log('created private channel:');
                console.log(channel);
                currentChannel = channel;
                joinChannel(currentChannel);
            });
    } catch (err) {
        console(err.message)

    }
}

function acceptInvitation(chatClient) {
    chatClient.on('channelInvited', function (channel) {
        console.log('Invited to channel ' + channel.friendlyName);
        // Join the channel that you were invited to
        channel.join().then(function () {
            print('Joined ' + channel.friendlyName + ' as ' +
                '<span class="me">' + username + '</span>.', true);
        });
        channel.on('messageAdded', function (message) {
            printMessage(message.author, message.body);
        });
    });
}

function joinChannel(channel) {
    try {
        channel.join().then(function (channel) {
            print('Joined ' + channel.friendlyName + ' as ' +
            '<span class="me">' + username + '</span>.', true);
            currentChannel = channel;
            currentChannel.getMessages().then(function (messages) {
                const totalMessages = messages.items.length;
                for (i = 0; i < totalMessages; i++) {
                    const message = messages.items[i];
                    printMessage(message.author, message.body);
                }

            })
        });

        // Listen for new messages sent to the channel
        channel.on('messageAdded', function (message) {
            printMessage(message.author, message.body);
        })
    } catch (err) {
        console.log(err.message);
    }
}