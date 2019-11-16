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

let data = [];

app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname+'/public/login/index.html'))
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
    res.sendFile(path.join(__dirname+'/public/profile.html'))
})

let iter = 1;
app.post('/setNotifications', (req, res) => {
    const obj = {
        ...req.body,
        iter,
    }
    iter++;
    data[data.length] = obj;
    console.log(data);
    res.send("data set");
})

app.post('/getNotifications', (req, res) => {
    console.log("getting not", req.body);
    const id = req.body.tid;
    console.log("id", id)
    let resArr = data.filter((item) => item.tid == id);
    console.log(resArr);
    res.send(resArr);
})

const transact = () => {
    let address = `0xED0333a6A2069a3c0b6DfDA8E2cB06f040907f4E`
    // let privateKey = `f6b608cd47b2214848c4674f592ee56d073655bf77317793756632159e36dff8`
    let WalletId = `0xF07ce98488B38a1EE0A1983b1CB6D36349A47f5b`
    let amount = 10;
    let nonce = web3.eth.getTransactionCount(address)
    web3.eth.sendTransaction({
        from: address,
        to: WalletId,
        value: web3.toWei(amount,'ether')
    })
    console.log("transaction deone")

}

app.post('/notificationYes', (req, res) => {
    const iter = req.body.iter;
    // var spawn = require("child_process").spawn;
    // var process = spawn('python',["./transaction.py", 
    //                         req.query.firstname, 
    //                         req.query.lastname] );
    transact(),
    data = data.filter((item) => item.iter != iter);
    res.send("data send");
})

app.post('/notificationNo', (req, res) => {
    const iter = req.body.iter;
    data = data.filter((item) => item.iter != iter);
    console.log(data)
    res.send("deleted")
})


app.listen( 8000, () => {
    console.log("server made")
})