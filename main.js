// npm install yamljs
/**
* @description 主函数 
*/

const sendMail = require("./mail")
const axios = require('axios')
const YAML = require('yamljs') // yaml 解析
var Msg = ""
var resule = "失败！！！"
var text = ""
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
}

const json_data = (STEP, dateObj) => {
    return [
        {
            "summary": "{\"slp\":{\"ss\":73,\"lt\":304,\"dt\":0,\"st\":1589920140,\"lb\":36,\"dp\":92,\"is\":208,\"rhr\":0,\"stage\":[{\"start\":269,\"stop\":357,\"mode\":2},{\"start\":358,\"stop\":380,\"mode\":3},{\"start\":381,\"stop\":407,\"mode\":2},{\"start\":408,\"stop\":423,\"mode\":3},{\"start\":424,\"stop\":488,\"mode\":2},{\"start\":489,\"stop\":502,\"mode\":3},{\"start\":503,\"stop\":512,\"mode\":2},{\"start\":513,\"stop\":522,\"mode\":3},{\"start\":523,\"stop\":568,\"mode\":2},{\"start\":569,\"stop\":581,\"mode\":3},{\"start\":582,\"stop\":638,\"mode\":2},{\"start\":639,\"stop\":654,\"mode\":3},{\"start\":655,\"stop\":665,\"mode\":2}],\"ed\":1589943900,\"wk\":0,\"wc\":0},\"tz\":\"28800\",\"stp\":{\"runCal\":1,\"cal\":6,\"conAct\":0,\"stage\":[],\"ttl\":" + STEP + ",\"dis\":144,\"rn\":0,\"wk\":5,\"runDist\":4,\"ncal\":0},\"v\":5,\"goal\":8000}",
            "data": [
                {
                    "stop": 1439,
                    "value": "WhQAUA0AUAAAUAAAUAAAUAAAUAAAWhQAUAYAcBEAUAYAUA8AUAsAUAYAUDIAUCQAUDkAUCkAUD4AUC0AUFcAUD8AUCkAUCEAUCwAUCsAUB4AUCQAUBsAUCcAUBQAUDcAUBoAUCYAUFcAUCAAUDkAUCEAWhQAWhQAWhQAUBAAUEgAUDsAUAgAWhQAUDwAUCEAUAIAUAsAUDoAUD8AWhQAWhQAWhQAWhQAWhQAWhQAAS0QEAsAWhQAAR8SEBcHYC4AUCoAUBMAUAIAUAYAUAsAUCsAUAUAUBIAUBIAUBsAUBgAUAoAUBsAUBUAUBkAUDIAUC0AUC4AUBAAWhQAUCsAUB8AUAIAUB8AUDUAUEEAUDUAUBkAUCYAUEoAUCYAUBIAUCAAUCkAUDAAUB4AUB0AUDEAUCUAUCgAUAQAWhQAUA8AUDwAUB8AUCUAUBQAUB4AUAUAWhQAUAAAUA8AUBkAUCgAUCwAUCkAUCgAYCIAYCIAYCgAUAoAWhQAUBwAWhQAUBoAUDkAUD4AYAkAYAYAWhQAWhQAUB4AWhQAUAQAUBcAUBAAUAUAWhQAUB0AcBYAehQAcBoAehQAehQAehQAcAMAcAMAehQAcAIAehQAcBIAcA0AehQAehQAcAsAcAYAcAEAcAoAehQAehQAcAwAehQAehQAehQAcAEAehQAehQAcAsAehQAehQAcA8AcBkAcAYAcBkAcC0AcAQAcBsAcAMAWhQAUAMAWhQAUBEAUAIAWhQAWhQAWhQAehQAehQAehQAehQAehQAehQAcAAAcB8AcBMAehQAehQAcDkAcBAAcAEAcAMAcAMAcCwAcA8AcAAAcAAAcCIAcAAAcCcAcB4AehQAcAkAehQAcCMAehQAehQAcAoAehQAehQAehQAcBgAcBgAcAkAehQAcAcAcCgAcBQAcA0AcAwAcCcAcCkAcAAAUAAAUAAAUB4AUBwAUAAAUAAAUCkAUBIAUBMAUCgAUA8AUBEAUD0AUCAAYAMAYCkAUBsAUB4AYCgAahQAUBkAWhQAWhQAUCAAUBcAUA8AUBAAUAcAUB8AUCEAUCMAUCkAYAMAYAAAUBsAUBEAUBgAUAUAUB0AUAAAUAAAUAAAUAAAUAAAUAQAUAAAUAAAUAAAUAAAWwAAUAAAcAAAcAAAcAAAcAAAcAAAcAAAcA0AcAAAcAAAcAAAcAIAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcA8AehQAehQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAEAeRMAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAsAcAAAcAAAcAAAcAAAcAAAcAoAcAAAcBMAcAAAcAAAcAAAcAAAcAAAcAAAcA4AcAcAehQAehQAcAAAcAAAcAIAehQAehQAcAAAcAAAcAAAcAAAcAAAcAIAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcBcAehQAehQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAehQAcAMAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcBUAeQAAcAAAcAAAcAAAcFgAcAAAcAAAcAAAcBkAeQAAcAAAcAAAcAAAcAAAcE0AcAQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAeVAAehQAehQAcAAAcAAAcAAAcAAAcAUAeRwAUAAAUFUAUAAAUAAAUAAAUAAAUAAAUCMAeQAAcAAAcAAAcE0AUAAAUAAAUAAAUAAAUAAAUAAAcAAAcAAAcAAAcE4AcAAAcAAAcAAAcAAAcAgAcBAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAkAcAAAcAAAcAAAcAAAcBwAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAYAcBAAeQAAcB8AeQAAcAAAcAAAcAAAeSoAcAAAcAAAcAAAcAAAcAAAcAsAcAAAeScAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcCAAcAAAUAAAUAAAUAAAUAAAUAAAUBEAehQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcBwAehQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcBYAcAAAcAAAcAAAcAYAcAAAcAAAcCsAcAAAcAAAcAgAcAAAcAAAcBsAeRQAcAAAcAAAcAEAcAAAcAAAcAAAcAAAcAAAcAAAcA8AcAAAcAAAcBoAcAAAcAEAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcBIAcAAAcA0AcBAAcAAAcAAAcAAAcAAAehQAehQAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcAAAcCgAcAAAcBkAcAAAcB0AcAAAcAAAcBgAcAAAUAEAUBsAWhQAUB4AWhQAUCkAWQ8AUCsAUA0AWTUAXBAAWhQAUBMAUAQAUAcAUAoAUA8AUBkAUBcAUCoAUAIAUBQAWhQAWhQAUBIAUBQAUAcAWhQAUBYAWhQAUAgAWhQAWhQAUAkAUE0AUHUAAWMTEEcKYDoAYAgAUAMAWhQAUAUAUAYAUAkAUB4AUAsAUAIAUBMAWhQAAVQdAWAlEDYAYCQAUAQAUBgAUAgAUAUAUBQAUAIAWhQAUAkAUAMAUA4AWhQAehQAcAoAcAIAehQAcB0AcCcAUCsAUAEAUAgAUAoAUAIAUAsAUAIAWhQAWhQAUAgAUA0AWhQAUAYAWhQAUAEAWhQAWhQAUBAAUBQAUBIAUBcAUAoAYBAAYAIAAUkZAUglAVYSYBcAYAoAYCAAYAsAUBUAUB0AUBAAUBEAUCAAUBUAUBYAUA0AUB4AUBcAUBsAUBMAUBUAYAsAYAwAYAsAUB4AUBoAUBoAUBoAUBQAUAcAWhQAUBgAUBkAUBsAUBUAUBAAUCAAUCYAUB8AUB4AUBwAUAcAUBsAUBwAUBwAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAA",
                    "did": "DA932FFFFE8816E7",
                    "tz": 32,
                    "src": 17,
                    "start": 0
                }
            ],
            "data_hr": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+",
            "summary_hr": "{\"ct\":0,\"id\":[]}",
            "date": `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`
        }
    ]
}

