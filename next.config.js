/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // used in axios instance, just rename it
    // with '/', no need to trim it anywhere
    // all paths have '/'
    // NEXT_PUBLIC_BASE_URL: `${process.env.NEXTAUTH_URL}/`,
    NEXT_PUBLIC_POSTS_PER_PAGE: "5",
    NEXT_PUBLIC_USERS_PER_PAGE: "3",
    NEXT_PUBLIC_DEFAULT_THEME: "theme-blue",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
