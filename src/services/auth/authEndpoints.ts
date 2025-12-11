import { baseUrl } from "playwrap";

const authEndpoints = {
  auth() {
    return `${baseUrl()}api/auth/`;
  },
  login() {
    return `${this.auth()}login`;
  },
  validate() {
    return `${this.auth()}validate`;
  },
};

export default authEndpoints;
