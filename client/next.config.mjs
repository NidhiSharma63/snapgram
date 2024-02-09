const nextConfig = {
  reactStrictMode: true,
  /** image source thats allowed */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com", port: "", pathname: "" }],
  },
};

// Dynamically import postcss.config.js
const postcssConfig = await import("./postcss.config.js");

export default {
  ...nextConfig,
  // Merge postcssConfig into the exported configuration
  ...postcssConfig,
};
