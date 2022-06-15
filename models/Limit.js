module.exports = (sequelize, DataTypes) => {
    const Limit =  sequelize.define('Limit', {
        amount: {
          type: DataTypes.BIGINT(12),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        from: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        to: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue : false
        },
    })
  
    
    Limit.associate = function(models) {
        Limit.belongsTo(models.User, { foreignKey: 'user_id' });
      };
  
    return Limit
  }