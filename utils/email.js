const nodemailer = require('nodemailer');
const pug=require('pug');
const { htmlToText }=require('html-to-text');
module.exports = class Email {
  constructor(user,url){
this.to=user.email;
  this.firstName=String(user.name).split(' ')[0]

this.url=url;
this.from='Hekuran Kokolli <hello@=heki.io'  
}
newTransport(){
  if(process.env.NODE_ENV=== 'production'){
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'hekuran.kokolli@student.uni-pr.edu',
        pass: 'hekurankokolli123'
      }
    });
  }
  return nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
    }
    // Activate in gmail 'less secure app'
  })
}
async send(template,subject){
  // 1)render HTML based on pug Template
const html=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
  firstName:this.firstName,
  url:this.url,
  subject
});


  const mailOptions = {
    from:this.from,
    to:this.to,
    subject,
    html,
    text:(html.replace(/<style([\s\S]*?)<\/style>/gi, '')).replace(/<[^>]+>/g, ''),
    // html:
}
;
await this.newTransport().sendMail(mailOptions);
// create an transport and send Email

}
async sendWelcome(){
  await this.send('Welcome','Welcome to the App Family!');
}
async sendPasswordReset(){
  await this.send('passwordReset','Your password reset token last only 10 minutes')
}
}
const sendEmail = async options => {

    //2) Define the email options
    //3) Actually send the email with nodemailer
await transporter.sendMail(mailOptions);
}
// module.exports = sendEmail;
