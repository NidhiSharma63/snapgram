const nextConfig = {
  reactStrictMode: true,
};

// Dynamically import postcss.config.js
const postcssConfig = await import("./postcss.config.js");

export default {
  ...nextConfig,
  // Merge postcssConfig into the exported configuration
  ...postcssConfig,
};
