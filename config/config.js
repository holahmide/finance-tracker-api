require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    db : {
        database: process.env.DB_NAME || 'planner',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        options: {
            dialect : 'mysql',
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
        jwtSecret : process.env.JWT_SECRET || 'AAAAB3NzaC1yc2EAAAADAQABAAABAQDYuuD09CbQ+LrqxVp8M62cnfE5gogIO'
    }
}