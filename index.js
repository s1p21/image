var http = require("http");
var fs = require("fs");
var formidable = require("formidable");
var qs = require("qs");
const CryptoJS = require("crypto-js");
var request = require("request");
var log = require("log4node");
var fs = require("fs");

function xf(imageName, okFunction) {
  const config = {
    // 印刷文字识别 webapi 接口地址
    hostUrl: "https://webapi.xfyun.cn/v1/service/v1/ocr/general",
    host: "webapi.xfyun.cn",
    //在控制台-我的应用-印刷文字识别获取
    appid: "9f89e742",
    // 接口密钥(webapi类型应用开通印刷文字识别服务后，控制台--我的应用---印刷文字识别---服务的apikey)
    apiKey: "f95ecf91dc56ab8ed98cdd7c99d62d15",
    uri: "/v1/ise",
    // 上传本地图片
    file: `./upload/${imageName}`,
  };

  // 获取当前时间戳
  let ts = parseInt(new Date().getTime() / 1000);

  let options = {
    url: config.hostUrl,
    headers: getReqHeader(),
    form: getPostBody(),
  };

  function getText(data) {
    const arr = ((data || {}).block || []).map((item) =>
      item.line.map((lineItem) =>
        lineItem.word.map((wordItem) => wordItem.content)
      )
    );
    return arr.join("\n");
  }

  // 组装业务参数
  function getXParamStr() {
    let xParam = {
      language: "cn|en",
    };
    return CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(JSON.stringify(xParam))
    );
  }

  // 组装请求头
  function getReqHeader() {
    let xParamStr = getXParamStr();
    let xCheckSum = CryptoJS.MD5(config.apiKey + ts + xParamStr).toString();
    return {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "X-Appid": config.appid,
      "X-CurTime": ts + "",
      "X-Param": xParamStr,
      "X-CheckSum": xCheckSum,
    };
  }

  // 组装postBody
  function getPostBody() {
    let buffer = fs.readFileSync(config.file);
    return {
      image: buffer.toString("base64"),
    };
  }
  // 返回结果json串
  request.post(options, (err, resp, body) => {
    if (err) {
      log.error(err);
    }
    let xfRes = JSON.parse(body || "{}");
    if (xfRes.code != 0) {
      log.error(
        `发生错误，错误码：${xfRes.code} 错误原因：${xfRes.desc} sid：${xfRes.sid}`
      );
      log.error(
        `请前往https://www.xfyun.cn/document/error-code?code=${xfRes.code}查询解决办法`
      );
    }
    // 打印当前任务标识sid，如有问题请提供至技术人员排查
    // log.info(`sid：${res.sid}`);
    log.info("【印刷文字识别 】" + JSON.stringify(getText(xfRes.data)));
    finalRes = JSON.stringify(getText(xfRes.data));
    okFunction && okFunction(finalRes);
  });
}

module.exports = xf;
