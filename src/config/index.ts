export const config = {
  credentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "find your value on google cloud console",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "find your value on google cloud console",
      redirectURI: new URL(
        process.env.HOST_URL +
          ":" +
          process.env.PORT +
          process.env.GOOGLE_REDIRECT_URI_PATH
      ),
    },
  },
  baseURL: new URL(process.env.HOST_URL + ":" + process.env.PORT),
};