const get_info = () => {
    const infoStr = process.env['INFO']
    let info = {}
    // 解析
    try {
        // 传入的是json
        if (infoStr.includes('{') && infoStr.includes('}')) {
            info = JSON.parse(infoStr)
        }
        // 传入的是yaml
        else {
            info = YAML.parse(infoStr)
        }
    } catch (error) {
        throw new Error({
            "code": 201,
            "message": '配置信息错误，请检查信息是否有误！！！！！！',
            "error": error
        });
    }
    var user = info['用户名'];
    var pwd = info['密码'];
    var count = info['步数'];
    var max = parseInt(info['MAX']);
    var min = parseInt(info['MIN']);
    if (user == undefined) {
        throw new Error("信息填写错误：小米运动账号不能为空")
    }
    if (pwd == undefined) {
        throw new Error("信息填写错误：小米运动密码不能为空")
    }
    if (count == undefined) {
        throw new Error("信息填写错误：小米运动步数不能为空")
    }
    // console.log("用户名", user.match(/^1[3456789]\d{9}$/)[0]);
/*  if (user.match(/^1[3456789]\d{9}$/) == 0) {
        throw new Error("信息填写错误：手机号格式错误！")
    }*/
    if (max && min) {
        let tmax = Math.max(max, min)
        let tmin = Math.min(max, min)
        info['步数'] = (Math.floor(Math.random() * (parseInt(tmax) - parseInt(tmin) + 1)) + parseInt(tmin));
        console.log("随机步数 ==>>>", info['步数']);
    } else {
        if (parseInt(count) <= 0) throw new Error("信息填写错误：步数要大于零。。。。=>>步数：count")

        if (parseInt(count) > 99999) throw new Error("信息填写错误：步数最大限制为99999")
    }

    if (info == {}) {
        throw new Error("信息填写错误：信息获取失败，没有配置小米运动账号信息")
    }
    // 验证邮箱
    if (info['邮箱']) {
        const mailReg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
        if (!mailReg.test(info['邮箱'])) {
            console.log('获取邮箱失败, 邮箱格式错误')
            info['邮箱'] = null
        } else {
            console.log('获取邮箱成功')
        }
    } else {
        console.log('获取邮箱失败, 未填写邮箱')
    }
    return info;

};


