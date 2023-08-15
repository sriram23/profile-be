const axios = require("axios");
async function imageUrlToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");
    return `data:${
      response.headers["content-type"]
    };base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return null;
  }
}

module.exports = { imageUrlToBase64 };
