const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const nodeMailer = require("nodemailer");

const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade")

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.get("/", (req, res) => {
    console.log("Hello");
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about", {message: "Hi there!"});
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/contact/send", (req,res) => {
    //res.send(req.body);
    let transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'zen.christopherespiritu@gmail.com',
            pass: 'thepasswordhere!'
        }
    });
    let mailOptions = {
        from: 'Christopher Espiritu <zen.christopherespiritu@gmail.com>',
        to: 'zen.christopherespiritu@gmail.com',
        subject: 'Test using email app',
        text: `Hey this is my test app. 
        Thank you ${req.body.name}. Email: ${req.body.email}!
        ${req.body.message}`,
        html: `<p>We have a form submission with the following details!
        ${req.body.message}</p>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Message: ${req.body.message}</li>
        </ul>
        `
    };
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
            res.redirect('/');
        } else{
            console.log(`Message sent! ${info.response}`);
            res.send({ 'message': "Message sent!"});
        }
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
