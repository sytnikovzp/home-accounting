module.exports = {
  CONFIRMATION: (URL, fullName, confirmationLink) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #F9F9F9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #DDD;">
    <h1 style="color: #007BFF; text-align: center;">Вітаємо на ${URL}!</h1>
    <p style="font-size: 16px; text-align: justify; text-indent: 2em;">Шановний(-а), ${fullName}! Дякуємо, що приєдналися до нас. Для завершення реєстрації, будь ласка, підтвердіть Вашу електронну адресу, натиснувши на кнопку нижче:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${confirmationLink}" style="background-color: #2E7D32; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Підтвердити email</a>
    </div>
    <p style="font-size: 14px; color: #666;">Якщо кнопка не працює, скопіюйте та вставте це посилання у Ваш браузер:</p>
    <p style="font-size: 14px; word-break: break-word;"><a href="${confirmationLink}" style="color: #007BFF;">${confirmationLink}</a></p>
    <p style="font-size: 14px; color: #666;">Це посилання буде дійсним протягом 24 годин.</p>
    <p style="font-size: 14px; color: #666;">Якщо Ви не реєструвалися на нашому сайті, просто ігноруйте це повідомлення.</p>
    <p style="font-size: 14px; text-align: center; color: #999;">З найкращими побажаннями,<br>Команда ${URL}</p>
  </div>
`,

  EMAIL_CHANGE_CONFIRMATION: (URL, fullName, confirmationLink) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #F9F9F9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #DDD;">
    <h1 style="color: #007BFF; text-align: center;">Підтвердіть зміну email-адреси</h1>
    <p style="font-size: 16px; text-align: justify; text-indent: 2em;">Шановний(-а), ${fullName}! Ви змінили Вашу електронну адресу на ${URL}. Щоб підтвердити нову електронну адресу, будь ласка, натисніть на кнопку нижче:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${confirmationLink}" style="background-color: #2E7D32; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Підтвердити новий email</a>
    </div>
    <p style="font-size: 14px; color: #666;">Якщо кнопка не працює, скопіюйте та вставте це посилання у Ваш браузер:</p>
    <p style="font-size: 14px; word-break: break-word;"><a href="${confirmationLink}" style="color: #007BFF;">${confirmationLink}</a></p>
    <p style="font-size: 14px; color: #666;">Це посилання буде дійсним протягом 24 годин.</p>
    <p style="font-size: 14px; color: #666;">Якщо Ви не змінювали електронну адресу, просто ігноруйте це повідомлення.</p>
    <p style="font-size: 14px; text-align: center; color: #999;">З найкращими побажаннями,<br>Команда ${URL}</p>
  </div>
`,

  RESET_PASSWORD: (URL, fullName, resetPasswordLink) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #F9F9F9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #DDD;">
    <h1 style="color: #007BFF; text-align: center;">Підтвердіть відновлення паролю</h1>
    <p style="font-size: 16px; text-align: justify; text-indent: 2em;">Шановний(-а), ${fullName}! Ви запросили відновлення паролю для Вашого облікового запису на ${URL}. Для відновлення паролю, будь ласка, натисніть на кнопку нижче:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetPasswordLink}" style="background-color: #2E7D32; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Відновити пароль</a>
    </div>
    <p style="font-size: 14px; color: #666;">Якщо кнопка не працює, скопіюйте та вставте це посилання у Ваш браузер:</p>
    <p style="font-size: 14px; word-break: break-word;"><a href="${resetPasswordLink}" style="color: #007BFF;">${resetPasswordLink}</a></p>
    <p style="font-size: 14px; color: #666;">Це посилання буде дійсним протягом 1 години.</p>
    <p style="font-size: 14px; color: #666;">Якщо Ви не запитували відновлення паролю, просто ігноруйте це повідомлення.</p>
    <p style="font-size: 14px; text-align: center; color: #999;">З найкращими побажаннями,<br>Команда ${URL}</p>
  </div>
`,
};
