module.exports = (sequelize, DataTypes) => {
    const Breakdown =  sequelize.define('Breakdown', {
        // spendings_id: {
        //   type: DataTypes.INTEGER.UNSIGNED,
        //   allowNull: false,
        // },
        price: {
          type: DataTypes.BIGINT(12),
          allowNull: false,
        },
        item: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.BIGINT(12),
            allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
    })
  
    
    Breakdown.associate = function(models) {
        Breakdown.belongsTo(models.Spendings, { foreignKey: 'spending_id' });
    };
  
    return Breakdown
  }