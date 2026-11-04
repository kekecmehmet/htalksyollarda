# Yayın kontrolü

Bu proje Codex masaüstü uygulamasında, bu sohbeti her gün Türkiye saatiyle 09.00'da sürdüren bir zamanlanmış görevle kontrol edilir. GitHub Actions işi değildir; bilgisayarın ve uygulamanın açık, proje klasörünün erişilebilir olması gerekir. GitHub'a yazma yetkisi veya tarayıcı oturumu kaybolursa yayınlama bekler ve kullanıcıya bildirilir.

## Her kontrolde

1. Uzak `main` dalını kontrol et; kullanıcının yerel değişikliklerini koru. `scan-state.json` dosyasını oku. Kanalın Canlı sekmesindeki yeni yayınları ve `pending` listesini incele.
2. YouTube sayfası yüklendikten sonra Türkçe altyazıyı al. Tarayıcıda desteklenen `content.exportYouTubeTranscript()` kullanılabilir. İlk deneme başarısızsa sayfa yüklendikten sonra bir kez daha dene. Hâlâ yoksa `pending` listesinde bırak; incelenmiş sayma. Tam altyazıları depoya koyma.
3. Şehir adının geçmesi yeterli değildir. Açık gezi başlangıcı, aynı şehrin caddeleri/mahalleleri üzerinde gezinme ve devam eden yer incelemesi birlikte aranır. Maç/takım sohbeti, gelecek planı, başka yayındaki gezinin anılması ziyaret değildir. Belirsiz eşleştirmeyi otomatik ekleme; kanıt notuyla incelemeye bırak.
4. Doğrulanan yeni şehir için `visits.json` kaydını, yerel şeffaf kulüp logosunu, kulüp zemin rengini, kaynakları ve `visit-evidence.md` dosyasını güncelle. Plaka iki basamaklıdır. Kullanıcı onaylı Burdur kaydının altyazı doğrulamasını tamamla. Video URL'sinde zaman damgası veya takip parametresi bulunmasın.
5. `visitOrder` yayınların gerçek kronolojisini izler; gecikmeli bulunan eski gezi en yeni yapılmaz. Mevcut şehir yeniden gezilirse yeni yayını kanıt notuna ekle, tek şehir kaydını en son doğrulanan geziye bağla ve sıralamayı güncelle. Aynı video/şehir çiftini tekrar işleme.
6. JSON, 01–81 plakalar, benzersiz kayıtlar, URL ve logo dosyalarını doğrula. Yerel haritada yeni şehirlerin görünmesini kontrol et. Yalnızca göreve ait dosyaları commit et ve `kekecmehmet/htalksyollarda` deposuna gönder. GitHub Pages'teki `visits.json` ve logoları doğrulamadan canlıya geçti deme.
7. İncelenen video kimliklerini ve bekleyen işleri `scan-state.json` dosyasına kaydet. Bağlantı, altyazı veya oturum hatasını boş sonuç sanma. Doğrulanamayan şehirler için tahminî kayıt oluşturma.

Bu görev yeni şehir ekleme ve ilgili site değişikliklerini yayımlama yetkisiyle kurulmuştur; rutin güncellemelerde tekrar izin istemez. Oturum açma gerekiyorsa kullanıcıdan yalnızca bu engeli gidermesini ister.
