module.exports = (sequelize, DataTypes) => {
    const Borrowed =  sequelize.define('Borrowed', {
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
  
    
    Borrowed.associate = function(models) {
        // Coffee belongsTo Shop
        Borrowed.belongsTo(models.Spendings, { foreignKey: 'spending_id' }),
        Borrowed.belongsTo(models.User, { foreignKey: 'user_id' });
      };
  
    return Borrowed
  }