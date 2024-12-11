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

  async sendActivationMail(email, activationLink) {
    try {
      await this.transporter.sendMail({
        from: USER,
        to: email,
        subject: `Активація акаунту на ${URL}`,
        text: '',
        html: `
          <div>
              <h2>Для активації облікового запису перейдіть за посиланням:</h2>
              <a href="${activationLink}">${activationLink}</a>
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
