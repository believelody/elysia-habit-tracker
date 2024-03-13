import { Google } from "arctic";
import { config } from "../config";

const { google } = config.credentials;

export const googleAuth = new Google(
  google.clientId,
  google.clientSecret,
  google.redirectURI.href
);
