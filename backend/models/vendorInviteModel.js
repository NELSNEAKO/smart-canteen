

const mongoose = require('mongoose');






const VendorInviteCode = sequelize.define("VendorInviteCode", {
  code: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM("unused", "used"),
    defaultValue: "unused"
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true, // ✅ Automatically adds createdAt & updatedAt
  tableName: "vendor_invite_codes"
});

module.exports = { VendorInviteCode }
