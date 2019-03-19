require('SassPath/index.scss');

import View from 'ViewPath/View';

import BaseController from 'ControllerPath/BaseController';

import * as Utility from 'LibrariesPath/Utilities/Utility';

new BaseController().registerController({
    preprocess: function() {
        App.Callback.WebSocket = new WebSocket('wss://echo.websocket.org');
    },

    render: function() {
        new View({
            selectorId: 'app',
            templateName: 'websocket',
            templateData: {}
        }).render();
    },

    ready: function() {
        if (App.Callback.WebSocket) {
            Utility.addEventListener(document.getElementById('send'),
                'click',
                function() {
                    if (App.Callback.WebSocket.readyState === 1) {
                        App.Callback.WebSocket.send('Timestamp at ' +
                            new Date().getTime());
                    }
                }
            );

            Utility.addEventListener(document.getElementById('clear'),
                'click',
                function() {
                    if (App.Callback.WebSocket.readyState === 1) {
                        localStorage.setItem('socketData',
                            JSON.stringify([])
                        );
                        document.getElementById('msg-data').innerHTML =
                            '<p>Please send a message.</p>';
                    }
                }
            );

            Utility.addEventListener(document.getElementById('close'),
                'click',
                function() {
                    App.Callback.WebSocket.close();
                }
            );

            App.Callback.WebSocket.onopen = function() {
                document.getElementById('msg').innerHTML = 'Connection Open';
                document.getElementById('msg-data').innerHTML =
                    '<p>Please send a message.</p>';
            };

            App.Callback.WebSocket.onmessage = function(event) {
                document.getElementById('msg').innerHTML =
                    '<p>Sending Messages.</p>';
                let msg = '';
                let msgData = [];

                if (localStorage.getItem('socketData') !== null) {
                    msgData = JSON.parse(localStorage.getItem('socketData'));
                }

                msgData.push(event.data);

                localStorage.setItem('socketData', JSON.stringify(msgData));

                if (localStorage.getItem('socketData') !== null) {
                    let Data = JSON.parse(localStorage.getItem('socketData'));
                    for (var i = 0; i < Data.length; i++) {
                        msg += '<p>MSG Rcvd = ' + Data[i] + '.</p>';
                    }
                }

                document.getElementById('msg-data').innerHTML = msg;
            };

            App.Callback.WebSocket.onerror = function() {
                document.getElementById('msg').innerHTML =
                    '<p>Something Went Wrong.</p>';
            };

            App.Callback.WebSocket.onclose = function() {
                document.getElementById('msg').innerHTML =
                    '<p>Connection Closed.</p>';
                document.getElementById('msg-data').innerHTML = '';
            };
        }
    }
});
