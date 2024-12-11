const admin = require("firebase-admin");

const serviceAccount = require("../firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lunarpractice-7feb7-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();

module.exports = db;
