export function authHeaderMIMETYPE() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    return {
      Accept: "application/json",
      Authorization: user.accessToken
    };
  } else {
    return {};
  }
}

export function clientTokenHeader() {
  // return authorization header with basic auth credentials
  let clientAuthToken = localStorage.getItem("clientAuthToken");

  if (clientAuthToken) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-App-Authorization": clientAuthToken
    };
  } else {
    return {};
  }
}
export function generalAuthTokenHeader() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}
