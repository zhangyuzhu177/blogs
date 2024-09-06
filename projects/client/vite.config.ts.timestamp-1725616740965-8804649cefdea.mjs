// vite.config.ts
import path from "node:path";
import process from "node:process";
import Unocss from "file:///D:/demo/blogs/node_modules/.pnpm/unocss@0.60.4_postcss@8.4.43_vite@5.4.2/node_modules/unocss/dist/vite.mjs";
import Vue from "file:///D:/demo/blogs/node_modules/.pnpm/@vitejs+plugin-vue@5.1.3_vite@5.4.2_vue@3.4.38/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-pages@0.31.0_vite@5.4.2/node_modules/vite-plugin-pages/dist/index.mjs";
import { defineConfig, loadEnv } from "file:///D:/demo/blogs/node_modules/.pnpm/vite@5.4.2_@types+node@18.19.48_sass@1.77.8/node_modules/vite/dist/node/index.js";
import Layouts from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-vue-layouts@0.8.0_vite@5.4.2_vue-router@4.4.3_vue@3.4.38/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import generateSitemap from "file:///D:/demo/blogs/node_modules/.pnpm/vite-ssg-sitemap@0.5.1/node_modules/vite-ssg-sitemap/dist/index.js";
import VueMacros from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-vue-macros@2.11.6_@vueuse+core@10.11.1_esbuild@0.23.1_typescript@5.5.4_vite@5.4.2_vue-tsc@1.8.27_vue@3.4.38/node_modules/unplugin-vue-macros/dist/vite.mjs";
import AutoImport from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1/node_modules/unplugin-auto-import/dist/vite.js";
import VueDevTools from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-vue-devtools@0.5.1_@types+node@18.19.48_axios@1.7.7_nprogress@0.2.0_pug@3.0.3_vite@5.4.2_vue@3.4.38/node_modules/vite-plugin-vue-devtools/dist/index.mjs";
import WebfontDownload from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-webfont-dl@3.9.5_vite@5.4.2/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import Components from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.38/node_modules/unplugin-vue-components/dist/vite.js";
import { QuasarResolver } from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.38/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "D:\\demo\\blogs\\projects\\client";
var vite_config_default = ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, path.relative(__vite_injected_original_dirname, "../shared")),
    VITE_MODE: mode
  };
  return defineConfig({
    base: process.env.VITE_CLIENT_BASE || "/",
    define: {
      "process.env": {}
    },
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(process.env.VITE_CLIENT_PORT || "3334"),
      proxy: {
        [process.env.VITE_API_BASE]: {
          target: process.env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(new RegExp(`^${process.env.VITE_API_BASE}`), ""),
          secure: false
        }
      }
    },
    resolve: {
      alias: {
        "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    plugins: [
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/]
          })
        }
      }),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ["vue", "md"]
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "@vueuse/head",
          "@vueuse/core",
          "quasar"
        ],
        dts: "src/types/auto-imports.d.ts",
        dirs: [
          "src/composables",
          "src/constants",
          "src/utils",
          "../shared/api",
          "../shared/composables",
          "../shared/constants",
          "../shared/utils/**"
        ],
        vueTemplate: true,
        resolvers: [QuasarResolver()]
      }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/types/components.d.ts",
        dirs: [
          "src/components",
          "../shared/components"
        ],
        resolvers: [QuasarResolver()]
      }),
      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),
      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),
      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools()
    ],
    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: "async",
      formatting: "minify",
      crittersOptions: {
        reduceInlineStyles: false
      },
      onFinished() {
        const flag = process.env.VITE_SITEMAP ?? false;
        const truly = [true, "true", "yes", "1", "TRUE", "YES", "True", "Yes"];
        if (truly.includes(flag))
          generateSitemap();
      }
    },
    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ["workbox-window", "lodash", "jsencrypt", "quasar", "md-editor-v3"]
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZW1vXFxcXGJsb2dzXFxcXHByb2plY3RzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZGVtb1xcXFxibG9nc1xcXFxwcm9qZWN0c1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2RlbW8vYmxvZ3MvcHJvamVjdHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJ1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xuaW1wb3J0IGdlbmVyYXRlU2l0ZW1hcCBmcm9tICd2aXRlLXNzZy1zaXRlbWFwJ1xuaW1wb3J0IFZ1ZU1hY3JvcyBmcm9tICd1bnBsdWdpbi12dWUtbWFjcm9zL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcbmltcG9ydCBXZWJmb250RG93bmxvYWQgZnJvbSAndml0ZS1wbHVnaW4td2ViZm9udC1kbCdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBRdWFzYXJSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcblxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBhbnkpID0+IHtcbiAgcHJvY2Vzcy5lbnYgPSB7XG4gICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgLi4ubG9hZEVudihtb2RlLCBwYXRoLnJlbGF0aXZlKF9fZGlybmFtZSwgJy4uL3NoYXJlZCcpKSxcbiAgICBWSVRFX01PREU6IG1vZGUsXG4gIH1cblxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICBiYXNlOiBwcm9jZXNzLmVudi5WSVRFX0NMSUVOVF9CQVNFIHx8ICcvJyxcbiAgICBkZWZpbmU6IHtcbiAgICAgICdwcm9jZXNzLmVudic6IHt9LFxuICAgIH0sXG5cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIHBvcnQ6IE51bWJlci5wYXJzZUludChwcm9jZXNzLmVudi5WSVRFX0NMSUVOVF9QT1JUIHx8ICczMzM0JyksXG4gICAgICBwcm94eToge1xuICAgICAgICBbcHJvY2Vzcy5lbnYuVklURV9BUElfQkFTRSBhcyBzdHJpbmddOiB7XG4gICAgICAgICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5WSVRFX1BST1hZX1RBUkdFVCxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7cHJvY2Vzcy5lbnYuVklURV9BUElfQkFTRX1gKSwgJycpLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnfi8nOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2AsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBwbHVnaW5zOiBbXG4gICAgICBWdWVNYWNyb3Moe1xuICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAgdnVlOiBWdWUoe1xuICAgICAgICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLm1kJC9dLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oYW5ub2VydS92aXRlLXBsdWdpbi1wYWdlc1xuICAgICAgUGFnZXMoe1xuICAgICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgICAgfSksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Kb2huQ2FtcGlvbkpyL3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXG4gICAgICBMYXlvdXRzKCksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICAndnVlJyxcbiAgICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICAgJ0B2dWV1c2UvaGVhZCcsXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICAgICAgJ3F1YXNhcicsXG4gICAgICAgIF0sXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgICAgIGRpcnM6IFtcbiAgICAgICAgICAnc3JjL2NvbXBvc2FibGVzJyxcbiAgICAgICAgICAnc3JjL2NvbnN0YW50cycsXG4gICAgICAgICAgJ3NyYy91dGlscycsXG4gICAgICAgICAgJy4uL3NoYXJlZC9hcGknLFxuICAgICAgICAgICcuLi9zaGFyZWQvY29tcG9zYWJsZXMnLFxuICAgICAgICAgICcuLi9zaGFyZWQvY29uc3RhbnRzJyxcbiAgICAgICAgICAnLi4vc2hhcmVkL3V0aWxzLyoqJyxcbiAgICAgICAgXSxcbiAgICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXG4gICAgICAgIHJlc29sdmVyczogW1F1YXNhclJlc29sdmVyKCldLFxuICAgICAgfSksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50c1xuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIC8vIGFsbG93IGF1dG8gbG9hZCBtYXJrZG93biBjb21wb25lbnRzIHVuZGVyIGAuL3NyYy9jb21wb25lbnRzL2BcbiAgICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAnbWQnXSxcbiAgICAgICAgLy8gYWxsb3cgYXV0byBpbXBvcnQgYW5kIHJlZ2lzdGVyIGNvbXBvbmVudHMgdXNlZCBpbiBtYXJrZG93blxuICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvY29tcG9uZW50cy5kLnRzJyxcbiAgICAgICAgZGlyczogW1xuICAgICAgICAgICdzcmMvY29tcG9uZW50cycsXG4gICAgICAgICAgJy4uL3NoYXJlZC9jb21wb25lbnRzJyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb2x2ZXJzOiBbUXVhc2FyUmVzb2x2ZXIoKV0sXG4gICAgICB9KSxcblxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3Vub2Nzc1xuICAgICAgLy8gc2VlIHVuby5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgICAgVW5vY3NzKCksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZWF0LWFnZW5jeS92aXRlLXBsdWdpbi13ZWJmb250LWRsXG4gICAgICBXZWJmb250RG93bmxvYWQoKSxcblxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYmZhbnNwbHovdml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXG4gICAgICBWdWVEZXZUb29scygpLFxuICAgIF0sXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1zc2dcbiAgICBzc2dPcHRpb25zOiB7XG4gICAgICBzY3JpcHQ6ICdhc3luYycsXG4gICAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcbiAgICAgIGNyaXR0ZXJzT3B0aW9uczoge1xuICAgICAgICByZWR1Y2VJbmxpbmVTdHlsZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIG9uRmluaXNoZWQoKSB7XG4gICAgICAgIGNvbnN0IGZsYWcgPSBwcm9jZXNzLmVudi5WSVRFX1NJVEVNQVAgPz8gZmFsc2VcbiAgICAgICAgY29uc3QgdHJ1bHkgPSBbdHJ1ZSwgJ3RydWUnLCAneWVzJywgJzEnLCAnVFJVRScsICdZRVMnLCAnVHJ1ZScsICdZZXMnXVxuICAgICAgICBpZiAodHJ1bHkuaW5jbHVkZXMoZmxhZykpXG4gICAgICAgICAgZ2VuZXJhdGVTaXRlbWFwKClcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHNzcjoge1xuICAgICAgLy8gVE9ETzogd29ya2Fyb3VuZCB1bnRpbCB0aGV5IHN1cHBvcnQgbmF0aXZlIEVTTVxuICAgICAgbm9FeHRlcm5hbDogWyd3b3JrYm94LXdpbmRvdycsICdsb2Rhc2gnLCAnanNlbmNyeXB0JywgJ3F1YXNhcicsICdtZC1lZGl0b3ItdjMnXSxcbiAgICB9LFxuICB9KVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUixPQUFPLFVBQVU7QUFDcFMsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sYUFBYTtBQUNwQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGVBQWU7QUFDdEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxzQkFBc0I7QUFiL0IsSUFBTSxtQ0FBbUM7QUFlekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFX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
