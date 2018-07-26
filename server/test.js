// var helper = require('sendgrid').mail;
// var fromEmail = new helper.Email('bhaweshsingh.sunbeam@gmail.com');
// var toEmail = new helper.Email('goku.charchit@gmail.com');
// var subject = 'Notice regarding submission.';
// var content = new helper.Content('text/plain', 'Hello,\n\tI am bhaweshSingh\n\tRegards\n\tbh. dr. yomo');
// var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//
// // console.log(process.env["SENDGRID_API_KEY"]);
// var sg = require('sendgrid')(process.env["SENDGRID_API_KEY"]);
// var request = sg.emptyRequest({
//   method: 'POST',
//   path: '/v3/mail/send',
//
//   body: mail.toJSON()
// });
//
// sg.API(request, function (error, response) {
//   if (error) {
//     console.log('Error response received');
//   }
//   console.log(response.statusCode);
//   console.log(response.body);
//   console.log(response.headers);
// });
//
// // var twilio = require('twilio');
// //
// // var client = new twilio(' n', 'a8');
// //
// // // Send the text message.
// // client.messages.create({
// //   to: '9430218670',
// //   from: '9694330420',
// //   body: 'Hello from Achie'
// // }, function (error, response) {
// //   if(error) {
// //     console.log('Error response');
// //   }
// //   console.log(response);
// //   // console.log(response.statusCode);
// //   // console.log(response.body);
// //   // console.log(response.headers);
// //
// // });
