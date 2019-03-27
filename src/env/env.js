"use strict";

const LOG = process.env.OUTPUT_EXPRESS_HTTP_LOG || "YES"
const asyncDB = process.env.STARTUP_MONGOOSE_DB_ASYNC || "YES"
const mongoDBUrl = process.env.MONGODB_URL || undefined
const port = process.env.PORT || 3000
const jwt_key = process.env.JWT_SECRET_KEY || undefined
const sendOutEmails = process.env.SENDOUT_EMAILS || "YES"
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || undefined


module.exports = {
    LOG,
    asyncDB,
    mongoDBUrl,
    port,
    jwt_key,
    sendOutEmails,
    SENDGRID_API_KEY
}