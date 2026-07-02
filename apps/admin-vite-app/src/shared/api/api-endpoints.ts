export const API_ENDPOINTS = {
  UPLOAD_VIDEO: "/cms-api/v1/upload-video",
  CREATE_VIDEO: "/cms-api/v1/create-video",
  GET_LIST_VIDEO: "/cms-api/v1/get-list-video",
  GET_VIDEO: "/cms-api/v1/get-video",
  REMOVE_VIDEO: "/cms-api/v1/remove-video",
  CREATE_USER: "/cms-api/v1/create-user",
  MENU: "/cms-api/v1/menu",
  HEADER: "/cms-api/v1/header",
  LAYOUT: "/cms-api/v1/layout",
  CUSTOM_SECTIONS: "/cms-api/v1/custom-sections",
  LOGIN_GOOGLE_AUTH: "/cms-api/v1/login-google-auth",
  LOGOUT: "/cms-api/v1/logout",
  CONTACT_CTA: "/cms-api/v1/contact/cta",
  CONTACT_SUBMISSIONS: "/cms-api/v1/contact/submissions",
  FOOTER: "/cms-api/v1/footer",
  GET_LIST_SECTION: "/cms-api/v1/get-list-section",
  GET_SECTION: "/cms-api/v1/get-section",
  CREATE_SECTION: "/cms-api/v1/create-section",
  UPDATE_SECTION: "/cms-api/v1/update-section",
  REMOVE_SECTION: "/cms-api/v1/remove-section",
  
  // Support Form Endpoints
  GET_LIST_SUPPORT_FORM: "/cms-api/v1/get-list-support-form",
  GET_SUPPORT_FORM: "/cms-api/v1/get-support-form",
  UPDATE_SUPPORT_FORM_STATUS: "/cms-api/v1/update-support-form-status",
  REMOVE_SUPPORT_FORM: "/cms-api/v1/remove-support-form",
  
  // Web Preview Image (OG Image)
  GET_WEB_PREVIEW_IMAGE_URL: "/cms-api/v1/get-web-preview-image-url",
  UPSERT_WEB_PREVIEW_IMAGE_URL: "/cms-api/v1/upsert-web-preview-image-url",
  REMOVE_WEB_PREVIEW_IMAGE_URL: "/cms-api/v1/remove-web-preview-image-url",
} as const;
