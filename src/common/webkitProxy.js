import utils from './utils.js'

var gCmds = new Map();

var webkitProxy = {
    init() {
        console.log('webkitProxy init');
        window.onData = function(dataStr) {
            let data = JSON.parse(dataStr);
            if (!data) {
                return;
            }
            
            let cbSet = gCmds.get(data.cmd);
            if (!cbSet) return;

            for(let cb of cbSet) {
                if (cb) {
                    let base64 = utils.base64_utf8_decode(data.data);
                    try {
                        cb(JSON.parse(base64));
                    } catch(e) {
                        console.log('onData exception. cmd:' + data.cmd);
                    }
                }
            }
        }

        this.sendMsg('init', {})
    },


    sendMsg(cmd, json) {
        if (window.webkit && 
            window.webkit && window.webkit.messageHandlers &&
            window.webkit.messageHandlers.onData) {
            const base64Info = utils.base64_utf8_encode(JSON.stringify(json));
            window.webkit.messageHandlers.onData.postMessage(JSON.stringify({cmd, data:base64Info}));
        }
    },

    registerEvent(eventIdStr, cb) {
        let cbSet = gCmds.get(eventIdStr);
        if (!cbSet) {
            cbSet = new Set();
            gCmds.set(eventIdStr, cbSet);
        }

        cbSet.add(cb);
    }
}


export default webkitProxy;