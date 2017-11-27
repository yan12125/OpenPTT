define([
  'core/uao/uao_conv',
  'core/utils/stringUtil'], function (uaoConv, strUtil) {

function WebSocketProtocol(bbsCore) {
    this.bbsCore = bbsCore;
    this.debug = false;
}

WebSocketProtocol.prototype={
    protocolName: 'ssh',

    connect: function(host, port, extData, hostkeys) {
        this.bbsCore.robot.initialAutoLogin();
        this.isConnected = false;

        this._conn = new WebSocket("wss://ws.ptt.cc/bbs");
        this._conn.binaryType = "arraybuffer";
        this._conn.addEventListener('open', this._onOpen.bind(this));
        this._conn.addEventListener('message', this._onMessage.bind(this));
        this._conn.addEventListener('error', this._onError.bind(this));
        this._conn.addEventListener('close', this._onClose.bind(this));
    },

    _onOpen: function() {
      //call by socket event
      if(this.bbsCore)
        this.bbsCore.onConnect(this);
    },

    // data listener
    _onMessage: function(e) {
      //call by socket event
      if(this.bbsCore)
        this.bbsCore.onData(this, e.data);
    },

    _onError: function(e) {
      //call by socket event
      console.error(e);
    },

    _onClose: function (e) {
      //call by socket event
      this.bbsCore.onClose(this);
    },

    close: function() {
      //call by bbsCore
      this._conn.close();

      this.isConnected = false;
    },

    send: function(str) {
      this._conn.send(str);
    },

    convSend: function(unicode_str, charset, extbuf) {
        if(charset.toLowerCase() == 'utf-8') {
            return this.send(this.utf8Output(unicode_str));
        }

        // supports UAO
        var s;
        // when converting unicode to big5, use UAO.
        if(charset.toLowerCase() == 'big5') {
            s = uaoConv.u2b(unicode_str);
        }
        else
        {
            //not support
        }
        if(extbuf) return s;
        if(s)
        {
          s = strUtil.ansiHalfColorConv(s);
          this.send(s);
        }
    },

    sendNaws: function() {
        var cols = this.bbsCore.prefs.bbsCol; //80;
        var rows = this.bbsCore.prefs.bbsRow; //24;
        // XXX: What to do?
    },

    utf8Output: function(str) {
      return unescape(encodeURIComponent(str));
    }
};

return WebSocketProtocol;

});

