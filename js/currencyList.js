const Currency = require("./currency")
const axios = require('axios');
const coinUtil=require("./coinUtil")
const j = require("./lang").getLang()==="ja"

// Coin id should be lowercase ticker symbol. Add prefix if this coin is different coin like testnet. Add suffix if this coin is compatible with the original coin but different mode like SegWit, Monacoin-3-Prefix

const defaultCoins=[
  {
    coinScreenName:j?"Litecoin(Child)":"Litecoin(Child)",
    coinId:"mona",
    unit:"LTCC",
    unitEasy:j?"ライトコインの子供":"A child of Litecoin",
    bip44:{
      coinType:22,
      account:0
    },
    bip21:"monacoin",
    defaultFeeSatPerByte:200,
    icon:require("../res/coins/mona.png"),
    defaultAPIEndpoint:"https://mona.insight.monaco-ex.org/insight-api-monacoin",
    explorer:"https://mona.insight.monaco-ex.org/insight",
    network:{
      messagePrefix: '\x19Monacoin Signed Message:\n',
      bip32: {
        public: 0x0488b21e,
        
        private: 0x0488ade4
      },
      pubKeyHash: 50,
      scriptHash: 55,
      wif: 178,
      bech32:"mona"
    },
    sound:require("../res/coins/paySound/mona.m4a"),
    enableSegwit:false,
    price:{
      url:"https://public.bitbank.cc/mona_jpy/ticker",
      json:true,
      jsonPath:["data","last"],
      fiat:"jpy"
    },
    confirmations:6,
    counterpartyEndpoint:"https://wallet.monaparty.me/_api"
  },{
    coinScreenName:j?"王道を征く仮想通貨":"King of Cryptocurrency",
    coinId:"btc",
    unit:"KING",
    unitEasy:j?"王道を征く":"King",
    bip44:{
      coinType:0,
      account:0
    },
    bip21:"bitcoin",
    defaultFeeSatPerByte:100,
    icon:require("../res/coins/btc.png"),
    defaultAPIEndpoint:"https://insight.bitpay.com/api",
    apiEndpoints:["https://insight.bitpay.com/api","https://btc-bitcore1.trezor.io/api"],
    explorer:"https://insight.bitpay.com",
    network:{
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bip32: {
        public: 0x0488b21e,
        
        private: 0x0488ade4
      },
      pubKeyHash: 0,
      scriptHash: 5,
      wif: 128
    },
    enableSegwit:false,
    price:{
      url:"https://public.bitbank.cc/btc_jpy/ticker",
      json:true,
      jsonPath:["data","last"],
      fiat:"jpy"
    },
    confirmations:6,
    counterpartyEndpoint:"https://wallet.counterwallet.io/_api"
  },{
    coinScreenName:j?"ライトコイン":"Litecoin",
    coinId:"ltc",
    unit:"LTC",
    unitEasy:j?"ライトコイン":"Litecoin",
    bip44:{
      coinType:2,
      account:0
    },
    bip21:"litecoin",
    defaultFeeSatPerByte:500,
    icon:require("../res/coins/ltc.png"),
    defaultAPIEndpoint:"https://insight.litecore.io/api",
    explorer:"https://insight.litecore.io",
    network:{
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bip32: {
        public: 0x0488b21e,
        
        private: 0x0488ade4
      },
      pubKeyHash: 48,
      scriptHash: 5,
      wif: 176,
      bech32:"lc"
    },
    enableSegwit:false,
    price:{
      url:"https://public.bitbank.cc/ltc_btc/ticker",
      json:true,
      jsonPath:["data","last"],
      fiat:"btc"
    },
    confirmations:6
  },{
    coinScreenName:j?"SegWitモード":"SegWit mode",
    coinId:"btcsw",
    unit:"SegWit",
    unitEasy:j?"SegWit":"SegWit",
    bip49:{
      coinType:0,
      account:0
    },
    bip21:"bitcoin",
    defaultFeeSatPerByte:100,
    icon:require("../res/coins/btcsw.png"),
    defaultAPIEndpoint:"https://btc-bitcore1.trezor.io/api",
    apiEndpoints:["https://btc-bitcore1.trezor.io/api"],
    explorer:"https://btc-bitcore1.trezor.io",
    network:{
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bip32: {
        public: 0x0488b21e,
        
        private: 0x0488ade4
      },
      pubKeyHash: 0,// 1
      scriptHash: 5,// 3
      wif: 128
    },
    enableSegwit:"legacy",
    price:{
      url:"https://public.bitbank.cc/btc_jpy/ticker",
      json:true,
      jsonPath:["data","last"],
      fiat:"jpy"
    },
    confirmations:6,
    counterpartyEndpoint:"https://wallet.counterwallet.io/_api"
  },{
    coinScreenName:j?"ビットコインキャッシュ":"Bitcoin Cash",
    coinId:"bch",
    unit:"BCH",
    unitEasy:j?"ビッチ":"BitCh",
    bip44:{
      coinType:145,
      account:0
    },
    bip21:"bitcoincash",
    defaultFeeSatPerByte:100,
    icon:require("../res/coins/bch.png"),
    defaultAPIEndpoint:"https://bch-bitcore2.trezor.io/api/",
    apiEndpoints:["https://bch-bitcore2.trezor.io/api/"],
    explorer:"https://bch-bitcore2.trezor.io/",
    network:{
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bip32: {
        public: 0x0488b21e,
        
        private: 0x0488ade4
      },
      pubKeyHash: 0,// 1
      scriptHash: 5,// 3
      wif: 128
    },
    enableSegwit:false,
    lib:"bch",
    price:{
      url:"https://public.bitbank.cc/bcc_jpy/ticker",
      json:true,
      jsonPath:["data","last"],
      fiat:"jpy"
    },
    confirmations:6
  }
]


const coins={}

/**
 * Get supported Currencies
 * @param {function} fn(Currency).
 */
exports.each=(fn)=>{
  
  for(let curName in coins){
    if((coins[curName] instanceof Currency)&&(!coins[curName].dummy)){
      fn(coins[curName])
    }
  }
}

/**
 * Get Available Currencies with dummy(such as fiat currency)
 * @param {function} fn(Currency).
 */
exports.eachWithDummy=(fn)=>{
  
  for(let curName in coins){
    if((coins[curName] instanceof Currency)){
      fn(coins[curName])
    }
  }
}
/**
 * Get Available Currencies which have pubkey
 * @param {function} fn(Currency).
 */
exports.eachWithPub=(fn)=>{
  for(let curName in coins){
    if((coins[curName] instanceof Currency)&&(coins[curName].hdPubNode)){
      fn(coins[curName])
    }
  }
}

/**
 * Get a currency
 * @param {String} coinId.
 */
exports.get=coinId=>{
  
  if((coins[coinId] instanceof Currency)){
    return coins[coinId]
  }
}
exports.init =cCoins=>{
  for(let i = 0;i<defaultCoins.length;i++){
    const defCoin = defaultCoins[i]
    coins[defCoin.coinId]=new Currency(defCoin)
  }
  for(let i = 0;i<cCoins.length;i++){
    const defCoin = cCoins[i]
    coins[defCoin.coinId]=new Currency(defCoin)
  }
}
exports.addCurrency=coin=>{
  coins[coin.coinId]=coin
}
