export const RouteConstant = {
  home: '/',
  login: '/login',
  signup: '/signup',

  tour: '/tour',
  tour_detail: '/tour/:slug',

  article: '/article',
  article_detail: '/article/:slug',

  order: '/order',
  order_detail: '/order/:id',

  payment: '/payment/:id',

  personal: '/personal',
  personal_bookmark: '/personal/bookmark',
  personal_transaction: '/personal/transaction',
  personal_account: '/personal/account',

  //Admin
  admin_auth: '/admin/auth',
  admin_dashboard: '/admin',

  admin_user: '/admin/user',
  admin_user_create: '/admin/user/create',
  admin_user_edit: '/admin/user/edit/:username',

  admin_role: '/admin/role',
  admin_role_create: '/admin/role/create',
  admin_role_edit: '/admin/role/edit/:id',

  admin_tour: '/admin/tour',
  admin_tour_create: '/admin/tour/create',
  admin_tour_edit: '/admin/tour/edit/:slug',

  admin_article: '/admin/article',
  admin_article_create: '/admin/article/create',
  admin_article_edit: '/admin/article/edit/:slug',

  admin_order: '/admin/order',

  admin_notification: '/admin/notification',
  admin_notification_create: '/admin/notification/create',
  admin_notification_edit: '/admin/notification/edit/:id',

  admin_report: '/admin/report',

  admin_chatbot: '/admin/chatbot',
  admin_chatbot_create: '/admin/chatbot/create',
  admin_chatbot_edit: '/admin/chatbot/edit/:slug',

  admin_assigned_available_dates: '/admin/assigned-available-dates',
};
