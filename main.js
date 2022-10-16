/**
* @description 主函数 
*/
const YAML = require('yamljs') // yaml 解析
const define_json = require("./define_json");
const draw_step = require("./step");
const notifycation = require('./notificacion');
new notifycation("notify")
// 同步倒计时/秒
const syncTimeout = second => new Promise((resolve) => {
    setTimeout(() => resolve(), 1000 * second)
});


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
        return {
            "code": 201,
            "msg": '配置信息错误，请检查信息是否有误！！！！！！'
        };
    }
    var user = info['用户名'];
    var pwd = info['密码'];
    var count = info['步数'];
    if (user == undefined) {
        return {
            "code": 207,
            "msg": '小米运动账号不能为空'
        };
    }
    if (pwd == undefined) {
        return {
            "code": 202,
            "msg": '小米运动密码不能为空'
        };
    }
    if (count == undefined) {
        return {
            "code": 205,
            "msg": '小米运动步数不能为空'
        };
    }
    // console.log("用户名", user.match(/^1[3456789]\d{9}$/)[0]);
    if (user.match(/^1[3456789]\d{9}$/) == 0) {
        return {
            "code": 203,
            "msg": '手机号格式错误！'
        };
    }
    if (parseInt(count) <= 0) {
        return {
            "code": 206,
            "msg": '步数格式错误！'
        };
    }
    if (parseInt(count) > 99999) {
        return {
            "code": 204,
            "msg": '步数最大限制为99999'
        };
    }

    if (info == {}) {
        return {
            "code": 209,
            "msg": "信息获取失败"
        };
    }
    return info;

};



const main = () => {
    var info = get_info();
    let msg = {}
    if (info['code'] == undefined) {

        console.log("个人信息获取成功！！！！");
        console.log("开始登录！！！");

        msg = draw_step(info)
    }
    else {
        console.log("信息错误\n发送错误邮件邮件");
        msg = info;
    }


    console.log("程序结束！！！！");
}

// 本地test
process.env['INFO'] =
    `
用户名: "17687557486"
密码: "hzhm459521"
步数: "9999"
`

main()