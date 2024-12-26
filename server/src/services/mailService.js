const nodemailer = require('nodemailer');
// ==============================================================
const {
  configs: {
    CLIENT: { URL },
    SMTP: { HOST, PORT, USER, PASSWORD },
  },
} = require('../constants');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: {
        user: USER,
        pass: PASSWORD,
      },
    });
  }

  async sendVerificationMail(email, verificationLink) {
    try {
      await this.transporter.sendMail({
        from: USER,
        to: email,
        subject: `Верифікація акаунту на ${URL}`,
        text: '',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
            <h1 style="color: #007BFF; text-align: center;">Вітаємо на ${URL}!</h1>
            <p style="font-size: 16px; text-align: justify;">Дякуємо, що приєдналися до нас. Для завершення реєстрації та веріфікації Вашого облікового запису, будь ласка, підтвердіть Вашу електронну адресу, натиснувши на кнопку нижче:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="background-color: #007BFF; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Підтвердити Email</a>
            </div>
            <p style="font-size: 14px; color: #666;">Якщо кнопка не працює, скопіюйте та вставте це посилання у Ваш браузер:</p>
            <p style="font-size: 14px; word-break: break-word;"><a href="${verificationLink}" style="color: #007BFF;">${verificationLink}</a></p>
            <p style="font-size: 14px; color: #666;">Якщо Ви не реєструвалися на нашому сайті, просто ігноруйте це повідомлення.</p>
            <p style="font-size: 14px; text-align: center; color: #999;">З найкращими побажаннями,<br>Команда ${URL}</p>
          </div>
        `,
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }

  async sendEmailChangeVerification(email, newVerificationLink) {
    try {
      await this.transporter.sendMail({
        from: USER,
        to: email,
        subject: `Підтвердження зміни email-адреси на ${URL}`,
        text: '',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
          <h1 style="color: #007BFF; text-align: center;">Підтвердіть зміну email-адреси</h1>
          <p style="font-size: 16px; text-align: justify;">Ви змінили Вашу електронну адресу на ${URL}. Щоб підтвердити нову електронну адресу, будь ласка, натисніть на кнопку нижче:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${newVerificationLink}" style="background-color: #007BFF; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Підтвердити новий Email</a>
          </div>
          <p style="font-size: 14px; color: #666;">Якщо кнопка не працює, скопіюйте та вставте це посилання у Ваш браузер:</p>
          <p style="font-size: 14px; word-break: break-word;"><a href="${newVerificationLink}" style="color: #007BFF;">${newVerificationLink}</a></p>
          <p style="font-size: 14px; color: #666;">Якщо Ви не змінювали електронну адресу, просто ігноруйте це повідомлення.</p>
          <p style="font-size: 14px; text-align: center; color: #999;">З найкращими побажаннями,<br>Команда ${URL}</p>
        </div>
      `,
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email, resetPasswordLink) {
    try {
      await this.transporter.sendMail({
        from: USER,
        to: email,
        subject: `Скидання паролю на ${URL}`,
        text: '',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
            <h1 style="color: #007BFF; text-align: center;">Підтвердіть cкидання паролю</h1>
            <p style="font-size: 16px; text-align: justify;">Ви запросили скидання паролю для Вашого облікового запису на ${URL}. Для скидання паролю, будь ласка, натисніть на кнопку нижче:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetPasswordLink}" style="background-color: #007BFF; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Скинути пароль</a>
            </div>
            <p style="font-size: 14px; color: #666;">Якщо кнопка не працює, скопіюйте та вставте це посилання у Ваш браузер:</p>
            <p style="font-size: 14px; word-break: break-word;"><a href="${resetPasswordLink}" style="color: #007BFF;">${resetPasswordLink}</a></p>
            <p style="font-size: 14px; color: #666;">Якщо Ви не запитували скидання паролю, просто ігноруйте це повідомлення.</p>
            <p style="font-size: 14px; text-align: center; color: #999;">З найкращими побажаннями,<br>Команда ${URL}</p>
          </div>
        `,
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}

module.exports = new MailService();
