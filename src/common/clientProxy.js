import webkitProxy from './webkitProxy'

var clientProxy = {
    searchInSudic(word) {
        webkitProxy.sendMsg('openSudic', {word});
    },

    resotreBuy() {
        webkitProxy.sendMsg('restoreBuy', {});
    },

    goBack() {
        webkitProxy.sendMsg('goBack', {});
    },

    sendCurrIndex(index) {
        webkitProxy.sendMsg('dayread-sendCurrIndex', {index})
    }
}

export default clientProxy;