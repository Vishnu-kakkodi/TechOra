const MESSAGES = {
    SUCCESS: {
      USER_CREATED: "User has been successfully created.",
      DATA_RETRIEVED: "Data fetched successfully.",
      USER_UPDATED: "User details have been successfully updated.",
      USER_DELETED: "User has been successfully deleted.",
      LOGIN_SUCCESS: "Login successful.",
      LOGOUT_SUCCESS: "Logout successful.",
      PASSWORD_CHANGED: "Password has been successfully changed.",
      OTP_SEND: "Otp send successfully.",
      QUIZ_CREATED: "Quiz created.",
      QUIZ_UPDATED: "Quiz updated.",
      QUIZ_FETCHED: "Quiz fetched successfully.",
      COURSE_CREATED: "Course created successfully.",
      INSTITUTE_APPROVED: "Institute approved successfully",
      BLOCKED: "Successfully blocked.",
      UNBLOCKKED: "Successfully Unblocked.",
      ADD_TO_CART: "Successfully added to cart",
      ALREADY_ADDED: "Already added",
      REMOVE_CART: "Removed successfully",
      ADDED_TO_WISHLIST: "Successfully added to wishlist",
      COURSE_APPROVED: "Course Approved",
      COURSE_UPDATED: "Course Updated",
      COURSE_DELETED: "Course Deleted"

    },
  
    ERROR: {
      USER_NOT_FOUND: "User not found.",
      INSTITUTE_NOT_FOUND: "User not found.",
      TIME_EXPIRED: "Time expired, Try again.",
      EMAIL_ALREADY_EXISTS: "Email already exists.",
      INVALID_CREDENTIALS: "Invalid email or password.",
      INVALID_CURRENT_PASSWORD: "Incorrect current password.",
      SAME_PASSWORD: "New password cannot be the same as the current password.",
      INVALID_OTP: "Invalid otp.",
      UNAUTHORIZED: "Unauthorized access.",
      APPLICATION_REJECTED: "Your application was rejected due to insufficient documentation.",
      FORBIDDEN: "You do not have permission to access this resource.",
      SERVER_ERROR: "Internal Server Error. Please try again later.",
      BAD_REQUEST: "Invalid input data.",
      TOKEN_EXPIRED: "Authentication token has expired.",
      ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
      OTP_EXPIRED: "OTP has expired. Please request a new one.",
      ALREADY_ADDED_TO_CART: 'Course already exists in cart',
      DATA_NOTFOUND: "Data not found.",
      INVALID_FORMAT:  'Invalid URL format',
      INSTITUTION_ID_REQUIRED: "Institution ID is required.",
      TUTOR_ID_REQUIRED: "Tutor ID is required.",
      USER_ID_REQUIRED: "User ID is required.",
    },
  
    VALIDATION: {
      EMAIL_REQUIRED: "Email is required.",
      PASSWORD_REQUIRED: "Password is required.",
      INVALID_EMAIL: "Invalid email format.",
      PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
    },
  };
  
  export default MESSAGES;
  