module.exports = {
  apps: [
    {
      name: "rohanrice-api",
      script: "./server.js",
      cwd: "/home/your-username/rohanrice-marketplace/server",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      },
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "/log/rohanrice-api.err.log",
      out_file: "/log/rohanrice-api.out.log",
      log_file: "/log/rohanrice-api.log",
      time: true,
      max_restarts: 10,
      min_uptime: "10s",
      listen_timeout: 3000,
      kill_timeout: 5000,
      wait_ready: true,
      shutdown_with_message: true,
      instance_var: "INSTANCE_ID",
      ignore_watch: [
        "node_modules",
        "logs",
        ".env.local"
      ],
      env_production: {
        NODE_ENV: "production",
        PORT: 5000
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 5000
      }
    },
    {
      name: "rohanrice-web",
      script: "npm",
      args: "run start",
      cwd: "/home/your-username/rohanrice-marketplace",
      instances: "max",
      exec_mode: "cluster",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "/log/rohanrice-web.err.log",
      out_file: "/log/rohanrice-web.out.log",
      log_file: "/log/rohanrice-web.log",
      time: true,
      max_restarts: 10,
      min_uptime: "10s",
      listen_timeout: 3000,
      kill_timeout: 5000,
      wait_ready: true,
      ignore_watch: [
        "node_modules",
        ".next",
        "logs"
      ],
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000
      }
    }
  ],
  
  monitor_interval: 5000,
  
  deploy: {
    production: {
      user: "your-username",
      host: "your-hosting-ip",
      ref: "origin/main",
      repo: "https://github.com/your-username/rohanrice-marketplace.git",
      path: "/home/your-username/rohanrice-marketplace",
      "post-deploy": "npm install && npm run build && pm2 reload all"
    }
  }
};