var handleCircular = function () {
    var cache = [];
    var keyCache = []
    return function (key, value) {
        if (typeof value === 'object' && value !== null) {
            var index = cache.indexOf(value);
            if (index !== -1) {
                return '[Circular ' + keyCache[index] + ']';
            }
            cache.push(value);
            keyCache.push(key || 'root');
        }
        return value;
    }
}
var tmp = JSON.stringify;
JSON.stringify = function (value, replacer, space) {
    replacer = replacer || handleCircular();
    return tmp(value, replacer, space);
}

// 获取登录code
function get_code(str) {
    const reg = /(?<=access=).*?(?=&)/;
    const codeArr = reg.exec(str);
    return codeArr[0];
}

async function requestPromise(params) {
    return axios({
        url: params.url,
        method: params.method,
        headers: params.headers || headers,
        data: new URLSearchParams(params.body),
        validateStatus: status => {
            return status >= 200 && status < 400;
        },
        maxRedirects: 0
    })
        .then(res => {
            console.log("=====================获取状态码");
            let reg = /error=(\d+)/
            if (reg.test(res.headers.location)) {
                Msg += `<div style="color:#d03050;font-size:1.2em;">数据请求失败！！！<br/>可能是账号或者密码错误!!!!\n错误码${RegExp.$1 + "\n"}<br></div>`
                Msg += `<div style="color:#d03050;font-size:0.8em;">${res.headers.location}</div><hr/>`
            }
            return res;
        })
        .catch(err => {
            Msg += `<div style="color:#d03050;font-size:1.2em;">[数据请求失败！！！]<br/>可能是账号或者密码错误!!!!\n错误信息<br>${err}</div><hr/>`
            console.log(params.url, err)
            console.log(err);
        })
}

// 登陆
async function login(user, password) {
    console.log("正在尝试登录.......\n");
    const res1 = await requestPromise({
        url: `https://api-user.huami.com/registrations/+86${user}/tokens`,
        body: {
            "client_id": "HuaMi",
            "password": password,
            "redirect_uri": "https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html",
            "token": "access"
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent": "MiFit/4.6.0 (iPhone; iOS 14.0.1; Scale/2.00)"
        },
        method: 'POST',
    })
    console.log("res1====", res1.headers)
    // Msg += `<div style="color:#d03050;font-size:1.5em;">${res1.headers.location}<br/></div><hr/>`
    let reg = /(?<=access=).*?(?=&)/
    if (!reg.test(res1.headers.location)) return 0, 0
    console.log('===========登陆成功===========\n')
    Msg += `<div style="color:#18a058;font-size:1.5em;">[登陆成功]<br/></div><hr/>`
    const code = get_code(res1.headers.location)
    const res2 = await requestPromise({
        url: 'https://account.huami.com/v2/client/login',
        body: {
            "app_name": "com.xiaomi.hm.health",
            "app_version": "4.6.0",
            "code": code,
            "country_code": "CN",
            "device_id": "2C8B4939-0CCD-4E94-8CBA-CB8EA6E613A1",
            "device_model": "phone",
            "grant_type": "access_token",
            "third_name": "huami_phone",
        },
        method: 'POST',
    })
    // console.log('res2====', "JSON.stringify(res2.data)")

    const login_token = res2.data.token_info.login_token;
    const userid = res2.data.token_info.user_id;
    console.log("", res2.data.thirdparty_info.nickname);
    console.log("邮件/电话", res2.data.thirdparty_info.email);
    console.log("用户id", userid);
    console.log("账号信息\n", res2.data);
    // Msg["name"] = res2.data.thirdparty_info.nickname
    // Msg["mail"] = res2.data.thirdparty_info.email
    // Msg["ID"] = userid
    Msg += `<div style="color:#18a058;font-size:1.2em;">用户名：${res2.data.thirdparty_info.nickname}<br/>ID：${userid}</div><hr/>`
    console.log("获取成功\n\n\n\n");
    // console.log("res2.data.token_info",res2.data);
    return {
        login_token,
        userid,
    }
}

