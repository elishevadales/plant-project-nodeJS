require("dotenv").config()

// כל המשתנים שצריכים להיות סודיים יהיו בקובץ הזה
exports.config = {
  userDb:process.env.USER_DB,
  passDb:process.env.PASS_DB,
  tokenSecret:process.env.TOKEN_SECRET,
  admin_token:process.env.ADMIN_TOKEN,
  defaultPort:process.env.DEFAULT_PORT,
  serverAddress:process.env.SERVER_ADDRESS,
  originalAvatar:process.env.ORIGINAL_AVATAR_NAVIGATE_FOLDERS,
  previewAvatar:process.env.PREVIEW_AVATAR_NAVIGATE_FOLDERS,
  originalPlant:process.env.ORIGINAL_PLANT_NAVIGATE_FOLDERS,
  previewPlant:process.env.PREVIEW_PLANT_NAVIGATE_FOLDERS,
}

