// src/services/ebusService.js
import webstomp from 'webstomp-client'

class EbusService {
  constructor() {
    this.client = null
    this.connected = false
    this.listeners = []
    this.statusListeners = []
  }

  connect(customUrl = null) {
    if (this.client && this.connected) return

    const loc = window.location
    const defaultUrl = `ws://${loc.hostname}:61614/stomp`
    const brokerUrl = customUrl || defaultUrl

    console.log('[EbusService] Connecting to', brokerUrl)

    this.client = webstomp.client(brokerUrl, { debug: true, heartbeat: { outgoing: 10000, incoming: 10000 } })

    this.client.connect(
      // headers
      {
        login: 'guest',
        passcode: 'guest',
        'accept-version': '1.1', // ✅ ActiveMQ 5.15 最穩定
      },
      // onConnect
      (frame) => {
        console.log('[EbusService] Connected', frame.headers)
        this.connected = true
        this._notifyStatus(true)
        // 同時訂閱 queue/topic
        this.client.subscribe('/topic/app', (msg) => this._onMessage(msg))
      },
      // onError
      (err) => {
        console.error('[EbusService] Connection error', err)
        this.connected = false
      }
    )
  }

  _onMessage(msg) {
    try {
      const ev = JSON.parse(msg.body)
      if (ev?.e) this.listeners.forEach((cb) => cb(ev))
    } catch (e) {
      console.error('[EBUS JSON ERROR]', e);
      console.error('[EBUS JSON ERROR]', msg.body)
    }
  }

   _notifyStatus(connected) {
    this.statusListeners.forEach(cb => cb(connected))
  }

  onStatus(cb) {
    if (typeof cb === 'function') this.statusListeners.push(cb)
  }

  onEvent(cb) {
    if (typeof cb === 'function') this.listeners.push(cb)
  }

  send(ev, arg) {
    if (!this.client || !this.connected) {
      console.warn('[EbusService] 尚未連線，無法發送')
      return
    }
    const msg = { e: ev, ...(arg && { arg }) }
    this.client.send('/queue/app', JSON.stringify(msg))
    console.log('[EbusService] 發送:', msg)
  }
}

export default new EbusService()

