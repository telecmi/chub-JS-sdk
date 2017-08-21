"use strict";
window.Telecmi = (function() {
    var self = this;

    Telecmi.prototype.audioTag = function() {
        var audio_tag = document.createElement("AUDIO");
        audio_tag.setAttribute('autoplay', true);
        audio_tag.setAttribute('hidden', true);
        audio_tag.setAttribute("id", "telecmi_audio_tag");
        document.body.appendChild(audio_tag);
    }


    //Initilize contacthub
    Telecmi.prototype.startCHUB = function(username, password) {
        //create Audio Tag and append to body
         this.audioTag();
        //Initilize verto object
        var socket = new JsSIP.WebSocketInterface('wss://chubws.telecmi.com');
        this.verto = new JsSIP.UA({
            uri: 'sip:' + username + '@chubws.telecmi.com',
            sockets: [socket],
            password: password,
            stun_servers: ["stun:stun.l.google.com:19302"]
        });

        //Websocket connection opened
        this.verto.on('connected', function() {
          if(self.conTout)
          {
            clearTimeout(self.conTout)
          }
            self.onStatus({
                event: 'ws',
                status: 'open'
            })
        });
        //Websocket connection closed
        this.verto.on('disconnected', function(e) {
          self.conTout=setTimeout(function(){
            self.onStatus({
                event: 'ws',
                status: 'closed'
            })
          },10000);
        });
        //Registered successfully
        this.verto.on('registered', function() {
          if(self.regTout)
          {
            clearTimeout(self.regTout)
          }
            self.onStatus({
                event: 'register',
                status: true
            })
        });

        //Register failed
        this.verto.on('registrationFailed', function(e) {

            self.onStatus({
                event: 'register',
                status: false
            })
        });

        //Unregister  successfully
        this.verto.on('unregistered', function() {
          self.regTout=setTimeout(function(){
            self.onStatus({
                event: 'register',
                status: false
            })
          },10000);
        });

        //RTC Session
        this.verto.on('newRTCSession', function(data) {
          if (this.telecmi_call) {
            self.onStatus({
                event: 'busy',
                status: true
            })
              return;
          }
            var session = data.session; // outgoing call session here
            window.session = session;

            if (session.direction === "incoming") {
              if(self.telecmi_call)
              {
                session.terminate();
                return;
              }else {
                self.telecmi_call=session;
                self.onStatus({
                    event: 'ringing',
                    status: true
                })
              }
            }
              var dtmfSender;
              if(session.connection)
              {
            session.connection.addEventListener("addstream", function(e) {
              self.onStatus({
                  event: 'media',
                  status: true
              })
                var remoteAudio = document.getElementById('telecmi_audio_tag');
                remoteAudio.src = window.URL.createObjectURL(e.stream);
            })
          }

            session.on("progress", function(e) {
              if(session.direction === "incoming")
              {
                return;
              }
              self.onStatus({
                  event: 'trying',
                  status: true
              })
            });
            session.on("confirmed", function(e) {
              self.onStatus({
                  event: 'connected',
                  status: true
              })
            });

            session.on("accepted",function(){
              self.onStatus({
                  event: 'answer',
                  status: true
              })
            });

            session.on("ended", function() {
              if(self.telecmi_call)
              {
                self.telecmi_call=null;
              }
              self.onStatus({
                  event: 'hangup',
                  status: true
              })
            });
            session.on("failed", function(e) {
              if(self.telecmi_call)
              {
                self.telecmi_call=null;
              }

              self.onStatus({
                  event: 'hangup',
                  desc:e,
                  status: true
              })
            });
        });


        this.verto.start();

    }


  Telecmi.prototype.isReady = function(inetno) {
    return this.verto.isConnected();
  }

    //Make Call to inetnet number
    Telecmi.prototype.call = function(inetno) {
      if((!this.verto.isRegistered()) || (!this.verto.isConnected()))
      {
        self.onStatus({
            event: 'register',
            status: false
        })
        return;
      }
        if (this.telecmi_call) {
          self.onStatus({
              event: 'busy',
              status: true
          })
            return;
        }
        if (inetno) {
            if (this.verto) {
                var options = {
                    //'eventHandlers': eventHandlers,
                    mediaConstraints: {
                        audio: true,
                        video: false
                    },
                    pcConfig: {
                        "iceServers": [{
                            "urls": ["stun:stun.l.google.com:19302"]
                        }]
                    },
                    mediaConstraints: {
                        audio: true,
                        video: false
                    },
                    rtcOfferConstraints: {
                        offerToReceiveAudio: 1,
                        offerToReceiveVideo: 0
                    }
                };
                self.telecmi_call = this.verto.call('sip:' + inetno + '@chubws.telecmi.com', options)






            }
            return;
        }
        return
    }


    //Answer incomming call
    Telecmi.prototype.answer = function() {

        if (self.telecmi_call) {

          var options = {
              //'eventHandlers': eventHandlers,
              mediaConstraints: {
                  audio: true,
                  video: false
              },
              pcConfig: {
                  "iceServers": [{
                      "urls": ["stun:stun.l.google.com:19302"]
                  }]
              },
              mediaConstraints: {
                  audio: true,
                  video: false
              },
              rtcOfferConstraints: {
                  offerToReceiveAudio: 1,
                  offerToReceiveVideo: 0
              }
          };

          self.telecmi_call.answer(options);
        }

    }

    //Hangup call
    Telecmi.prototype.hangup = function() {

        if (self.telecmi_call) {

            self.telecmi_call.terminate()
            self.verto.terminateSessions();
        }

    }

    //Status callback
    Telecmi.prototype.onStatus = function(data) {}

    //send dtmf done
    Telecmi.prototype.dtmf = function(key) {

        var key = key | 0
        if (self.telecmi_call) {
            self.telecmi_call.sendDTMF(key.toString())
        }

        return;
    }

    //Mute and unmute
    Telecmi.prototype.mic = function() {
        if (self.telecmi_call) {
            if (self.telecmi_call.mute()) {
                self.telecmi_call.unmute({
                    audio: true
                })
            } else {
                self.telecmi_call.mute({
                    audio: true
                })
            }
        }
        return;
    }

    //Logout from telecmi cloud
    Telecmi.prototype.logout = function() {
        if (self.verto) {
            self.verto.unregister();
        }
        return;
    }

})
