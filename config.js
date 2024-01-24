import * as process from "node:process";
import { config } from "dotenv";

config();
const { APS_CLIENT_ID, APS_CLIENT_SECRET } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    console.warn('Missing some of the environment variables.');
    process.exit(1);
}
const APS_BUCKET = `${APS_CLIENT_ID.toLowerCase()}-basic-app`;
const PORT = process.env.PORT || 8080;

export {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
    PORT
};