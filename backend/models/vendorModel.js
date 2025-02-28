// const { DataTypes } = require("sequelize");
// const { sequelize } = require("./userModel");

// const Vendor = sequelize.define("Vendor", {
//   id: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   name: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   },
//   invite_code: {
//     type: DataTypes.STRING(50),
//     allowNull: true // ✅ Nullable FK
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   timestamps: true, // ✅ Automatically adds createdAt & updatedAt
//   tableName: "vendors"
// });


// module.exports = { Vendor }
