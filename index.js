const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const Route = express.Router();

const accountSid = "AC85af0c9055e7cdc712b42bac120dbb62";
const authToken = "bc92b71c28a2343fc987de8e56acbfbb";
const serviceId = "VA77c179f41f8f8b822376bd2d3a50c8ff";
const client = require('twilio')(accountSid, authToken);

const PORT=5000 || process.env.PORT;

const app=express();

app.use(cors());
app.use(bodyParser.json())
app.use('/demologin',Route);
Route.route('/send-verification-otp').post((req,res)=>{

    const {mobileNumber} = req.body;
    console.log(mobileNumber);
    client.verify.v2.services(serviceId)
        .verifications.create({to: '+91' + mobileNumber, channel: 'sms'})
        .then(verification => {
            console.log(verification)
            return res.status(200).json({verification});
        })
        .catch(error => {
            console.log(error);
            return res.status(400).json({error});
        });
});

Route.route('/verify-otp').post((req,res) => {

    const {mobileNumber,otp}=req.body;

    client.verify.v2.services(serviceId)
      .verificationChecks
      .create({to: '+91' + mobileNumber, code: otp})
      .then(verification_check => {
        return res.status(200).json({verification_check})
      })
      .catch(error => {
        return res.status(400).json({error})
      });
});

app.listen(PORT,()=>{
    console.log(`server is up and running at ${PORT}`);
})
