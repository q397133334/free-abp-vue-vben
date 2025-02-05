import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/.well-known': {
            bypass(req, res, options) {
              console.log(options);
              console.log(req);
              console.log(res);
              // const proxyURL = options.target + options.rewrite(req.url);
              // console.log('proxyURL', proxyURL);
              // req.headers['x-req-proxyURL'] = proxyURL; // 设置未生效
              // res.setHeader('x-req-proxyURL', proxyURL); // 设置响应头可以看到
            },
            changeOrigin: true,
            secure: false,
            // rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://abp.xiaoyou.run',
            ws: true,
          },
          '/api': {
            bypass(req, res, options) {
              console.log('/api');
              const proxyURL = options.target + options.rewrite(req.url);
              console.log('proxyURL', proxyURL);
              req.headers['x-req-proxyURL'] = proxyURL; // 设置未生效
              res.setHeader('x-req-proxyURL', proxyURL); // 设置响应头可以看到
            },
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '/api/'),
            secure: false,
            // mock代理目标地址
            target: 'http://abp.xiaoyou.run',
            ws: true,
          },
          '/connect': {
            bypass(req, res, options) {
              const proxyURL = options.target + options.rewrite(req.url);
              console.log('proxyURL', proxyURL);
              req.headers['x-req-proxyURL'] = proxyURL; // 设置未生效
              res.setHeader('x-req-proxyURL', proxyURL); // 设置响应头可以看到
            },
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            secure: false,
            // mock代理目标地址
            target: 'http://abp.xiaoyou.run',
            ws: true,
          },
        },
      },
    },
  };
});
