const path = require('path')

module.exports = {
    port: process.env.PORT || 5000,
    db : {
        database: process.env.DB_NAME || 'planner',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        options: {
            dialect : process.env.DIALECT || 'mysql',
            host : process.env.HOST || 'localhost',
            define: {
              timestamps: true,
              underscored: true,
              createdAt: "created_at",
              updatedAt: "updated_at"
            },
            pool: {
              max: 5,
              min: 0,
              acquire: 30000,
              idle: 10000
            }
        }
    },
    authentication : {
        jwtSecret : process.env.JWT_SECRET || 'AAAAB3NzaC1yc2EAAAADAQABAAABAQDYuuD09CbQ+LrqxVp8M62cnfE5gogIO/MomlQu8PIK6RL0BG3dsUSSgcEXJKmOvMHwWEUv3FTIr+5pMIX+E5wNIAnVfNeMl6FdPA3l6eH9M/AA3Oy2hO+iXzd03vQ/lmQmxHCFYiw6QqGZBA8Qw7lOHNC1pnj4FwnqUER7AVK5XE1qd8Lo9gYFuO6H+sOk6762DfmakkFx3OztuN6zlbjiOkyJw48vIC3mAp'
    }
}