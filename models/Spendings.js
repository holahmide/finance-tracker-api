module.exports = (sequelize, DataTypes) => {
    const Spendings =  sequelize.define('Spendings', {
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        amount: {
          type: DataTypes.BIGINT(12),
          allowNull: false,
        },
    })
  
    
    Spendings.associate = function(models) {
      Spendings.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    Spendings.associate = function(models) {
      Spendings.hasMany(models.Breakdown),
      Spendings.hasMany(models.Borrowed),
      Spendings.hasMany(models.Lent);
    };
  
    return Spendings
  }