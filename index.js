const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const path = require('path');
const Web3 = require('web3');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbName = 'wallet';
const url = 'mongodb://localhost:27017';

app.use(express.static(path.join(__dirname, 'public')))

const createWeb3 = () => {
    let web3;
    const url = `HTTP://127.0.0.1:7545`;
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider(url));
    }
    return web3
}

const web3 = createWeb3();
// console.log(web3);
const queryMoney = () => {
    let acc1 = `0xED0333a6A2069a3c0b6DfDA8E2cB06f040907f4E`;
    let acc2 = `0xF07ce98488B38a1EE0A1983b1CB6D36349A47f5b`;
    let privateKey = `f6b608cd47b2214848c4674f592ee56d073655bf77317793756632159e36dff8`;
    let account = web3.eth.accounts;
    return web3.eth.getBalance(acc1).toString();
}

app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname+'/public/html/index.html'))
})

app.get('/login', (req, res) => {
    const user = 'praneeth';
    MongoClient.connect(url, (err, client) => {
        console.log("Connected successfully to server") 
        const db = client.db(dbName);
        db.collection("users").findOne({}, (err, result) => {
            if(err) throw err;
            console.log(result.address);
            res.send(result.address);
            client.close();
        })        
    });
})

app.get('/getMoney', (req, res) => {
    let money = queryMoney();
    res.send(money);
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/html/profile.html'))
})

app.listen( 8000, () => {
    console.log("server made")
})