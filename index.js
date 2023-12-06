const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 4000;

// 配置multer来处理文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 上传的文件存储在uploads目录下
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const cors = require("cors");
// ...
app.use(cors());

const upload = multer({ storage: storage });

// 处理文件上传的路由
app.post("/upload", upload.single("file"), (req, res) => {
  // req.file 包含上传的文件信息
  console.log("Original File Name:", req.file.originalname);
  console.log("File uploaded:", req.file);

  // 构建响应对象
  const response = {
    success: true,
    message: "File uploaded successfully.",
    fileInfo: {
      filename: req.file.filename, // 上传后的文件名
      originalname: req.file.originalname, // 原始文件名
      size: req.file.size, // 文件大小
      mimetype: req.file.mimetype, // 文件类型
    },
  };

  // 发送 JSON 响应
  res.json(response);
});

// 处理文件下载的路由
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath, req.params.filename);
});

// 添加一个新的路由用于获取下载目录下的文件列表
app.get("/files", (req, res) => {
  const filesPath = path.join(__dirname, "uploads");

  // 使用 fs.readdir 读取文件列表
  fs.readdir(filesPath, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error reading files" });
    }

    // 返回文件列表
    res.json({ success: true, files });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
