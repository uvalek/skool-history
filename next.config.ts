import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // "universidad" paso a llamarse "uatx". Los alumnos pueden tener enlaces
    // antiguos guardados o compartidos, asi que se redirigen en vez de romperse.
    return [
      { source: "/universidad", destination: "/uatx", permanent: true },
      {
        source: "/universidad/unidad/:id",
        destination: "/uatx/unidad/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
