'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sales", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      totalPrice: {
        type: Sequelize.DECIMAL(9, 2),
        field: "total_price",
        allowNull: false,
      },
      deliveryAddress: {
        type: Sequelize.STRING,
        field: "delivery_address",
        allowNull: false,
      },
      deliveryNumber: {
        type: Sequelize.STRING,
        field: "delivery_number",
        allowNull: false,
      },
      saleDate: {
        type: Sequelize.STRING,
        field: "sale_date",
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pendente'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "user_id",
      },
      sellerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        field: "seller_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales');
  }
};
