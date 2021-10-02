import dummy from "assets/img/default-profile.gif";
import dummyPng from "assets/img/dummy.png";
import loader from "assets/img/Infinity-loader.svg";
export const EMAIL_REGEX = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 16;
export const PASSWORD_PATTERN = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{${MIN_PASSWORD_LENGTH},})`
);
export const URL_PATTERN_LOCK = new RegExp(
  /^(http:\/\/|https:\/\/|www\.)(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(?::\d{1,5})?(?:$|[?\/#])/i
);
export const URL_PATTERN = new RegExp(
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
);

export const PHONE_REGEX = new RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);
export const OK_SUCCESS_STATUS = 200;
export const STATUS_CREATED = 201;
export const NO_CONTENT_STATUS = 204;
export const INVALID_DATA_POST = 400;
export const SECURITY_ERROR = 401;
export const FORBIDDEN_STATUS = 403;
export const NO_DATA_FOUND = 404;
export const SERVER_ERROR = 500;
export const PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PER_PAGE_RECORDS = 10;
export const RECORD_PER_PAGE = 10;
export const DATA_LOADING = "_data_loading";
export const DEFAULT_PROFILE_IMG = dummy;
export const DEFAULT_PROFILE_IMG_PNG = dummyPng;
export const NO_USERNAME = "Anonymous_USER";
export const REDUX_STATE_DATA = "_redux_state_data";
