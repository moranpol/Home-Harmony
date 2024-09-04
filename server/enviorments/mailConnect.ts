import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Home.harmony.supp@gmail.com',
      pass: 'owcx fxeh mhgm iqmo',
    },
  });

export default transporter;