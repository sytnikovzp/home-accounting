const nodemailer = require('nodemailer');

const {
  API_CONFIG: { CLIENT_URL },
  SMTP_CONFIG: { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD },
} = require('../constants');
const {
  EMAIL_TEMPLATES: { CONFIRMATION, EMAIL_CHANGE_CONFIRMATION, RESET_PASSWORD },
} = require('../constants');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  async sendMail(email, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: SMTP_USER,
        to: email,
        subject,
        text: '',
        html,
      });
      const { response, envelope, messageId } = info;
      console.info('Sent email: ', { response, envelope, messageId });
      return info;
    } catch (error) {
      console.error(`Failed to send email to ${email}: `, error);
      throw error;
    }
  }

  async sendConfirmationMail(fullName, email, confirmationLink) {
    const subject = `Підтвердження акаунту на ${CLIENT_URL}`;
    const html = CONFIRMATION(CLIENT_URL, fullName, confirmationLink);
    await this.sendMail(email, subject, html);
  }

  async sendEmailChangeConfirmationMail(fullName, email, confirmationLink) {
    const subject = `Підтвердження зміни email-адреси на ${CLIENT_URL}`;
    const html = EMAIL_CHANGE_CONFIRMATION(
      CLIENT_URL,
      fullName,
      confirmationLink
    );
    await this.sendMail(email, subject, html);
  }

  async sendResetPasswordMail(fullName, email, resetPasswordLink) {
    const subject = `Відновлення паролю на ${CLIENT_URL}`;
    const html = RESET_PASSWORD(CLIENT_URL, fullName, resetPasswordLink);
    await this.sendMail(email, subject, html);
  }
}

module.exports = new MailService();
