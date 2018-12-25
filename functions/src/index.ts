import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.pushNotification = functions.firestore.document('MYORDERS/{orderId}').onUpdate((change,context)=>{
    const order = change.after.data();
    const pOrder = change.before.data();
    const uid = order.uid;
    const shippingFeeAmount = order.actualShippingCost;
    return admin.firestore().collection("USERS").doc(uid).get().then(queryResult=>{
        const token = queryResult.data().deviceToken;

        const prdPaymentReceivedPaylod = {
            notification:{
                title: "Payment Received",
                body:"Payment for products received"
            },
            data:{
                key1:"Payment Received",
                key2:"Payment for products received"
            },
            token:token
        };
        const shippingFeePaymentReceivedPayload = {
            notification:{
                title: "Payment Received",
                body:"Shipping Fee Received"
            },
            data:{
                key1:"Payment Received",
                key2:"Shipping Fee Received"
            },
            token:token
        };
        const prdArrivedNotificationPayload = {
            notification:{
                title: "Order Arrived",
                body:"Your order has arrived, please pay shipping fee " + shippingFeeAmount + "บาท"
            },
            data:{
                key1:"Order Arrived",
                key2:"Your order has arrived, please pay shipping fee " + shippingFeeAmount + "บาท"
            },
            token:token
        };
        const orderDoneNotificationPayload = {
            notification:{
                title: "Order is Done",
                body:"Thanks for ordering with Alitoyou"
            },
            data:{
                key1:"Order is Done",
                key2:"Thanks for ordering with Alitoyou"
            },
            token:token
        };

        if(order.paid && !pOrder.paid){
            //send prd payment receviced notification
            return admin.messaging().send(prdPaymentReceivedPaylod).then((resp)=>{
                console.log("SUCCESS OF : ", resp);
            }).cathe((error)=>{
                console.log("ERROR OF : ", error);
            })

        }

        if(order.shippingFeePaid && !pOrder.shippingFeePaid){
            //send shipping fee payment receviced notification
            return admin.messaging().send(shippingFeePaymentReceivedPayload).then((resp)=>{
                console.log("SUCCESS OF : ", resp);
            }).cathe((error)=>{
                console.log("ERROR OF : ", error);
            })
        }

        if(order.arrived && !pOrder.arrived){
            //send prds arrived notification
            return admin.messaging().send(prdArrivedNotificationPayload).then((resp)=>{
                console.log("SUCCESS OF : ", resp);
            }).cathe((error)=>{
                console.log("ERROR OF : ", error);
            })
        }

        if(order.done && !pOrder.done) {
            //send order is done notification
            return admin.messaging().send(orderDoneNotificationPayload).then((resp)=>{
                console.log("SUCCESS OF : ", resp);
            }).cathe((error)=>{
                console.log("ERROR OF : ", error);
            })
        }
        return null;
    });
})
