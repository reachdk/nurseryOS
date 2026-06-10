import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo: nurseryOSv2 sits beside v1; trace deps from this app root only.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
