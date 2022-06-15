module.exports = (sequelize, DataTypes) => {
  const User =  sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
  })

  
    User.associate = function(models) {
      User.hasMany(models.Spendings),
      User.hasMany(models.Limit),
      User.hasMany(models.Borrowed),
      User.hasMany(models.Lent);
    };

  return User
}