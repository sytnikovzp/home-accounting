/* eslint-disable camelcase */
const { getUserIdByEmail } = require('../utils/sharedFunctions');

async function postgresData() {
  const moderatorId = await getUserIdByEmail('oleksandra.ivanchuk@gmail.com');
  const userId = await getUserIdByEmail('hanna.shevchenko@gmail.com');
  return {
    categories: [
      {
        title: 'Одяг',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Взуття',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Їжа',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Напої',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Пристрої',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Електроніка',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Обчислювальна техніка',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Побутові пристрої',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Побутова хімія',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Побутова електроніка',
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Транспорт',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Іграшки',
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Книги',
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Медицина',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Послуги',
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
        title: 'UAH',
        description: 'Українська гривня',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'USD',
        description: 'Долар США',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'EUR',
        description: 'Євро',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'GBP',
        description: 'Фунт стерлінгів',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TRY',
        description: 'Турецька ліра',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AUD',
        description: 'Австралійський долар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'CAD',
        description: 'Канадський долар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'CNY',
        description: 'Юань Женьміньбі',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'CZK',
        description: 'Чеська крона',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'DKK',
        description: 'Данська крона',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'HKD',
        description: 'Гонконгівський долар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'HUF',
        description: 'Форинт',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'INR',
        description: 'Індійська рупія',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'IDR',
        description: 'Рупія',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'ILS',
        description: 'Новий ізраїльський шекель',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'JPY',
        description: 'Єна',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'KZT',
        description: 'Теньге',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'KRW',
        description: 'Вона',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'MXN',
        description: 'Мексиканське песо',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'MDL',
        description: 'Молдовський лей',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'NZD',
        description: 'Новозеландський долар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'NOK',
        description: 'Норвезька крона',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'RUB',
        description: 'Російський рубль',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SGD',
        description: 'Сінгапурський долар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'ZAR',
        description: 'Ренд',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SEK',
        description: 'Шведська крона',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'CHF',
        description: 'Швейцарський франк',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'EGP',
        description: 'Єгипетський фунт',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'BYN',
        description: 'Білоруський рубль',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AZN',
        description: 'Азербайджанський манат',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'RON',
        description: 'Румунський лей',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'XDR',
        description: 'СПЗ (спеціальні права запозичення)',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'BGN',
        description: 'Болгарський лев',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'PLN',
        description: 'Злотий',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'DZD',
        description: 'Алжирський динар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'BDT',
        description: 'Така',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AMD',
        description: 'Вірменський драм',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'DOP',
        description: 'Домініканське песо',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'IRR',
        description: 'Іранський ріал',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'IQD',
        description: 'Іракський динар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'KGS',
        description: 'Сом',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'LBP',
        description: 'Ліванський фунт',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'LYD',
        description: 'Лівійський динар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'MYR',
        description: 'Малайзійський ринггіт',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'MAD',
        description: 'Марокканський дирхам',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'PKR',
        description: 'Пакистанська рупія',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SAR',
        description: 'Саудівський ріял',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'VND',
        description: 'Донг',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'THB',
        description: 'Бат',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AED',
        description: 'Дирхам ОАЕ',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TND',
        description: 'Туніський динар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'UZS',
        description: 'Узбецький сум',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TWD',
        description: 'Новий тайванський долар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TMT',
        description: 'Туркменський новий манат',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'RSD',
        description: 'Сербський динар',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TJS',
        description: 'Сомоні',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'GEL',
        description: 'Ларі',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'BRL',
        description: 'Бразильський реал',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    measures: [
      {
        title: 'кг',
        description: 'кілограм',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'г',
        description: 'грам',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'л',
        description: 'літр',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'мл',
        description: 'мілілітр',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'м',
        description: 'метр',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'мм',
        description: 'міліметр',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'см',
        description: 'сантиметр',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'дюйм',
        description: 'дюйм',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'фут',
        description: 'фут',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'м2',
        description: 'квадратний метр',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'шт',
        description: 'одиниця',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'пляшка',
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'коробка',
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    shops: [
      {
        title: 'АТБ',
        url: 'https://www.atbmarket.com/',
        logo: '1730713465136-atb.png',
        description: 'Один із найбільших продуктових магазинів в Україні',
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
        logo: '1727810661678-comfy.png',
        description: 'Один із найпопулярніших магазинів техніки в Україні',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Епіцентр',
        url: 'https://epicentrk.ua/',
        logo: '1727810677398-Epicentr.png',
        description: 'Найвідоміший будівельний магазин в Україні',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Rozetka',
        url: 'https://rozetka.com.ua/',
        logo: null,
        description:
          'Найбільший інтернет-магазин в Україні для електроніки та побутових товарів',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Сільпо',
        url: 'https://silpo.ua/',
        logo: null,
        description:
          'Популярна мережа супермаркетів в Україні, що пропонує широкий вибір продуктів та товарів',
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Фокстрот',
        url: 'https://foxtrot.ua/',
        logo: null,
        description:
          'Провідний ритейлер електроніки та побутової техніки в Україні',
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Метро',
        url: 'https://www.metro.ua/',
        logo: null,
        description:
          'Міжнародний оптовий магазин з великим вибором продуктів та товарів для бізнесу',
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Алло',
        url: 'https://allo.ua/',
        logo: null,
        description:
          'Один із популярних магазинів України для електроніки, гаджетів та побутових товарів',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Varus',
        url: 'https://varus.ua/',
        logo: null,
        description:
          'Велика мережа продуктових магазинів в Україні з широким асортиментом товарів',
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Ельдорадо',
        url: 'https://eldorado.ua/',
        logo: null,
        description:
          'Добре відомий ритейлер електроніки та побутової техніки по всій Україні',
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    products: [
      {
        title: 'Футболка',
        category_id: 1,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Штани',
        category_id: 1,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Кросівки',
        category_id: 2,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Черевики',
        category_id: 2,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Яйця',
        category_id: 3,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Помідори',
        category_id: 3,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Пиво',
        category_id: 4,
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Сік',
        category_id: 4,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Мобільний телефон',
        category_id: 5,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Навушники',
        category_id: 5,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Телевізор',
        category_id: 6,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Камера',
        category_id: 6,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Ноутбук',
        category_id: 7,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SSD-диск',
        category_id: 7,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Пральна машина',
        category_id: 8,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Холодильник',
        category_id: 8,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Мило',
        category_id: 9,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Пральний порошок',
        category_id: 9,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Велосипед',
        category_id: 11,
        status: 'approved',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Пелети',
        category_id: 14,
        status: 'rejected',
        reviewed_by: moderatorId,
        reviewed_at: new Date(),
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Інтернет',
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
