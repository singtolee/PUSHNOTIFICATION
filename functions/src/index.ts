import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.pushNotification = functions.firestore.document('MYORDERS/{orderId}').onUpdate((change,context)=>{
    const order = change.after.data();
    const oid = context.params.orderId;
    const uid = order.uid;
    return admin.firestore().collection("USERS").doc(uid).get().then(queryResult=>{
        const token = queryResult.data().deviceToken;
        const payload = {
            notification:{
                title: "WHY ERROR",
                body:"WHO MAKE ERROR"
            },
            data:{
                key1:"fore key"
            },
            token:token
        };
        return admin.messaging().send(payload).then((resp)=>{
            console.log("SUCCESS OF : ",resp);
        }).cathe((error)=>{
            console.log("ERROR OF : ",error);
        })
    });
})
