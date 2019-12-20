const config = {
  apps: [
    {
      name: 'JFYJOP',
      script: 'server.js',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        COMMON_VARIABLE: 'true',
        API_SERVER_URL: '',
        PORT: 9020,
      },

      // 生产环境配置
      env_prod: {
        API_CLIENT_URL: 'https://jfyjop.jfh.com/jfyjop',
        NODE_ENV: 'production',
        EXIT_URL: 'https://www.jfh.com/exit',
        OLD_OP: 'https://yjop.jfh.com/jfnjop',
      },

      // 生产镜像环境配置
      env_demo: {
        API_CLIENT_URL: 'https://njyj.jfh.com/jfyjop',
        NODE_ENV: 'production',
        EXIT_URL: 'https://yj.jfh.com/exit',
        OLD_OP: 'https://yjopyj.jfh.com',
      },

      // 测试环境配置
      env_test: {
        API_CLIENT_URL: 'https://njtest.jfh.com/jfyjop',
        NODE_ENV: 'production',
        EXIT_URL: 'https://test.jfh.com/exit',
        OLD_OP: 'https://yjoptest.jfh.com/jfnjop',
      },

      // RC环境配置
      env_rc: {
        API_CLIENT_URL: 'https://jfyjoprc.jfh.com/jfyjop',
        NODE_ENV: 'production',
        EXIT_URL: 'https://rc.jfh.com/exit',
        OLD_OP: 'https://yjoprc.jfh.com/jfnjop',
      },

      // 演示培训环境配置
      env_train: {
        API_CLIENT_URL: 'https://njpx.jfh.com/jfyjop',
        NODE_ENV: 'production',
        EXIT_URL: 'https://px.jfh.com/exit',
        OLD_OP: 'https://yjoppx.jfh.com/jfnjop',
      },

      // 开发环境配置
      env_dev: {
        API_CLIENT_URL: 'https://njdev.jfh.com/jfyjop',
        NODE_ENV: 'development',
        EXIT_URL: 'https://dev.jfh.com/exit',
        OLD_OP: 'https://yjopdev.jfh.com/jfnjop',
      },
    },
  ],
};

let PORT = '';
for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.indexOf('-PORT') !== -1) {
    PORT = parseInt(arg.match(/PORT=(\d*)/)[1], 10);
    break;
  }
}

if (PORT) {
  config.apps[0].env.PORT = PORT;
}

module.exports = config;
