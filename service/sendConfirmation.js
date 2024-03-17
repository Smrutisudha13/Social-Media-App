
export const sendConfirmation =async (email,subject,html)=>{ 
    let transporter = nodemailer.createTransport({
        service:'gmail',
           auth: {
             user: 'mostafamahmoudmorcy@gmail.com', // generated ethereal user
             pass: "idxpietzrekdibsr", // generated ethereal password // pass وهمى
           },
         });
         // send mail with defined transport object
         let info = await transporter.sendMail({
           from: '"Mostafa Mo 👻" <mostafamahmoudmorcy@gmail.com>', // sender address
           to:email, // list of receivers
           subject, // Subject line
           html, // html body
         });
         console.log(info);
    }