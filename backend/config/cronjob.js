import cron from "cron";
import https from "https";
// import { sendEmail, sendSMS } from '../utils/notificationService.js';

const job = new cron.CronJob("*/14 * * * *", function () {
    https.get(process.env.BACKEND_URL, (res) => {
        if (res.statusCode === 200) {
            console.log("GET request sent successfully");
        } else {
            console.error(`Cron job failed with status code: ${res.statusCode}`);
        }
    }).on("error", (err) => {
        console.error("HTTPS request error:", err.message);
    });
});

export default job;