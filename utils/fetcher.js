const axios = require("axios");

function automateBearer(headers = {}) {
  if (
    (headers.authorization &&
      !String(headers.authorization).startsWith("Bearer")) ||
    (headers.Authorization &&
      !String(headers.Authorization).startsWith("Bearer"))
  ) {
    headers.Authorization = `Bearer ${
      headers.authorization || headers.Authorization
    }`;
  }
  return headers;
}

exports.getRequest = async ({ url, params = {}, headers = {} }) => {
  headers = automateBearer(headers);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        headers,
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      .then((response) => {
        resolve(response);
      });
  });
};

exports.postRequest = async ({ url, body = {}, headers = {} }) => {
  headers = automateBearer(headers);
  return new Promise((resolve, reject) => {
    axios
      .post(url, body, {
        headers,
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      .then((response) => {
        resolve(response);
      });
  });
};

exports.putRequest = async ({ url, body = {}, headers = {} }) => {
  headers = automateBearer(headers);
  return new Promise((resolve, reject) => {
    axios
      .put(url, body, {
        headers,
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      .then((response) => {
        resolve(response);
      });
  });
};

exports.deleteRequest = async ({ url, body = {}, headers = {} }) => {
  headers = automateBearer(headers);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, body, {
        headers,
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      .then((response) => {
        resolve(response);
      });
  });
};
