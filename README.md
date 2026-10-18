# HTalks Yollarda

HTalks yayınlarında gezilen şehirlerin etkileşimli Türkiye haritası.

## GitHub Pages

Depo: `kekecmehmet/htalksyollarda`

Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: **main**, folder: **/ (root)** → Save.

Yayın adresi: https://kekecmehmet.github.io/htalksyollarda/

## Yerelde çalıştırma

```sh
python3 -m http.server 4173
```

## Yeni şehir

`visits.json` dosyasına `plate`, `team`, `logo`, `color`, `videoUrl`, `visitOrder` alanlarıyla kayıt ekleyin. Logolar `assets/` klasöründedir. Video bağlantıları zaman damgasızdır. `visitOrder` kronolojik gezi sırasıdır: ilk gezi 1, sonraki 2; yeni geziye en büyük değerin bir fazlasını verin. Tüm şehirler plaka sırasıyla, gezilenler en yeniden eskiye gösterilir.

Ziyaret kanıtları `visit-evidence.md`, görsel kaynaklar `credits.html`, harita lisansı `MAP-LICENSE` dosyasındadır. Logo ve marka hakları ilgili sahiplerine aittir.

Hazırlayan: https://kekecmehmet.github.io
