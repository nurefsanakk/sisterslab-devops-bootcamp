# Öğrenci Kayıt ve Listeleme İşlemleri

Bu proje, basit bir öğrenci kayıt ve listeleme uygulamasıdır. Kullanıcıdan dinamik veri alma, get, post, database işlemleri gerçekleştirilmiştir.

#### Yapılan İşlemler
- Helper klasörünün içerisinde bulunan mysql.js ile veri tabanı konfigürasyonları yapılmıştır.
- app.js dosyasında ilk önce database bağlantıları yapılmıştır.
- get komutu ile "/students" adresinde öğrencilerin listelenmesi sağlanmıştır.
- post komutu ile "/students/add" adresine post data gönderimektedir. Post işlemi postman üzerinden json gönderilerek yapılmaktadır.
- post data daha sonra veri tabanına eklenmektedir.
- Son işlem olarak eklenen tüm verilerin "/students/:id" üzerinden görüntülenmesi sağlanmaktadır. Görüntülenen dataların içerisine not ortalaması da eklenmiştir.

