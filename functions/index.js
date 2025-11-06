const functions = require('firebase functions:config:set paypal.client="PAYPAL_CLIENT" paypal.secret="PAYPAL_SECRET" gcs.bucket="my-omniverse-audios");
const fetch = require('node-fetch');
const cors = require('cors')({origin:true});
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

const BUCKET = functions.config().gcs.bucket; // set via functions config
const PAYPAL_CLIENT = functions.config().paypal.client;
const PAYPAL_SECRET = functions.config().paypal.secret;
const PAYPAL_API = functions.config().paypal.api || 'https://api-m.paypal.com';

// helper get payPal token
async function getPayPalToken(){
  const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString('base64');
  const r = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers:{ 'Authorization': `Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded'},
    body: 'grant_type=client_credentials'
  });
  const js = await r.json();
  return js.access_token;
}

exports.verifyAndGetDownload = functions.https.onRequest((req,res)=>{
  cors(req,res, async ()=>{
    if(req.method !== 'POST') return res.status(405).send('Method not allowed');
    const { orderId, itemId } = req.body;
    if(!orderId || !itemId) return res.status(400).json({error:'orderId and itemId required'});

    try{
      const token = await getPayPalToken();
      const r = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, { headers:{ 'Authorization':`Bearer ${token}` }});
      const order = await r.json();
      if(!order || !order.status || (order.status !== 'COMPLETED' && order.status !== 'APPROVED')) {
        return res.status(402).json({error:'Payment not completed', order});
      }

      // optional: verify amount vs your expected price from metadata (secure)

      // create signed url for file in GCS
      const file = storage.bucket(BUCKET).file(`audiobooks/${itemId}/full.mp3`);
      const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 24*60*60*1000 }); // 24h
      return res.json({ success:true, downloadUrl: url, expiresAt: Date.now() + 24*60*60*1000 });
    }catch(err){
      console.error(err);
      return res.status(500).json({error:String(err)});
    }
  });
});
