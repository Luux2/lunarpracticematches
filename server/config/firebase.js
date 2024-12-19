const admin = require("firebase-admin");

const serviceAccount = require("../lunarpractice-7feb7-firebase-adminsdk-g6hi0-9a89630a20.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lunarpractice-7feb7-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();

module.exports = db;
