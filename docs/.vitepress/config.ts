import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/handler-error/",
  description: "Simplify error management with context-rich debugging for Node.js and browsers.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { link: "/", text: "Home" },
      { link: "/docs/getting-started", text: "Docs" },
      { link: "/api/overview", text: "API" },
      { link: "/guides/writing-error-messages", text: "Guides" },
      { link: "/examples/basic", text: "Examples" },
    ],

    sidebar: {
      "/api/": [
        {
          items: [
            { link: "/api/overview", text: "Overview" },
            { link: "/api/properties", text: "Error Properties" },
            { link: "/api/setters", text: "Setters" },
            { link: "/api/utility-methods", text: "Utility Methods" },
            { link: "/api/types", text: "Types" },
          ],
          text: "API",
        },
      ],
      "/docs/": [
        {
          items: [
            { link: "/docs/getting-started", text: "Getting Started" },
            { link: "/docs/installation", text: "Installation" },
            { link: "/docs/quick-start", text: "Quick Start" },
            {
              items: [
                { link: "/docs/usage/custom-errors", text: "Creating Custom Errors" },
                { link: "/docs/usage/handling-errors", text: "Handling Errors" },
                { link: "/docs/usage/environment-info", text: "Environment Info" },
              ],
              text: "Usage",
            },
            { link: "/docs/faq", text: "FAQ" },
          ],
          text: "Docs",
        },
      ],
      "/examples/": [
        {
          items: [
            { link: "/examples/basic", text: "Basic Examples" },
            { link: "/examples/node", text: "Node.js Examples" },
            { link: "/examples/browser", text: "Browser Examples" },
            { link: "/examples/full-application", text: "Full Application" },
          ],
          text: "Examples",
        },
      ],
      "/guides/": [
        {
          items: [
            { link: "/guides/writing-error-messages", text: "Writing Effective Error Messages" },
            { link: "/guides/debugging", text: "Debugging Best Practices" },
            { link: "/guides/logging-services", text: "Integration with Logging Services" },
          ],
          text: "Guides",
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/fvena/handler-error" }],
  },
  title: "Handler Error",
});
