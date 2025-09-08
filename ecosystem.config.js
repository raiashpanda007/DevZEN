module.exports = {
  apps: [
    {
      name: "devzen-web",
      cwd: "./apps/web",
      script: "npm",
      args: "start",
      interpreter: "/home/ubuntu/.nvm/versions/node/v22.12.0/bin/node",
    },
    {
      name: "devzen-server",
      cwd: "./apps/Server",
      script: "npm",
      args: "start",
      interpreter: "/home/ubuntu/.nvm/versions/node/v22.12.0/bin/node",
    },
    {
      name: "devzen-cleaner",
      cwd: "./apps/Jobs",
      script: "npm",
      args: "start",
      interpreter: "/home/ubuntu/.nvm/versions/node/v22.12.0/bin/node",
    },

  ],
};
