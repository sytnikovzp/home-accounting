const nodemailer = require('nodemailer');

const {
  configs: {
    CLIENT: { URL },
    SMTP: { HOST, PORT, USER, PASSWORD },
  },
} = require('../constants');
const emailTemplates = require('../utils/emailTemplates');

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

  async sendMail(email, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: USER,
        to: email,
        subject,
        text: '',
        html,
      });
      const { response, envelope, messageId } = info;
      console.info('Sent email:', { response, envelope, messageId });
      return info;
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }

  async sendConfirmationMail(fullName, email, confirmationLink) {
    const subject = `Підтвердження акаунту на ${URL}`;
    const html = emailTemplates.confirmation(URL, fullName, confirmationLink);
    await this.sendMail(email, subject, html);
  }

  async sendEmailChangeConfirmationMail(fullName, email, confirmationLink) {
    const subject = `Підтвердження зміни email-адреси на ${URL}`;
    const html = emailTemplates.emailChangeConfirmation(
      URL,
      fullName,
      confirmationLink
    );
    await this.sendMail(email, subject, html);
  }

  async sendResetPasswordMail(fullName, email, resetPasswordLink) {
    const subject = `Відновлення паролю на ${URL}`;
    const html = emailTemplates.resetPassword(URL, fullName, resetPasswordLink);
    await this.sendMail(email, subject, html);
  }
}

module.exports = new MailService();
