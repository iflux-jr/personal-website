// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import db from "@astrojs/db";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import node from "@astrojs/node";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://iamrob.in",
    devToolbar: {
        enabled: false,
    },
    integrations: [
        icon(),
        ...(process.env.ENABLE_ASTRO_DB === "true" ? [db()] : []),
        sitemap({
            filter: (page) =>
                !page.includes("/postcards/error") &&
                !page.includes("/postcards/success") &&
                !page.includes("/postcards/new") &&
                !page.endsWith("/blog-rss.xml") &&
                !page.endsWith("/bookmarks-rss.xml"),
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            noDiscovery: true,
            include: [],
            exclude: ["aria-query", "axobject-query"],
        },
        ssr: {
            external: ["aria-query", "axobject-query"],
        },
        resolve: {
            alias: {
                "@components": fileURLToPath(
                    new URL("./src/components", import.meta.url),
                ),
                "@assets": fileURLToPath(
                    new URL("./src/assets", import.meta.url),
                ),
                "@layouts": fileURLToPath(
                    new URL("./src/layouts", import.meta.url),
                ),
                "@utils": fileURLToPath(
                    new URL("./src/utils", import.meta.url),
                ),
                "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
                "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
                "aria-query": fileURLToPath(
                    new URL(
                        "./src/utils/dev-toolbar-stubs/aria-query.js",
                        import.meta.url,
                    ),
                ),
                "axobject-query": fileURLToPath(
                    new URL(
                        "./src/utils/dev-toolbar-stubs/axobject-query.js",
                        import.meta.url,
                    ),
                ),
            },
        },
    },

    adapter: node({ mode: "standalone" }),
    security: {
        checkOrigin: false,
    },
});
