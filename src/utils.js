import axios from "axios";
//Create an instance of axio
export const Api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "X-Master-Key": "$2b$10$8ZsiIOSabpp4tdjmziLtIOfie8VqJSRlgnlRliqbD5eebpDOJTDda",
    "X-ACCESS-KEY": "$2b$10$7.aZXSe.ovEQqx.kbF6pyeKcM0NvkrcrkgViWCw9qvJM1Wc1JRiGa"
  },
});

export const HttpURL = "https://api.jsonbin.io/v3/b/645a77f69d312622a35ae912";

export const SelectedDataHttpURL = "https://api.jsonbin.io/v3/b/645a8bc39d312622a35af596";

export const TodayTopic = "Foods";

