const request = require('request');
function sendQQ(msg){
  console.log(msg);
    request({
        method: 'GET',
        url: "https://qmsg.zendee.cn/send/1fa44d0974ba10dae90a0c16f099364b?msg="+encodeURIComponent(msg)
    }, function (error, response, body) {
      console.error('error:', error); 
      console.log('statusCode:', response && response.statusCode); 
      console.log('body:', body);
    });
}

module.exports = sendQQ