// 获取时间戳
async function get_time() {
    const res = await requestPromise({
        url: 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
        method: 'GET',
    });
    console.log('get_time res===', res.data.data.t)
    return res.data.data.t;
}

// 获取app_token
async function get_app_token(login_token) {
    console.log("正在获取app_token");
    const res = await requestPromise({
        url: `https://account-cn.huami.com/v1/client/app_tokens?app_name=com.xiaomi.hm.health&dn=api-user.huami.com%2Capi-mifit.huami.com%2Capp-analytics.huami.com&login_token=${login_token}&os_version=4.1.0`,
        method: 'GET'
    })
    // console.log('get_app_token res===', res.data.token_info.app_token)
    return res.data.token_info.app_token;
}

//util.js
//获取当前utc时间戳
function getUTCTime() {
    let d1 = new Date();
    let d2 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
    return Date.parse(d2);
}

//  console.log("东八区-北京时间：" + getLocalTime(8)); //东八区-北京时间：Wed May 25 2022 10:10:32 GMT+0800 (中国标准时间)
//  console.log("西八区-太平洋时间（美国和加拿大）：" + getLocalTime(-8)); //西八区-太平洋时间（美国和加拿大）：Tue May 24 2022 18:10:32 GMT+0800 (中国标准时间)
//  // i：要得到那个时区的时间就传几，东区为正数，西区为负数

// // 本地test
// process.env['INFO'] =
//     `
// 用户名: ""
// 密码: ""
// 步数: ""
// MAX: ""
// MIN: ""
// 邮箱: ""
// `
exports.main = async () => {
    var info = get_info();
    console.log("配置信息==>>\n", info);
    const date = new Date();

    // ✅ 使用 UTC (= GMT) 时区获取表示给定日期的字符串。
    const UTC_TIME = date.toUTCString();
    Msg+=`<div style="color:#18a058;font-size:1.2em;">UTC时间：${UTC_TIME}</div><hr/>`
    Msg+=`<div style="color:#18a058;font-size:1.2em;">GMT时间：${new Date()}<br></div><hr/>`
    if (info) {
        console.log("个人信息获取成功！！！！");
        Msg += `<div style="color:#18a058;font-size:1.2em;">同步步数为=>${info["步数"]}</div><hr/>`
        let dataJson2 = json_data(info["步数"], new Date())
        // console.log(dataJson2);
        let { login_token = 0, userid } = await login(info["用户名"], info["密码"])
        if (login_token === 0) {
            Msg += `<div style="color:#d03050;font-size:1.2em;"><br>[登陆失败！]<br/>login_token = ${login_token}</div><hr/>`
        }
        else {
            const t = await get_time();
            const app_token = await get_app_token(login_token);

            resule = `尝试提交步数${info["步数"]}\n`
            const res = await requestPromise({
                url: `https://api-mifit-cn.huami.com/v1/data/band_data.json?&t=${t}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.12(0x17000c2d) NetType/WIFI Language/zh_CN',
                    'apptoken': app_token,
                },
                body: {
                    'data_json': JSON.stringify(dataJson2),
                    'userid': userid,
                    'device_type': '0',
                    'last_sync_data_time': '1589917081',
                    'last_deviceid': 'DA932FFFFE8816E7',
                },
                method: "POST",
            })
            Msg += `<div style="color:#18a058;font-size:1.2em;">状态：${res.data.message}</div><hr/>`
        }
    }
    else {
        console.log("信息错误\n发送错误邮件邮件");
        Msg["message"] = "个人信息配置错误\n请检查环境变量配置";
        Msg["subject"] =
            Msg["code"] = -1;
        Msg["body"] = info;
        msg = info;
    }
    console.log("Msg=\n", Msg);
    myMail = info["邮箱"] ? info["邮箱"] : conf["邮箱"]
    if (myMail) {
        console.log(`向${myMail}发送邮件！！！！`);
        sendMail(myMail, resule, Msg)
    }
    else {
        console.log(`邮箱没有配置，取消发送邮件。。。`);
    }
}

exports.main()
