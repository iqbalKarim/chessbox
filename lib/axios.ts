import axios from "axios";

const lichessApi = axios.create({
  baseURL: "https://explorer.lichess.ovh",
  headers: {
    "Content-Type": "application/json",
  },
});

export default lichessApi;