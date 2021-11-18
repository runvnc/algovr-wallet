import algosdk from 'algosdk'
import pkg from "@randlabs/encrypted-local-storage"
const AppStorage = pkg.default

let appStorage

window.AFRAME.registerComponent('algo-sale', {  
 schema: {
   event: { type: 'string', default: 'clicked'},
   seller: { type: 'string', default: ''},
   assetid: { type: 'int' },
   price: { type: 'int' },
   address: { type: 'string' }
 },
 init: function () {
   console.log('Blah')        
   const self = this        
   this.eventHandlerFn = function () {
     console.log('ok 1')
     const wallet = document.getQuerySelector('a-entity[type="algovr-wallet"]')
     const address = wallet.address
     console.log(address)
     console.log(self.data)
   }
 },  
 update: function () {
   const data = this.data
   const el = this.el
   if (data.event) { el.addEventListener(data.event, this.eventHandlerFn) }
   else { console.log('werwerwer') }
 }
})

AFRAME.registerPrimitive('a-algo-wallet', {
  defaultComponents: {
    address: 'notset'  
  },

  // Maps HTML attributes to the `ocean` component's properties.
  mappings: {
    address: 'algo-wallet.address',
  }
})


let algod = new algosdk.Algodv2('', 'https://algoexplorerapi.io/','')
let indexerClient = new algosdk.Indexer('', 'https://algoexplorerapi.io/idx2', '') 

async function newWallet({walletName, password}) {
  let account = algosdk.generateAccount()
  let passphrase = algosdk.secretKeyToMnemonic(account.sk)
  console.log({AppStorage})
  await AppStorage.savePrivatekeyToStorage(`algovr-wallet-${walletName}`, password, account.sk)
  return {addr:account.addr, passphrase}
}

async function storeExisting({walletName, mnemonic, password}) {
  const {addr, sk} = algosdk.mnemonicToSecretKey(mnemonic)    
  await AppStorage.savePrivatekeyToStorage(`algovr-wallet-${walletName}`, password, sk)
  return {addr}
}

async function getSecretKey(walletName, password) {
  const data = await AppStorage.loadPrivatekeyFromStorage(`algovr-wallet-${walletName}`, password)
  return data
}

async function signTransaction() {
}

async function getWallets() { 
  let keys = await AppStorage.getKeys()
  keys = keys.map( k => k.replace('algovr-wallet-',''))
  return keys
}



let wall1='acquire zebra drum measure order grain armed width entire tell bone near ranch decide mind melt morning adult velvet half rotate train era abandon observe' 

async function dotest() {
  //let wallet = await newWallet({walletName:'Wallet #1', password:'superfreak'})
  //console.log(wallet)
  //let addr = await storeExisting('Wallet #1', wall1, 'superfreak')

  let addr = 'OH7LZZBRCVRSMPSLI2AD2EOFDOCXIRB43PESKPK2RAH4LMLALPM22EIHUA'
  let name = (await getWallets() )[0]
  console.log(name)
  let pk = await getSecretKey('Wallet #1', 'superfreak')
  
  console.log({pk})
  let account = await algod.accountInformation(addr).do()
  console.log({account})

  const el = document.querySelector('#testlog')
  console.log({el})
  el.emit('anEvent')
}
   
if (!window.algod) window.algod = algod

if (!window.indexerClient) window.indexerClient = indexerClient

dotest().catch(console.error)
