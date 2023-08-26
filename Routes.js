const express = require("express");
const upload = require("./middlewares/multer");
const {
  addFile,
  getAllFiles,
  getAllDatas,
  clearData,
  UpdateData,
  deleteDoc,
  getAllDocumnets,
} = require("./controller/userController");

const route = express();

route.get("/get/all/users/:size", getAllFiles);
route.get("/get/all/:role", getAllDatas);
route.get("/get/all/documents", getAllDocumnets);

route.post("/file-upload", upload.single("file"), addFile);
route.post("/edit/info", UpdateData);

route.delete("/clear", clearData);
route.delete("/delete/document/:id/:page", deleteDoc);

module.exports = route;
