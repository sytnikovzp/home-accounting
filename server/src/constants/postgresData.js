/* eslint-disable camelcase */
const { getUserIdByEmail } = require('../utils/sharedFunctions');

async function postgresData() {
  const moderatorId = await getUserIdByEmail('alex.johnson@gmail.com');
  const userId = await getUserIdByEmail('jane.smith@gmail.com');
  return {
    categories: [
      {
        title: 'Clothes',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Shoes',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Food',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Beverages',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Devices',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Electronics',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Computing',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Household devices',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Household chemicals',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Household electronics',
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Vehicle',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Toys',
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Books',
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Medicine',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Services',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    currencies: [
      {
        title: 'USD',
        description: 'USA dollar',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'GBP',
        description: 'Great Britain Pound',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'UAH',
        description: 'Ukranian hryvnia',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'EUR',
        description: 'Euro Unian',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    measures: [
      {
        title: 'kg',
        description: 'kilogramm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'gr',
        description: 'gramm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'l',
        description: 'litre',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'm',
        description: 'meter',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'mm',
        description: 'millimeter',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'bottle',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'unit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'box',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    shops: [
      {
        title: 'ATB',
        url: 'https://www.atbmarket.com/',
        description: 'One of the biggest products shop in Ukraine',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Comfy',
        url: 'https://comfy.ua/',
        description: 'One of the moust popular shop of devices in Ukraine',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Epicentr',
        url: 'https://epicentrk.ua/',
        description: 'The moust famous building shop in Ukraine',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    products: [
      {
        title: 'T-shirt',
        category_id: 1,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Pants',
        category_id: 1,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Snickers',
        category_id: 2,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Boots',
        category_id: 2,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Eggs',
        category_id: 3,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Tomato',
        category_id: 3,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Beer',
        category_id: 4,
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Juice',
        category_id: 4,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Mobile',
        category_id: 5,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Headphones',
        category_id: 5,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TV',
        category_id: 6,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Camera',
        category_id: 6,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Laptop',
        category_id: 7,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SSD',
        category_id: 7,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Washing machine',
        category_id: 8,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Fridge',
        category_id: 8,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Soap',
        category_id: 9,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Washing powder',
        category_id: 9,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Bike',
        category_id: 11,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Pellet',
        category_id: 14,
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Internet',
        category_id: 15,
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    purchases: [
      {
        product_id: 6,
        amount: 0.5,
        price: 89.5,
        summ: 44.75,
        shop_id: 1,
        measure_id: 1,
        currency_id: 3,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 13,
        amount: 1.0,
        price: 49000.0,
        summ: 49000.0,
        shop_id: 2,
        measure_id: 7,
        currency_id: 3,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 15,
        amount: 1.0,
        price: 18000.0,
        summ: 18000.0,
        shop_id: 3,
        measure_id: 7,
        currency_id: 3,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 16,
        amount: 1.0,
        price: 65000.0,
        summ: 65000.0,
        shop_id: 3,
        measure_id: 7,
        currency_id: 3,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
  };
}

module.exports = postgresData;
