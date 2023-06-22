import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import mongodb from './db';

const app = express();
const port = process.env.PORT || 1830;

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    })
    .use('/', router);

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to db\nRunning on http://156.155.158.70:${port}`);
    }
});