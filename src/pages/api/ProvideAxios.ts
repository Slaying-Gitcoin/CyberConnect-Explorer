export const ERROR_MESSAGE = "Bad Request: Please specify address";

const axios = require("axios").default;

axios.defaults.baseURL = "https://api.etherscan.io";

export default axios;
