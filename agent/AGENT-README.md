# 🛰️ Agent – Dağıtık Cron Scheduler (TR)

Bu dosya, dağıtık cron job sisteminin agent tarafını açıklar. Agent, relay-server’a bağlanarak kendi işlerini alır, zamanında çalıştırır ve durumu raporlar.

---

## ✅ Görevleri

* Kendini sunucuya kaydeder (`POST /agents`)
* Her 15 saniyede bir sunucuya "heartbeat" gönderir (`POST /agents/heartbeat`)
* Her 5 saniyede:

  * Sunucudan tüm job’ları çeker (`GET /jobs`)
  * Kendi `agentId`’si ile eşleşenleri süzer
  * Cron saatine göre çalışması gerekenleri belirler
  * Eğer o zaman aralığında henüz çalışmadıysa, job’ı çalıştırır
  * Sonucu sunucuya bildirir: durum, gecikme süresi, hata, vs.

---

## 📦 Klasör Yapısı

```
agent/
├── src/
│   ├── core/
│   │   ├── jobRunner.js        // İş çalıştırma & sonuç bildirimi
│   │   └── jobScheduler.js     // Periyodik job kontrol döngüsü
│   ├── services/
│   │   ├── agentService.js     // Register işlemi & IP tespiti
│   │   ├── apiService.js       // Sunucuyla REST iletişim
│   │   └── heartbeatService.js // Heartbeat gönderimi
│   ├── utils/
│   │   └── cronUtils.js        // Cron zaman kontrol fonksiyonu
│   └── bootstrap.js            // Uygulamanın başlatıcı dosyası
```

---

## 🔌 Relay-server ile Bağlantılar

| HTTP İsteği              | Açıklama                                   |
| ------------------------ | ------------------------------------------ |
| `POST /agents`           | Kendi bilgisini sunucuya gönderir          |
| `POST /agents/heartbeat` | 15 saniyede bir ping atar                  |
| `GET /jobs`              | Tüm job'ları çeker, filtreyi kendisi yapar |
| `PATCH /jobs/:id`        | Job çalıştıysa sonucunu bildirir           |

### Gönderilen veri örneği:

```json
{
  "status": "success" | "delayed" | "failed",
  "lastRunAt": "2025-05-28T05:03:00Z",
  "retryCount": 0,
  "lastError": null,
  "delayMs": 1500
}
```

---

## 🚀 Nasıl Deploy Edilir?

1. Gerekli klasöre gidin:

```bash
cd agent
```

2. Bağımlılıkları kurun:

```bash
npm install
```

3. Sunucu çalışıyorsa, agent’ı başlatın:

```bash
node src/bootstrap.js
```

> Not: `bootstrap.js` içinde token sabit olarak ayarlanmış olabilir. Gerçek kullanıcı doğrulama için login yapılıp token alınması gerekir.

---

## 📊 İzleme için

* `lastSeen` alanı sunucuda her heartbeat ile güncellenir
* `status`, `delayMs`, `lastRunAt` gibi alanlar ile job'lar frontend'de görselleştirilebilir

---

## 🛣️ Yol Haritası

* [x] Agent cron job'ları zamanında çalıştırıyor
* [x] Heartbeat desteği ile online/offline takibi yapılıyor
* [ ] WebSocket ile sunucudan anlık job iletimi (NAT traversal çözümü)
* [ ] Log dosyasına kayıt & frontend için export
