import LnMessage from "lnmessage";
import net from "net";

const NODE_PORT = 9735;

class Invoice {
  status: string = "";
  expires_at: number = 0;
}

class Lightning {
  ip: string;
  port: number;
  node_id:string;
  _rune: string;
  client: LnMessage | null;
  connected: boolean;

  constructor(ip: string, node_id:string, rune: string, port: number = NODE_PORT){
    this.ip = ip;
    this.node_id = node_id;
    this.port =  port || NODE_PORT;
    this._rune = rune;
    this.client = null;
    this.connected = false;
  }
  
  async connect() {
    this.client = new LnMessage({
      remoteNodePublicKey: this.node_id,
      tcpSocket: new net.Socket(),
      ip: this.ip,
      port: this.port
    });

    const connected = await this.client.connect();
    if (!connected) throw Error(`"Failed to connect to node: ${this.node_id}@${this.ip}:${this.port}"`);

    this.connected = true;
  }

  close() {
    if (this.client)
    {
        this.client.disconnect();
        this.connected = false;
    }
  }

  async call(method: string, payload: object) {
    if (!this.connected) this.connect();

    try {
      const result = this.client && await this.client.commando({
        method: method,
        params: payload,
        rune: this._rune
      });
      return result;
    } catch (err) {
      //log
      throw Error(`An error occurred during ${method} rpc to node: ${this.node_id}@${this.ip}:${this.port}"`);
    }
  }

  async invoice(amountMsat: number, label: string, description: string, expiry: number=3600) {
    return await this.call("invoice", {
      amount_msat: amountMsat,
      label,
      description,
      expiry
    });
  }

  async decode(bolt11: string) {
    return await this.call("decode", {string: bolt11});
  }

  async listinvoices(label: string) {
    return await this.call("listinvoices", {label}); 
  }

  async payLn(bolt11: string) {
    return await this.call("pay", {bolt11});
  }

  async payBTC(amountSat: number, destination: string) {
    return await this.call("withdraw", {destination, satoshi: amountSat});
  }

  async waitinvoice(label: string) {
    return await this.call("waitinvoice", {label});
  }

  async verifyInvoice(label: string) {
    let inv: Invoice = <Invoice>await this.listinvoices(label);
    if (inv.status != "paid")
    {
      let paid = false;
      while(!paid) {
        while (inv.expires_at < Date.now()) {
          inv = <Invoice> await this.listinvoices(label);
          paid = (inv.status == "paid");
        }
      }
    }

    return true;
  }

  verifyPaymentBTC() {
    //
  }

  async listfunds(spent: boolean = false) {
    return await this.call("listfunds", {spent});
  }
}

export {Lightning};
