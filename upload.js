var http = require("http");
var fs = require("fs");
var formidable = require("formidable");
var qs = require("qs");
const CryptoJS = require("crypto-js");
var request = require("request");
var log = require("log4node");
var fs = require("fs");

// 包含上传表单的html文件
var upload_html = fs.readFileSync("upload.html");

// 将其替换为保存上传文件的位置
var upload_path = "./upload/";
let finalRes = "hhh";

http
  .createServer(async function (req, res) {
    if (req.url == "/uploadform") {
      res.writeHead(200);
      res.write(upload_html);
      return res.end();
    } else if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        // oldpath：文件保存到的临时文件夹
        var oldpath = files.filetoupload.filepath;
        var newpath = upload_path + files.filetoupload.originalFilename;

        // 将文件复制到新位置
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          // 您可能会用另一个html页面进行响应
          res.write("File uploaded and moved!");
          res.end();
        });
      });
    } else if (req.url.includes("parse")) {
      const parseArray = req.url.split("/");

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
        file: `./upload/${parseArray[parseArray.length - 1]}`,
      };

      // 获取当前时间戳
      let ts = parseInt(new Date().getTime() / 1000);

      let options = {
        url: config.hostUrl,
        headers: getReqHeader(),
        form: getPostBody(),
      };

      function getText(data) {
        const arr = data?.block.map((item) =>
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
      await request.post(options, (err, resp, body) => {
        if (err) {
          log.error(err);
        }
        let res = JSON.parse(body || "{}");
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
        log.info("【印刷文字识别 】" + JSON.stringify(getText(res.data)));
        finalRes = JSON.stringify(getText(res.data));
      });
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.write(finalRes, "utf8");
      res.end();
    }
  })
  .listen(80);
