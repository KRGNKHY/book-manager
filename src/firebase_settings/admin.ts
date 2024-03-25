import * as admin from "firebase-admin"

import { initializeApp } from 'firebase-admin/app';

const serviceAccount = require("../serviceAccountKey.json");

const config = {
    apiKey: "AIzaSyD1HuAcmT6WeJbGt5PdECMpv-csQCw0xew",
    credential: admin.credential.cert(serviceAccount)
};

admin.initializeApp(config);