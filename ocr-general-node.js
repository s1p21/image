/**
 *	
 *运行前：请先填写Appid、APIKey以及图片的路径
 *
  印刷文字识别WebAPI接口调用示例接口文档(必看)：https://doc.xfyun.cn/rest_api/%E5%8D%B0%E5%88%B7%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB.html
  上传图片base64编码后进行urlencode要求base64编码和urlencode后大小不超过4M最短边至少15px，最长边最大4096px支持jpg/png/bmp格式
  (Very Important)创建完webapi应用添加合成服务之后一定要设置ip白名单，找到控制台--我的应用--设置ip白名单，如何设置参考：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=41891
  错误码链接：https://www.xfyun.cn/document/error-code (code返回错误码时必看)
  @author iflytek
*/
const CryptoJS = require("crypto-js");
var request = require("request");
var log = require("log4node");
var fs = require("fs");

// 系统配置
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
  file: "./ocr.jpeg",
};

function ocr() {
  // 获取当前时间戳
  let ts = parseInt(new Date().getTime() / 1000);
  let finalRes = "ssss";

  let options = {
    url: config.hostUrl,
    headers: getReqHeader(),
    form: getPostBody(),
  };

  function getText(data) {
    const arr = data.block.map((item) =>
      item.line.map((lineItem) =>
        lineItem.word.map((wordItem) => wordItem.content)
      )
    );
    return arr.join("\n");
  }
  // 返回结果json串
  request.post(options, (err, resp, body) => {
    if (err) {
      log.error(err);
    }
    let res = JSON.parse(body);
    if (res.code != 0) {
      log.error(
        `发生错误，错误码：${res.code} 错误原因：${res.desc} sid：${res.sid}`
      );
      log.error(
        `请前往https://www.xfyun.cn/document/error-code?code=${res.code}查询解决办法`
      );
    }
    // 打印当前任务标识sid，如有问题请提供至技术人员排查
    // log.info(`sid：${res.sid}`);
    // log.info("【印刷文字识别 】" + JSON.stringify(getText(res.data)));
    finalRes = JSON.stringify(getText(res.data));
    return finalRes;
  });

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
}
