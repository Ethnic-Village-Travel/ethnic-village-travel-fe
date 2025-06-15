export const API_ROOT = process.env.NEXT_PUBLIC_SERVER_URI;

export const TIMEOUT: number = 150000;

export const API = {
  CUSTOMER: {
    LOGIN: '/login',
  },
  CONTACT: {
    SEND: '/contact',
  },
  BLOG: {
    GET: '/blog',
  },
  TOUR: {
    SEARCH: 'tour',
    GET_BOOKMARK_STATUS: '/tours/bookmark/status',
    TOGGLE_BOOKMARK: '/tours/bookmark',
  },
  LOCATION: {
    GET_ALL: 'location',
  },
  ETHNIC: {
    GET_ALL: 'ethnic',
  },
};
