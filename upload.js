var http = require("http");
var fs = require("fs");
var formidable = require("formidable");
var qs = require("qs");
const CryptoJS = require("crypto-js");
var request = require("request");
var log = require("log4node");
var fs = require("fs");

var xf = require("./index.js");

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
      console.log("jkjkljkjkljkl");

      var form = new formidable.IncomingForm();
      console.log(form, "form");
      form.parse(req, function (err, fields, files) {
        // oldpath：文件保存到的临时文件夹
        var oldpath = files.filetoupload.filepath;
        var newpath = upload_path + files.filetoupload.originalFilename;
        console.log(files, "files");

        // 将文件复制到新位置
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          // 您可能会用另一个html页面进行响应
          xf(files.filetoupload.originalFilename, (text) => {
            console.log("File");
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.write(text, "utf8");
            res.end();
          });
          // res.write("File uploaded and moved!");
          // res.end();
        });
      });
    } else if (req.url.includes("parse")) {
      const parseArray = req.url.split("/");
      const imageName = parseArray[parseArray.length - 1];
      xf(imageName, (text) => {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write(text, "utf8");
        res.end();
      });
    }
  })
  .listen(8088);
