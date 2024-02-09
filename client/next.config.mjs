// Dynamically import postcss.config.js
const postcssConfig = await import("./postcss.config.js");

export default {
  reactStrictMode: true,
  /** image source thats allowed */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
  // Merge postcssConfig into the exported configuration
  ...postcssConfig,
};
