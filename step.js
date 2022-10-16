
const getForm = require('./form')

var request = require('request');
// npm install xmlhttprequest
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const axios = require('axios');
const notifycation = require('./notificacion');
const http = axios.create()
http.defaults.timeout = 10000
// 定义在 node.js 中 follow 的最大重定向数目
http.defaults.maxRedirects = 0
// 使302不报错
http.defaults.validateStatus = (status) =>
    (status >= 200 && status < 300) || status == 302
http.defaults.headers['user-agent'] =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'


const dispch = new notifycation()
function draw_step(info) {
    // 登录请求
    let data_url = `https://api-user.huami.com/registrations/+86${info["用户名"]}/tokens`;
    let post_data = {
        "client_id": "HuaMi",
        "country_code": "CN",
        "password": info["密码"],
        "redirect_uri": "https%3A//s3-us-west-2.amazonaws.com/hm-registration/successsignin.html",
        "state": "REDIRECTION",
        "token": "access"
    };
    dispch.addEvent("post", (data) => getUserInfo(data));
    let header = curl_sport(data_url, post_data)

}

async function getUserInfo(data) {
    console.log(data, "\n");

}

async function curl_sport(url, post = {}, type = 0, req = "") {
    var header = null
    request.post(
        {
            url: url,
            form: post,
            encoding: 'utf8'
        },
        await function (error, response, body) {
            if (response.statusCode == 200) {
                console.log(body);
            } else {
                header = response.headers["location"]

                let reg = /access=(.*?)\&/
                if (reg.test(header)) {
                    dispch.notify("post", RegExp.$1);
                }
            }
        }
    );
    return header
}
module.exports = draw_step;