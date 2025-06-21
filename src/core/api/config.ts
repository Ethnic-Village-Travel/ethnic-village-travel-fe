export const API_ROOT = process.env.NEXT_PUBLIC_SERVER_URI;

export const TIMEOUT: number = 150000;

export const API = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
  },
  CONTACT: {
    SEND: '/contact',
  },
  BLOG: {
    GET: '/blog',
  },
  TOUR: {
    SEARCH: '/tour',
    DETAIL: '/tour',
    GET_BOOKMARK_STATUS: '/tours/bookmark/status',
    TOGGLE_BOOKMARK: '/tours/bookmark',
  },
  LOCATION: {
    GET_ALL: '/location',
  },
  ETHNIC: {
    GET_ALL: '/ethnic',
  },
  REVIEW: {
    ADD: '/review',
    EDIT: '/review',
    DELETE: '/review',
    PIN: '/review/pin',
    REPORT: '/review/report',
  },
  BOOKING: {
    GET: '/booking',
    STORE: '/booking/store',
    UPDATE: '/booking/update',
  },
};
