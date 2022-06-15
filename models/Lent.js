module.exports = (sequelize, DataTypes) => {
    const Lent =  sequelize.define('Lent', {
        amount: {
          type: DataTypes.BIGINT(12),
          allowNull: false,
        },
        amount_repayed: {
          type: DataTypes.BIGINT(12),
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        date: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        repay_date: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue : false
        },
    })
  
    
    Lent.associate = function(models) {
        Lent.belongsTo(models.Spendings, { foreignKey: 'spending_id' }),
        Lent.belongsTo(models.User, { foreignKey: 'user_id' });
      };
  
    return Lent
  }