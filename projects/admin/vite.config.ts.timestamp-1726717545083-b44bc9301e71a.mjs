// vite.config.ts
import path from "node:path";
import process from "node:process";
import { QuasarResolver } from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.38/node_modules/unplugin-vue-components/dist/resolvers.js";
import Unocss from "file:///D:/demo/blogs/node_modules/.pnpm/unocss@0.53.6_postcss@8.4.43_vite@4.5.3/node_modules/unocss/dist/vite.mjs";
import Vue from "file:///D:/demo/blogs/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.3_vue@3.4.38/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-pages@0.31.0_vite@4.5.3/node_modules/vite-plugin-pages/dist/index.mjs";
import { defineConfig, loadEnv } from "file:///D:/demo/blogs/node_modules/.pnpm/vite@4.5.3_@types+node@18.19.48_sass@1.77.8/node_modules/vite/dist/node/index.js";
import Layouts from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-vue-layouts@0.8.0_vite@4.5.3_vue-router@4.4.3_vue@3.4.38/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import generateSitemap from "file:///D:/demo/blogs/node_modules/.pnpm/vite-ssg-sitemap@0.5.1/node_modules/vite-ssg-sitemap/dist/index.js";
import VueMacros from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-vue-macros@2.11.6_@vueuse+core@10.11.1_esbuild@0.23.1_typescript@5.5.4_vite@4.5.3_vue-tsc@1.8.27_vue@3.4.38/node_modules/unplugin-vue-macros/dist/vite.mjs";
import AutoImport from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1/node_modules/unplugin-auto-import/dist/vite.js";
import VueDevTools from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-vue-devtools@0.5.1_@types+node@18.19.48_axios@1.7.7_nprogress@0.2.0_pug@3.0.3_vite@4.5.3_vue@3.4.38/node_modules/vite-plugin-vue-devtools/dist/index.mjs";
import WebfontDownload from "file:///D:/demo/blogs/node_modules/.pnpm/vite-plugin-webfont-dl@3.9.5_vite@4.5.3/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import Components from "file:///D:/demo/blogs/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.38/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_dirname = "D:\\demo\\blogs\\projects\\admin";
var vite_config_default = ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, path.relative(__vite_injected_original_dirname, "../shared")),
    VITE_MODE: mode
  };
  return defineConfig({
    base: process.env.VITE_ADMIN_BASE || "/",
    define: {
      "process.env": {}
    },
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(process.env.VITE_ADMIN_PORT || "3333"),
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
          "src/utils/**",
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
      noExternal: ["workbox-window", "lodash", "jsencrypt", "quasar", "@vavt/v3-extension"]
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZW1vXFxcXGJsb2dzXFxcXHByb2plY3RzXFxcXGFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxkZW1vXFxcXGJsb2dzXFxcXHByb2plY3RzXFxcXGFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9kZW1vL2Jsb2dzL3Byb2plY3RzL2FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXHJcbmltcG9ydCB7IFF1YXNhclJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcclxuaW1wb3J0IGdlbmVyYXRlU2l0ZW1hcCBmcm9tICd2aXRlLXNzZy1zaXRlbWFwJ1xyXG5pbXBvcnQgVnVlTWFjcm9zIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYWNyb3Mvdml0ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IFdlYmZvbnREb3dubG9hZCBmcm9tICd2aXRlLXBsdWdpbi13ZWJmb250LWRsJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBhbnkpID0+IHtcclxuICBwcm9jZXNzLmVudiA9IHtcclxuICAgIC4uLnByb2Nlc3MuZW52LFxyXG4gICAgLi4ubG9hZEVudihtb2RlLCBwYXRoLnJlbGF0aXZlKF9fZGlybmFtZSwgJy4uL3NoYXJlZCcpKSxcclxuICAgIFZJVEVfTU9ERTogbW9kZSxcclxuICB9XHJcblxyXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogcHJvY2Vzcy5lbnYuVklURV9BRE1JTl9CQVNFIHx8ICcvJyxcclxuICAgIGRlZmluZToge1xyXG4gICAgICAncHJvY2Vzcy5lbnYnOiB7fSxcclxuICAgIH0sXHJcblxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgICAgcG9ydDogTnVtYmVyLnBhcnNlSW50KHByb2Nlc3MuZW52LlZJVEVfQURNSU5fUE9SVCB8fCAnMzMzMycpLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIFtwcm9jZXNzLmVudi5WSVRFX0FQSV9CQVNFIGFzIHN0cmluZ106IHtcclxuICAgICAgICAgIHRhcmdldDogcHJvY2Vzcy5lbnYuVklURV9QUk9YWV9UQVJHRVQsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtwcm9jZXNzLmVudi5WSVRFX0FQSV9CQVNFfWApLCAnJyksXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnfi8nOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2AsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgVnVlTWFjcm9zKHtcclxuICAgICAgICBwbHVnaW5zOiB7XHJcbiAgICAgICAgICB2dWU6IFZ1ZSh7XHJcbiAgICAgICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC5tZCQvXSxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hhbm5vZXJ1L3ZpdGUtcGx1Z2luLXBhZ2VzXHJcbiAgICAgIFBhZ2VzKHtcclxuICAgICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Kb2huQ2FtcGlvbkpyL3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXHJcbiAgICAgIExheW91dHMoKSxcclxuXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgICAndnVlJyxcclxuICAgICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAgICdAdnVldXNlL2hlYWQnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgICAncXVhc2FyJyxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgICAgZGlyczogW1xyXG4gICAgICAgICAgJ3NyYy9jb21wb3NhYmxlcycsXHJcbiAgICAgICAgICAnc3JjL2NvbnN0YW50cycsXHJcbiAgICAgICAgICAnc3JjL3V0aWxzLyoqJyxcclxuICAgICAgICAgICcuLi9zaGFyZWQvYXBpJyxcclxuICAgICAgICAgICcuLi9zaGFyZWQvY29tcG9zYWJsZXMnLFxyXG4gICAgICAgICAgJy4uL3NoYXJlZC9jb25zdGFudHMnLFxyXG4gICAgICAgICAgJy4uL3NoYXJlZC91dGlscy8qKicsXHJcbiAgICAgICAgXSxcclxuICAgICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgICAgICByZXNvbHZlcnM6IFtRdWFzYXJSZXNvbHZlcigpXSxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgLy8gYWxsb3cgYXV0byBsb2FkIG1hcmtkb3duIGNvbXBvbmVudHMgdW5kZXIgYC4vc3JjL2NvbXBvbmVudHMvYFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXHJcbiAgICAgICAgLy8gYWxsb3cgYXV0byBpbXBvcnQgYW5kIHJlZ2lzdGVyIGNvbXBvbmVudHMgdXNlZCBpbiBtYXJrZG93blxyXG4gICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgICAgZHRzOiAnc3JjL3R5cGVzL2NvbXBvbmVudHMuZC50cycsXHJcbiAgICAgICAgZGlyczogW1xyXG4gICAgICAgICAgJ3NyYy9jb21wb25lbnRzJyxcclxuICAgICAgICAgICcuLi9zaGFyZWQvY29tcG9uZW50cycsXHJcbiAgICAgICAgXSxcclxuICAgICAgICByZXNvbHZlcnM6IFtRdWFzYXJSZXNvbHZlcigpXSxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXHJcbiAgICAgIC8vIHNlZSB1bm8uY29uZmlnLnRzIGZvciBjb25maWdcclxuICAgICAgVW5vY3NzKCksXHJcblxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmVhdC1hZ2VuY3kvdml0ZS1wbHVnaW4td2ViZm9udC1kbFxyXG4gICAgICBXZWJmb250RG93bmxvYWQoKSxcclxuXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJmYW5zcGx6L3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1xyXG4gICAgICBWdWVEZXZUb29scygpLFxyXG4gICAgXSxcclxuXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1zc2dcclxuICAgIHNzZ09wdGlvbnM6IHtcclxuICAgICAgc2NyaXB0OiAnYXN5bmMnLFxyXG4gICAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcclxuICAgICAgY3JpdHRlcnNPcHRpb25zOiB7XHJcbiAgICAgICAgcmVkdWNlSW5saW5lU3R5bGVzOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgb25GaW5pc2hlZCgpIHtcclxuICAgICAgICBjb25zdCBmbGFnID0gcHJvY2Vzcy5lbnYuVklURV9TSVRFTUFQID8/IGZhbHNlXHJcbiAgICAgICAgY29uc3QgdHJ1bHkgPSBbdHJ1ZSwgJ3RydWUnLCAneWVzJywgJzEnLCAnVFJVRScsICdZRVMnLCAnVHJ1ZScsICdZZXMnXVxyXG4gICAgICAgIGlmICh0cnVseS5pbmNsdWRlcyhmbGFnKSlcclxuICAgICAgICAgIGdlbmVyYXRlU2l0ZW1hcCgpXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIHNzcjoge1xyXG4gICAgICAvLyBUT0RPOiB3b3JrYXJvdW5kIHVudGlsIHRoZXkgc3VwcG9ydCBuYXRpdmUgRVNNXHJcbiAgICAgIG5vRXh0ZXJuYWw6IFsnd29ya2JveC13aW5kb3cnLCAnbG9kYXNoJywgJ2pzZW5jcnlwdCcsICdxdWFzYXInLCAnQHZhdnQvdjMtZXh0ZW5zaW9uJ10sXHJcbiAgICB9LFxyXG4gIH0pXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUixPQUFPLFVBQVU7QUFDalMsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsc0JBQXNCO0FBQy9CLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sYUFBYTtBQUNwQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGVBQWU7QUFDdEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxnQkFBZ0I7QUFidkIsSUFBTSxtQ0FBbUM7QUFlekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFXO0FBQ2hDLFVBQVEsTUFBTTtBQUFBLElBQ1osR0FBRyxRQUFRO0FBQUEsSUFDWCxHQUFHLFFBQVEsTUFBTSxLQUFLLFNBQVMsa0NBQVcsV0FBVyxDQUFDO0FBQUEsSUFDdEQsV0FBVztBQUFBLEVBQ2I7QUFFQSxTQUFPLGFBQWE7QUFBQSxJQUNsQixNQUFNLFFBQVEsSUFBSSxtQkFBbUI7QUFBQSxJQUNyQyxRQUFRO0FBQUEsTUFDTixlQUFlLENBQUM7QUFBQSxJQUNsQjtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTSxPQUFPLFNBQVMsUUFBUSxJQUFJLG1CQUFtQixNQUFNO0FBQUEsTUFDM0QsT0FBTztBQUFBLFFBQ0wsQ0FBQyxRQUFRLElBQUksYUFBdUIsR0FBRztBQUFBLFVBQ3JDLFFBQVEsUUFBUSxJQUFJO0FBQUEsVUFDcEIsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFBQSxVQUFRQSxNQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksUUFBUSxJQUFJLGFBQWEsRUFBRSxHQUFHLEVBQUU7QUFBQSxVQUM3RSxRQUFRO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxNQUFNLEdBQUcsS0FBSyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLE1BQ3pDO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsVUFBVTtBQUFBLFFBQ1IsU0FBUztBQUFBLFVBQ1AsS0FBSyxJQUFJO0FBQUEsWUFDUCxTQUFTLENBQUMsVUFBVSxPQUFPO0FBQUEsVUFDN0IsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGLENBQUM7QUFBQTtBQUFBLE1BR0QsTUFBTTtBQUFBLFFBQ0osWUFBWSxDQUFDLE9BQU8sSUFBSTtBQUFBLE1BQzFCLENBQUM7QUFBQTtBQUFBLE1BR0QsUUFBUTtBQUFBO0FBQUEsTUFHUixXQUFXO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsUUFDQSxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsVUFDSjtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGFBQWE7QUFBQSxRQUNiLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFBQSxNQUM5QixDQUFDO0FBQUE7QUFBQSxNQUdELFdBQVc7QUFBQTtBQUFBLFFBRVQsWUFBWSxDQUFDLE9BQU8sSUFBSTtBQUFBO0FBQUEsUUFFeEIsU0FBUyxDQUFDLFVBQVUsY0FBYyxPQUFPO0FBQUEsUUFDekMsS0FBSztBQUFBLFFBQ0wsTUFBTTtBQUFBLFVBQ0o7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUFBLFFBQ0EsV0FBVyxDQUFDLGVBQWUsQ0FBQztBQUFBLE1BQzlCLENBQUM7QUFBQTtBQUFBO0FBQUEsTUFJRCxPQUFPO0FBQUE7QUFBQSxNQUdQLGdCQUFnQjtBQUFBO0FBQUEsTUFHaEIsWUFBWTtBQUFBLElBQ2Q7QUFBQTtBQUFBLElBR0EsWUFBWTtBQUFBLE1BQ1YsUUFBUTtBQUFBLE1BQ1IsWUFBWTtBQUFBLE1BQ1osaUJBQWlCO0FBQUEsUUFDZixvQkFBb0I7QUFBQSxNQUN0QjtBQUFBLE1BQ0EsYUFBYTtBQUNYLGNBQU0sT0FBTyxRQUFRLElBQUksZ0JBQWdCO0FBQ3pDLGNBQU0sUUFBUSxDQUFDLE1BQU0sUUFBUSxPQUFPLEtBQUssUUFBUSxPQUFPLFFBQVEsS0FBSztBQUNyRSxZQUFJLE1BQU0sU0FBUyxJQUFJO0FBQ3JCLDBCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsSUFDRjtBQUFBLElBRUEsS0FBSztBQUFBO0FBQUEsTUFFSCxZQUFZLENBQUMsa0JBQWtCLFVBQVUsYUFBYSxVQUFVLG9CQUFvQjtBQUFBLElBQ3RGO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
