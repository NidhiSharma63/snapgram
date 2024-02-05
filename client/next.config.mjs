const nextConfig = {
  reactStrictMode: true,
  /** image source thats allowed */
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

// Dynamically import postcss.config.js
const postcssConfig = await import("./postcss.config.js");

export default {
  ...nextConfig,
  // Merge postcssConfig into the exported configuration
  ...postcssConfig,
};
