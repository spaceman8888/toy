import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config){
    config.module.rules.push({
      test: /pdf\.worker\.pdf/,
      type:'asset/resouce'
    })
    return config;
  },
  env:{
    OPENAI_API_KEY : process.env.OPENAI_API_KEY
  }
};

export default nextConfig;
