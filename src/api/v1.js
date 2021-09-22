import axios from "axios";

// Apps

const getApp = (id) => axios.get("/v1/projects/" + id, {}).then(response => response);
const getApps = (query) => axios.get("/v1/projects/", {params: query}).then(response => response.data);
const getAllApps = () => axios.get("/v1/projects/").then(response => response.data);
const postApp = (form) => axios.post("/v1/projects/", form).then(response => response);
const deleteApp = (id) => axios.delete("/v1/projects/" + id).then(response => response);
const putApp = (id, form) => axios.put("/v1/projects/" + id + "/", form).then(response => response);
const downloadCode = (form) => axios.post("/v1/code_trans/", form).then(response => response);
const putCodeStatus = (id, form) => axios.put("/v1/code_trans/" + id + "/", form).then(response => response);
// Init
const runCommand = (form) => axios.post("/v1/command_run/", form).then(response => response);

// Tasks
const getTask = (id) => axios.get("/v1/tasks/" + id, {}).then(response => response);
const getTasks = (query) => axios.get("/v1/tasks/", {params: query}).then(response => response.data);
const postTask = (form) => axios.post("/v1/tasks/", form).then(response => response);
const deleteTask = (id) => axios.delete("/v1/tasks/" + id + '/').then(response => response);
const putTask = (id, form) => axios.put("/v1/tasks/" + id + "/", form).then(response => response);
const postPlay = (form) => axios.post("/v1/run_play/", form).then(response => response);

export {

  getApp,
  getApps,
  getAllApps,
  postApp,
  deleteApp,
  putApp,
  downloadCode,
  putCodeStatus,
  runCommand,

  getTask,
  getTasks,
  postTask,
  putTask,
  deleteTask,
  postPlay,

}
