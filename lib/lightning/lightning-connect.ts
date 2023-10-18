import LnMessage from 'lnmessage'
import net from 'net'

const NODE_PORT = 9735

class Lightning {
  constructor(ip, node_id, rune, port){
    this.ip = ip
    this.node_id = node_id
    this.port =  port || NODE_PORT
    this._rune = rune
  }
  
  async connect() {
    this.client = new LnMessage({
      remoteNodePublicKey: this.node_id,
      tcpSocket: new net.Socket(),
      ip: this.ip,
      port: this.port
    })

    const connected = await this.client.connect()
    if (!connected) throw Error(`"Failed to connect to node: ${node_id}, @${ip}:${port}"`)

    this.connection_open = true
  }

  close() {
    this.client.disconnect()
    this.connection_open = false
  }

  async call(method, payload) {
    try {
      const result = await this.client.commando({
        method: method,
        params: payload,
        rune: this._rune
      })
      return result
    } catch (err) {
      throw Error(err)
    }
  }

  async invoice(amountMsat, label, description, expiry=3600) {
    return await this.call('invoice', {
      amount_msat: amountMsat,
      label: label,
      description: description
    })
  }

  async decode(bolt11) {
    return await this.call('decode', {string: bolt11})
  }

  async listinvoices(label) {
    return await this.call('listinvoices', {label}) 
  }

  async payLn(bolt11, amountMsat) {
    return await this.call('pay', {bolt11})
  }

  async payBTC(amountSat, destination) {
    return await this.call('withdraw', {destination, satoshi: amountSat})
  }

  async waitinvoice(label) {
    return await this.call('waitinvoice', {label})
  }

  async verifyInvoice(label) {
    invoice = await this.listinvoices(label)
    if (invoice.status != 'paid')
    {
      paid = false
      while(!paid) {
        while (invoice.expires_at < Date.now) {
          invoice = await this.listinvoices(label)
          paid = (invoice.status == 'paid')
        }
      }
    }

    return true
  }

  verifyPaymentBTC() {
    //
  }

  async listfunds(spent: bool = false) {
    return await this.call('listfunds', {spent})
  }
}