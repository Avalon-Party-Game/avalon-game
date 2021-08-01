import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["/images/**/*"],
            base: "/",
            manifest: {
                name: "Avalon",
                short_name: "Avalon",
                theme_color: "#333333",
                icons: [
                    {
                        src: "/images/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
});
