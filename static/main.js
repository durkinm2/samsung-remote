
$(document).ready(function() {
    var wol = require('wake_on_lan');
    var ping = require('ping');

    let ws = [null, null, null];
    let wsock = null;
    let tvs_status = [false, false, false];
    let tvs_selected = [false, false, false];
    let ips = ['192.168.0.57', '192.168.0.56', '192.168.0.12'];
    let macs = ['', '', ''];

    var count = 0;

    // set tv selected status
    const toggleTvSelected = (tv) => {
      if (tv == 0 && !tvs_selected[0]) tvs_selected[0] = true;
      else if (tv == 0 && tvs_selected[0]) tvs_selected[0] = false;
      else if (tv == 1 && !tvs_selected[1]) tvs_selected[1] = true;
      else if (tv == 1 && tvs_selected[1]) tvs_selected[1] = false;
      else if (tv == 2 && !tvs_selected[2]) tvs_selected[2] = true;
      else if (tv == 2 && tvs_selected[2]) tvs_selected[2] = false;
    }
    const ip_address = '192.168.0.57';
    const api_timeout = 600000;
    const app_name_base64 = btoa("SamsungRemote.js");

    const sendKey = async (key) => {
        console.info(`Sending ${key} to TV`);
        const cmd = {
            method: "ms.remote.control",
            params: {
                Cmd: "Click",
                DataOfCmd: key,
                Option: "false",
                TypeOfRemote: "SendRemoteKey"
            }
        };
        try {
            await send(JSON.stringify(cmd));
            return { err: null };
        } catch (err) {
            if (err && err.message && err.message == 'not opened') init();
            return { err };
        }
    }

    // if tv is on, initialize websocket
    const init = () => {
      const url = `ws://${ip_address}:8001/api/v2/channels/samsung.remote.control?name=${app_name_base64}`;
      wsock = new WebSocket(url);
        // for (int i = 0; i < ips.length; i++){
        //   if (tvs_status[i]) {
        //     const url = `ws://${ips[i]}:8001/api/v2/channels/samsung.remote.control?name=${app_name_base64}`;
        //     ws[i] = new WebSocket(url);
        //   }
        // }

    }

    // send command for every selected tv
    const send = (str) => {
        return new Promise((resolve, reject) => {
          if (!wsock) reject('not initialized');
          wsock.send(str, (err) => {
              if (err) reject(err);
              resolve();
          });
          // for (int i = 0; i < tvs_selected.length; i++) {
          //   if (tvs_selected[i])
          //   {
          //     if (!ws[i]) reject('not initialized');
          //     ws[i].send(str, (err) => {
          //         if (err) reject(err);
          //         resolve();
          //     });
          //   }
          // }
        });
    }

    // ping tv to get status, toggle power
    const togglePower = () => {

      ping.sys.probe(ip_address, function(isAlive){
        if (!isAlive)
        {
          // turn on
          wol.wake(macs[i]);
          wol.wake(macs[i], function(error) {
            if (error) {
              // handle error
            } else {
              // done sending packets
            }
          });

          var magic_packet = wol.createMagicPacket('5C:C1:D7:8D:11:08');

        }
        else {
          sendKey('KEY_POWER')
        }
      });

      // ips.forEach(function(host, index){
      //     ping.sys.probe(host, function(isAlive){
      //       if (!isAlive)
      //       {
      //
      //       }
      //     });
      // });
      // for (int i = 0; tvs_selected.length; i++){
      //   if (tvs_selected[i])
      //   {
      //     // ping
      //     if ()
      //     {
      //       sendKey('KEY_POWER')
      //       tvs_status[i] = true;
      //     }
      //     // turn on
      //     wol.wake(macs[i]);
      //     wol.wake(macs[i], function(error) {
      //       if (error) {
      //         // handle error
      //       } else {
      //         // done sending packets
      //       }
      //     });
      //
      //     var magic_packet = wol.createMagicPacket('5C:C1:D7:8D:11:08');
      //
      //
      //   }
      // }


    }

    $(".digit").on('click', function() {
      var num = ($(this).clone().children().remove().end().text());
      sendKey('KEY_' + num);
      // if (count < 4) {
      //   $("#output").append('<span>' + num.trim() + '</span>');
      //
      //   count++
      // }
    });

    init();
});
