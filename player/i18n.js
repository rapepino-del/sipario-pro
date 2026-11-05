/* Traduzioni di Sipario. Chiave = testo italiano (lingua di partenza).
   Per aggiungere una lingua: aggiungi un codice a LANGS, una colonna a ogni riga di ROWS e le impostazioni in META. */
(function () {
'use strict';
const LANGS = [['it', 'Italiano'], ['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['ar', 'العربية'], ['zh', '中文']];
const META = { it: { loc: 'it-IT' }, en: { loc: 'en-GB' }, es: { loc: 'es-ES' }, fr: { loc: 'fr-FR' }, ar: { loc: 'ar', rtl: true }, zh: { loc: 'zh-CN' } };
const ORDER = ['en', 'es', 'fr', 'ar', 'zh'];

/* it ||| en ||| es ||| fr ||| ar ||| zh */
const ROWS = `
Il tuo cinema, a luci spente. ||| Your cinema, lights down. ||| Tu cine, con las luces apagadas. ||| Votre cinéma, lumières éteintes. ||| سينماك، والأضواء خافتة. ||| 你的私人影院，灯光渐暗。
Apri Sipario dall'app ||| Open Sipario from the app ||| Abre Sipario desde la aplicación ||| Ouvrez Sipario depuis l'application ||| افتح Sipario من التطبيق ||| 请从应用程序中打开 Sipario
Questa pagina funziona solo all'interno dell'applicazione Sipario installata sul tuo computer. ||| This page only works inside the Sipario application installed on your computer. ||| Esta página solo funciona dentro de la aplicación Sipario instalada en tu ordenador. ||| Cette page ne fonctionne qu'à l'intérieur de l'application Sipario installée sur votre ordinateur. ||| تعمل هذه الصفحة فقط داخل تطبيق Sipario المثبّت على جهازك. ||| 此页面只能在已安装于您电脑上的 Sipario 应用中使用。
Aggiungi la tua playlist ||| Add your playlist ||| Añade tu playlist ||| Ajoutez votre playlist ||| أضِف قائمة التشغيل الخاصة بك ||| 添加你的播放列表
Indirizzo server ||| Server address ||| Dirección del servidor ||| Adresse du serveur ||| عنوان الخادم ||| 服务器地址
Nome utente ||| Username ||| Nombre de usuario ||| Nom d'utilisateur ||| اسم المستخدم ||| 用户名
Password ||| Password ||| Contraseña ||| Mot de passe ||| كلمة المرور ||| 密码
Mostra ||| Show ||| Mostrar ||| Afficher ||| إظهار ||| 显示
Nascondi ||| Hide ||| Ocultar ||| Masquer ||| إخفاء ||| 隐藏
Link della playlist M3U ||| M3U playlist link ||| Enlace de la lista M3U ||| Lien de la playlist M3U ||| رابط قائمة M3U ||| M3U 播放列表链接
Ricorda questa playlist su questo computer (cifrata) ||| Remember this playlist on this computer (encrypted) ||| Recordar esta playlist en este ordenador (cifrada) ||| Mémoriser cette playlist sur cet ordinateur (chiffrée) ||| تذكّر هذه القائمة على هذا الجهاز (مشفّرة) ||| 在此电脑上记住此播放列表（已加密）
Entra ||| Sign in ||| Entrar ||| Se connecter ||| دخول ||| 进入
Annulla ||| Cancel ||| Cancelar ||| Annuler ||| إلغاء ||| 取消
Sipario è un lettore: non include né fornisce canali o contenuti. Usa solo playlist di cui hai diritto. ||| Sipario is a player: it does not include or provide channels or content. Only use playlists you have the right to use. ||| Sipario es un reproductor: no incluye ni proporciona canales ni contenidos. Usa solo listas a las que tengas derecho. ||| Sipario est un lecteur : il n'inclut ni ne fournit de chaînes ou de contenus. N'utilisez que des playlists auxquelles vous avez droit. ||| Sipario مشغّل فقط: لا يتضمن ولا يوفّر قنوات أو محتوى. استخدم فقط قوائم تشغيل يحق لك استخدامها. ||| Sipario 只是一个播放器：不包含也不提供任何频道或内容。请仅使用你有权使用的播放列表。
Chi guarda? ||| Who's watching? ||| ¿Quién está viendo? ||| Qui regarde ? ||| من يشاهد؟ ||| 谁在观看？
Gestisci profili ||| Manage profiles ||| Gestionar perfiles ||| Gérer les profils ||| إدارة الملفات الشخصية ||| 管理用户档案
Home ||| Home ||| Inicio ||| Accueil ||| الرئيسية ||| 首页
Live TV ||| Live TV ||| TV en vivo ||| TV en direct ||| البث المباشر ||| 电视直播
Film ||| Movies ||| Películas ||| Films ||| الأفلام ||| 电影
Serie TV ||| TV Series ||| Series ||| Séries TV ||| المسلسلات ||| 剧集
Preferiti ||| Favorites ||| Favoritos ||| Favoris ||| المفضلة ||| 收藏
Impostazioni ||| Settings ||| Ajustes ||| Paramètres ||| الإعدادات ||| 设置
Cerca ovunque… ||| Search everywhere… ||| Buscar en todo… ||| Rechercher partout… ||| ابحث في كل مكان… ||| 全局搜索…
Cerca in {s}… ||| Search in {s}… ||| Buscar en {s}… ||| Rechercher dans {s}… ||| ابحث في {s}… ||| 在{s}中搜索…
Ovunque ||| Everywhere ||| Todo ||| Partout ||| في كل مكان ||| 全部
Solo qui ||| Here only ||| Solo aquí ||| Ici seulement ||| هنا فقط ||| 仅此处
Licenza ||| License ||| Licencia ||| Licence ||| الترخيص ||| 许可证
Profilo ||| Profile ||| Perfil ||| Profil ||| الملف الشخصي ||| 档案
Chiudi (Esc) ||| Close (Esc) ||| Cerrar (Esc) ||| Fermer (Échap) ||| إغلاق (Esc) ||| 关闭 (Esc)
Indietro ||| Back ||| Atrás ||| Retour ||| رجوع ||| 返回
Avanti ||| Forward ||| Adelante ||| Avancer ||| التالي ||| 前进
Canale precedente (PagSù) ||| Previous channel (PageUp) ||| Canal anterior (RePág) ||| Chaîne précédente (Page préc.) ||| القناة السابقة (PageUp) ||| 上一频道 (PageUp)
Successivo (PagGiù) ||| Next (PageDown) ||| Siguiente (AvPág) ||| Suivant (Page suiv.) ||| التالي (PageDown) ||| 下一个 (PageDown)
Timer di spegnimento ||| Sleep timer ||| Temporizador de apagado ||| Minuterie d'arrêt ||| مؤقّت الإيقاف ||| 睡眠定时器
Finestra flottante ||| Picture-in-picture ||| Imagen en imagen ||| Image dans l'image ||| صورة داخل صورة ||| 画中画
Preferito ||| Favorite ||| Favorito ||| Favori ||| مفضّل ||| 收藏
Schermo intero (F) ||| Full screen (F) ||| Pantalla completa (F) ||| Plein écran (F) ||| ملء الشاشة (F) ||| 全屏 (F)
Caricamento… ||| Loading… ||| Cargando… ||| Chargement… ||| جارٍ التحميل… ||| 加载中…
Impossibile riprodurre ||| Can't play ||| No se puede reproducir ||| Lecture impossible ||| تعذّر التشغيل ||| 无法播放
Riprova ||| Try again ||| Reintentar ||| Réessayer ||| أعد المحاولة ||| 重试
Scopri Premium ||| Discover Premium ||| Descubre Premium ||| Découvrir Premium ||| اكتشف Premium ||| 了解 Premium
Chiudi ||| Close ||| Cerrar ||| Fermer ||| إغلاق ||| 关闭
Guarda ora ||| Watch now ||| Ver ahora ||| Regarder ||| شاهد الآن ||| 立即观看
Lingua ||| Language ||| Idioma ||| Langue ||| اللغة ||| 语言
Il server interno di Sipario non risponde. Riavvia l'app. ||| Sipario's internal server is not responding. Restart the app. ||| El servidor interno de Sipario no responde. Reinicia la aplicación. ||| Le serveur interne de Sipario ne répond pas. Redémarrez l'application. ||| الخادم الداخلي لـ Sipario لا يستجيب. أعد تشغيل التطبيق. ||| Sipario 内部服务器没有响应。请重新启动应用。
Risposta non valida dal server ||| Invalid response from the server ||| Respuesta no válida del servidor ||| Réponse invalide du serveur ||| استجابة غير صالحة من الخادم ||| 服务器响应无效
Errore {status} ||| Error {status} ||| Error {status} ||| Erreur {status} ||| خطأ {status} ||| 错误 {status}
Inserisci l'indirizzo del server ||| Enter the server address ||| Introduce la dirección del servidor ||| Saisissez l'adresse du serveur ||| أدخل عنوان الخادم ||| 请输入服务器地址
Indirizzo del server non valido ||| Invalid server address ||| Dirección del servidor no válida ||| Adresse du serveur invalide ||| عنوان الخادم غير صالح ||| 服务器地址无效
Server non raggiungibile ({detail}) ||| Server unreachable ({detail}) ||| Servidor no accesible ({detail}) ||| Serveur injoignable ({detail}) ||| تعذّر الوصول إلى الخادم ({detail}) ||| 无法连接服务器（{detail}）
Il server ha risposto con errore {status} ||| The server replied with error {status} ||| El servidor respondió con el error {status} ||| Le serveur a répondu avec l'erreur {status} ||| ردّ الخادم بالخطأ {status} ||| 服务器返回错误 {status}
Inserisci un link M3U valido (http...) ||| Enter a valid M3U link (http...) ||| Introduce un enlace M3U válido (http...) ||| Saisissez un lien M3U valide (http...) ||| أدخل رابط M3U صالحًا (http...) ||| 请输入有效的 M3U 链接 (http...)
Inserisci username e password ||| Enter username and password ||| Introduce usuario y contraseña ||| Saisissez l'identifiant et le mot de passe ||| أدخل اسم المستخدم وكلمة المرور ||| 请输入用户名和密码
Il link non contiene una playlist M3U valida ||| The link does not contain a valid M3U playlist ||| El enlace no contiene una lista M3U válida ||| Le lien ne contient pas de playlist M3U valide ||| الرابط لا يحتوي على قائمة M3U صالحة ||| 该链接不包含有效的 M3U 播放列表
Credenziali non valide ||| Invalid credentials ||| Credenciales no válidas ||| Identifiants invalides ||| بيانات الدخول غير صحيحة ||| 凭据无效
Abbonamento non attivo ({status}) ||| Subscription not active ({status}) ||| Suscripción no activa ({status}) ||| Abonnement inactif ({status}) ||| الاشتراك غير فعّال ({status}) ||| 订阅未激活（{status}）
Il catalogo è vuoto. Controlla l'abbonamento o il link. ||| The catalog is empty. Check your subscription or the link. ||| El catálogo está vacío. Comprueba la suscripción o el enlace. ||| Le catalogue est vide. Vérifiez l'abonnement ou le lien. ||| الكتالوج فارغ. تحقّق من الاشتراك أو الرابط. ||| 目录为空。请检查订阅或链接。
Non autorizzato ||| Unauthorized ||| No autorizado ||| Non autorisé ||| غير مصرّح ||| 未授权
Formato della licenza non valido. ||| Invalid license format. ||| Formato de licencia no válido. ||| Format de licence invalide. ||| تنسيق الترخيص غير صالح. ||| 许可证格式无效。
Licenza non autentica. ||| License is not authentic. ||| La licencia no es auténtica. ||| Licence non authentique. ||| الترخيص غير أصلي. ||| 许可证不是正版。
Questa licenza è legata a un altro computer. ||| This license is tied to another computer. ||| Esta licencia está vinculada a otro ordenador. ||| Cette licence est liée à un autre ordinateur. ||| هذا الترخيص مرتبط بجهاز آخر. ||| 此许可证已绑定到另一台电脑。
Licenza scaduta. ||| License expired. ||| Licencia caducada. ||| Licence expirée. ||| انتهت صلاحية الترخيص. ||| 许可证已过期。
Questa licenza è stata revocata. ||| This license has been revoked. ||| Esta licencia ha sido revocada. ||| Cette licence a été révoquée. ||| تم إلغاء هذا الترخيص. ||| 此许可证已被撤销。
Licenza non valida. ||| Invalid license. ||| Licencia no válida. ||| Licence invalide. ||| ترخيص غير صالح. ||| 许可证无效。
Impossibile salvare la licenza. ||| Unable to save the license. ||| No se pudo guardar la licencia. ||| Impossible d'enregistrer la licence. ||| تعذّر حفظ الترخيص. ||| 无法保存许可证。
Orologio di sistema alterato: ripristina data e ora corrette. ||| System clock altered: restore the correct date and time. ||| Reloj del sistema alterado: restablece la fecha y hora correctas. ||| Horloge système modifiée : rétablissez la date et l'heure correctes. ||| تم تغيير ساعة النظام: أعد ضبط التاريخ والوقت الصحيحين. ||| 系统时钟被修改：请恢复正确的日期和时间。
Documento non disponibile. ||| Document not available. ||| Documento no disponible. ||| Document non disponible. ||| المستند غير متاح. ||| 文档不可用。
Termini d'uso ||| Terms of use ||| Términos de uso ||| Conditions d'utilisation ||| شروط الاستخدام ||| 使用条款
Informativa sulla privacy ||| Privacy policy ||| Política de privacidad ||| Politique de confidentialité ||| سياسة الخصوصية ||| 隐私政策
Informativa privacy ||| Privacy policy ||| Política de privacidad ||| Politique de confidentialité ||| سياسة الخصوصية ||| 隐私政策
Licenze di terze parti ||| Third-party licenses ||| Licencias de terceros ||| Licences tierces ||| تراخيص الأطراف الثالثة ||| 第三方许可
Privacy ||| Privacy ||| Privacidad ||| Confidentialité ||| الخصوصية ||| 隐私
Prima di iniziare ||| Before you start ||| Antes de empezar ||| Avant de commencer ||| قبل أن تبدأ ||| 开始之前
Sipario è un semplice lettore. ||| Sipario is simply a player. ||| Sipario es un simple reproductor. ||| Sipario est un simple lecteur. ||| Sipario مجرّد مشغّل. ||| Sipario 只是一个简单的播放器。
Non fornisce, non include e non distribuisce canali, film, serie o playlist. Puoi usarlo solo con contenuti per i quali hai un diritto legittimo di accesso, ed è tua la responsabilità di ciò che riproduci. ||| It does not provide, include or distribute channels, movies, series or playlists. You may only use it with content you are legitimately entitled to access, and you are responsible for what you play. ||| No proporciona, incluye ni distribuye canales, películas, series ni listas. Solo puedes usarlo con contenidos a los que tengas derecho legítimo de acceso, y eres responsable de lo que reproduces. ||| Il ne fournit, n'inclut ni ne distribue de chaînes, films, séries ou playlists. Vous ne pouvez l'utiliser qu'avec des contenus auxquels vous avez légitimement droit, et vous êtes responsable de ce que vous lisez. ||| لا يوفّر قنوات أو أفلامًا أو مسلسلات أو قوائم تشغيل ولا يتضمنها ولا يوزّعها. يمكنك استخدامه فقط مع محتوى يحق لك الوصول إليه قانونيًا، وأنت المسؤول عمّا تشغّله. ||| 它不提供、不包含也不分发任何频道、电影、剧集或播放列表。你只能将其用于你依法有权访问的内容，并对所播放的内容负责。
Ho letto e accetto i Termini d'uso e l'informativa sulla privacy ||| I have read and accept the Terms of use and the privacy policy ||| He leído y acepto los Términos de uso y la política de privacidad ||| J'ai lu et j'accepte les Conditions d'utilisation et la politique de confidentialité ||| لقد قرأتُ شروط الاستخدام وسياسة الخصوصية وأوافق عليهما ||| 我已阅读并接受使用条款和隐私政策
Esci ||| Quit ||| Salir ||| Quitter ||| خروج ||| 退出
Accetto e continuo ||| Accept and continue ||| Aceptar y continuar ||| Accepter et continuer ||| أوافق وأتابع ||| 接受并继续
Playlist salvate ||| Saved playlists ||| Playlists guardadas ||| Playlists enregistrées ||| قوائم التشغيل المحفوظة ||| 已保存的播放列表
Illimitate ||| Unlimited ||| Ilimitadas ||| Illimitées ||| غير محدودة ||| 不限
Profili (preferiti e cronologia separati) ||| Profiles (separate favorites and history) ||| Perfiles (favoritos e historial separados) ||| Profils (favoris et historique séparés) ||| الملفات الشخصية (مفضلة وسجل منفصلان) ||| 用户档案（收藏和历史记录相互独立）
Fino a {n} ||| Up to {n} ||| Hasta {n} ||| Jusqu'à {n} ||| حتى {n} ||| 最多 {n}
Preferiti ||| Favorites ||| Favoritos ||| Favoris ||| المفضلة ||| 收藏
Illimitati ||| Unlimited ||| Ilimitados ||| Illimités ||| غير محدودة ||| 不限
Cronologia e "riprendi da dove eri" ||| History and "resume where you left off" ||| Historial y «continuar donde lo dejaste» ||| Historique et « reprendre où vous en étiez » ||| السجل و«المتابعة من حيث توقفت» ||| 历史记录与“从上次位置继续”
Ultimi {n} ||| Last {n} ||| Últimos {n} ||| {n} derniers ||| آخر {n} ||| 最近 {n} 个
Completa ||| Full ||| Completo ||| Complet ||| كامل ||| 完整
Categorie nascoste ||| Hidden categories ||| Categorías ocultas ||| Catégories masquées ||| الفئات المخفية ||| 隐藏的分类
Guida TV: in onda ora e a seguire ||| TV guide: on now and next ||| Guía TV: en emisión y a continuación ||| Guide TV : en cours et à suivre ||| دليل التلفاز: ما يُعرض الآن والتالي ||| 电视指南：正在播出和接下来
Controllo parentale con PIN ||| Parental control with PIN ||| Control parental con PIN ||| Contrôle parental avec code PIN ||| الرقابة الأبوية برمز PIN ||| PIN 家长控制
Episodio successivo automatico ||| Automatic next episode ||| Episodio siguiente automático ||| Épisode suivant automatique ||| الحلقة التالية تلقائيًا ||| 自动播放下一集
Conversione automatica dei formati non supportati ||| Automatic conversion of unsupported formats ||| Conversión automática de formatos no compatibles ||| Conversion automatique des formats non pris en charge ||| تحويل تلقائي للصيغ غير المدعومة ||| 自动转换不支持的格式
Temi colore ||| Color themes ||| Temas de color ||| Thèmes de couleur ||| سمات الألوان ||| 颜色主题
Backup e ripristino ||| Backup and restore ||| Copia de seguridad y restauración ||| Sauvegarde et restauration ||| النسخ الاحتياطي والاستعادة ||| 备份与恢复
Aggiornamenti futuri ||| Future updates ||| Actualizaciones futuras ||| Mises à jour futures ||| التحديثات المستقبلية ||| 后续更新
Grazie per il tuo supporto ||| Thank you for your support ||| Gracias por tu apoyo ||| Merci pour votre soutien ||| شكرًا على دعمك ||| 感谢你的支持
Sipario Premium ||| Sipario Premium ||| Sipario Premium ||| Sipario Premium ||| Sipario Premium ||| Sipario Premium
La tua licenza è attiva. ||| Your license is active. ||| Tu licencia está activa. ||| Votre licence est active. ||| ترخيصك فعّال. ||| 你的许可证已激活。
Stai usando la prova gratuita: {n} giorni rimasti. ||| You are using the free trial: {n} days left. ||| Estás usando la prueba gratuita: quedan {n} días. ||| Vous utilisez l'essai gratuit : {n} jours restants. ||| أنت تستخدم النسخة التجريبية المجانية: متبقّي {n} يومًا. ||| 你正在使用免费试用：剩余 {n} 天。
Sblocca tutto e goditi Sipario senza limiti. ||| Unlock everything and enjoy Sipario without limits. ||| Desbloquea todo y disfruta de Sipario sin límites. ||| Débloquez tout et profitez de Sipario sans limites. ||| افتح كل الميزات واستمتع بـ Sipario بلا حدود. ||| 解锁全部功能，畅享无限制的 Sipario。
Licenza attiva ||| License active ||| Licencia activa ||| Licence active ||| الترخيص فعّال ||| 许可证已激活
licenza a vita ||| lifetime license ||| licencia de por vida ||| licence à vie ||| ترخيص مدى الحياة ||| 终身许可证
scade il {d} ||| expires on {d} ||| caduca el {d} ||| expire le {d} ||| ينتهي في {d} ||| 到期日：{d}
Acquista la licenza ||| Buy the license ||| Comprar la licencia ||| Acheter la licence ||| اشترِ الترخيص ||| 购买许可证
Hai già una licenza? ||| Already have a license? ||| ¿Ya tienes una licencia? ||| Vous avez déjà une licence ? ||| هل لديك ترخيص بالفعل؟ ||| 已有许可证？
Incolla qui la tua licenza (SIPA1.…) ||| Paste your license here (SIPA1.…) ||| Pega aquí tu licencia (SIPA1.…) ||| Collez votre licence ici (SIPA1.…) ||| الصق ترخيصك هنا (SIPA1.…) ||| 在此粘贴你的许可证 (SIPA1.…)
Attiva ||| Activate ||| Activar ||| Activer ||| تفعيل ||| 激活
Codice dispositivo: ||| Device code: ||| Código del dispositivo: ||| Code de l'appareil : ||| رمز الجهاز: ||| 设备代码：
Copia ||| Copy ||| Copiar ||| Copier ||| نسخ ||| 复制
Indicalo al momento dell'acquisto: la licenza sarà legata a questo computer. ||| Provide it when you buy: the license will be tied to this computer. ||| Indícalo al comprar: la licencia quedará vinculada a este ordenador. ||| Indiquez-le lors de l'achat : la licence sera liée à cet ordinateur. ||| أدخله عند الشراء: سيُربط الترخيص بهذا الجهاز. ||| 购买时请提供：许可证将绑定到这台电脑。
Rimuovi la licenza da questo computer ||| Remove the license from this computer ||| Quitar la licencia de este ordenador ||| Retirer la licence de cet ordinateur ||| إزالة الترخيص من هذا الجهاز ||| 从这台电脑移除许可证
Rimuovere la licenza da questo computer? Per riattivarla ti servirà di nuovo la chiave. ||| Remove the license from this computer? You will need the key again to reactivate it. ||| ¿Quitar la licencia de este ordenador? Necesitarás la clave de nuevo para reactivarla. ||| Retirer la licence de cet ordinateur ? Vous aurez de nouveau besoin de la clé pour la réactiver. ||| إزالة الترخيص من هذا الجهاز؟ ستحتاج إلى المفتاح مجددًا لإعادة التفعيل. ||| 要从这台电脑移除许可证吗？重新激活时需要再次输入密钥。
Codice copiato ||| Code copied ||| Código copiado ||| Code copié ||| تم نسخ الرمز ||| 代码已复制
Licenza attivata. Grazie! ||| License activated. Thank you! ||| Licencia activada. ¡Gracias! ||| Licence activée. Merci ! ||| تم تفعيل الترخيص. شكرًا لك! ||| 许可证已激活。谢谢！
La conversione automatica dei formati non supportati è inclusa in Premium. ||| Automatic conversion of unsupported formats is included in Premium. ||| La conversión automática de formatos no compatibles está incluida en Premium. ||| La conversion automatique des formats non pris en charge est incluse dans Premium. ||| التحويل التلقائي للصيغ غير المدعومة متاح في Premium. ||| 自动转换不支持的格式包含在 Premium 中。
Con la versione Free puoi usare un solo profilo. ||| With the Free version you can use only one profile. ||| Con la versión Free solo puedes usar un perfil. ||| Avec la version Free, vous ne pouvez utiliser qu'un seul profil. ||| في النسخة المجانية يمكنك استخدام ملف شخصي واحد فقط. ||| 免费版只能使用一个用户档案。
I profili multipli sono inclusi in Premium: ognuno ha preferiti e cronologia propri. ||| Multiple profiles are included in Premium: each has its own favorites and history. ||| Los perfiles múltiples están incluidos en Premium: cada uno tiene sus propios favoritos e historial. ||| Les profils multiples sont inclus dans Premium : chacun a ses propres favoris et son historique. ||| الملفات الشخصية المتعددة متاحة في Premium: لكل ملف مفضلته وسجله. ||| 多用户档案包含在 Premium 中：每个档案都有各自的收藏和历史记录。
Hai raggiunto il numero massimo di profili. ||| You have reached the maximum number of profiles. ||| Has alcanzado el número máximo de perfiles. ||| Vous avez atteint le nombre maximal de profils. ||| لقد بلغتَ الحد الأقصى لعدد الملفات الشخصية. ||| 你已达到用户档案数量上限。
Con la versione Free puoi salvare una sola playlist. Con Premium ne aggiungi quante ne vuoi. ||| With the Free version you can save only one playlist. With Premium you can add as many as you like. ||| Con la versión Free solo puedes guardar una playlist. Con Premium añades las que quieras. ||| Avec la version Free, vous ne pouvez enregistrer qu'une seule playlist. Avec Premium, vous en ajoutez autant que vous voulez. ||| في النسخة المجانية يمكنك حفظ قائمة تشغيل واحدة فقط. مع Premium يمكنك إضافة ما تشاء. ||| 免费版只能保存一个播放列表。Premium 可添加任意数量。
Con la versione Free puoi usare una sola playlist. ||| With the Free version you can use only one playlist. ||| Con la versión Free solo puedes usar una playlist. ||| Avec la version Free, vous ne pouvez utiliser qu'une seule playlist. ||| في النسخة المجانية يمكنك استخدام قائمة تشغيل واحدة فقط. ||| 免费版只能使用一个播放列表。
I temi colore sono inclusi in Premium. ||| Color themes are included in Premium. ||| Los temas de color están incluidos en Premium. ||| Les thèmes de couleur sont inclus dans Premium. ||| سمات الألوان متاحة في Premium. ||| 颜色主题包含在 Premium 中。
Il controllo parentale con PIN è incluso in Premium. ||| Parental control with PIN is included in Premium. ||| El control parental con PIN está incluido en Premium. ||| Le contrôle parental par code PIN est inclus dans Premium. ||| الرقابة الأبوية برمز PIN متاحة في Premium. ||| PIN 家长控制包含在 Premium 中。
Backup e ripristino sono inclusi in Premium. ||| Backup and restore are included in Premium. ||| La copia de seguridad y la restauración están incluidas en Premium. ||| La sauvegarde et la restauration sont incluses dans Premium. ||| النسخ الاحتياطي والاستعادة متاحان في Premium. ||| 备份与恢复包含在 Premium 中。
Il timer di spegnimento è incluso in Premium. ||| The sleep timer is included in Premium. ||| El temporizador de apagado está incluido en Premium. ||| La minuterie d'arrêt est incluse dans Premium. ||| مؤقّت الإيقاف متاح في Premium. ||| 睡眠定时器包含在 Premium 中。
Con la Guida TV vedi cosa va in onda ora e cosa viene dopo, direttamente nel player. ||| With the TV guide you see what's on now and what's next, right in the player. ||| Con la Guía TV ves qué se emite ahora y qué viene después, directamente en el reproductor. ||| Avec le guide TV, vous voyez ce qui passe maintenant et ce qui suit, directement dans le lecteur. ||| مع دليل التلفاز ترى ما يُعرض الآن وما يليه، مباشرةً داخل المشغّل. ||| 通过电视指南，你可以直接在播放器中查看当前和接下来的节目。
Con la versione Free puoi nascondere fino a {n} categorie. Con Premium sono illimitate. ||| With the Free version you can hide up to {n} categories. With Premium it is unlimited. ||| Con la versión Free puedes ocultar hasta {n} categorías. Con Premium es ilimitado. ||| Avec la version Free, vous pouvez masquer jusqu'à {n} catégories. Avec Premium, c'est illimité. ||| في النسخة المجانية يمكنك إخفاء حتى {n} فئات. مع Premium بلا حدود. ||| 免费版最多可隐藏 {n} 个分类。Premium 不限数量。
Con la versione Free puoi salvare fino a {n} preferiti. Con Premium sono illimitati. ||| With the Free version you can save up to {n} favorites. With Premium it is unlimited. ||| Con la versión Free puedes guardar hasta {n} favoritos. Con Premium es ilimitado. ||| Avec la version Free, vous pouvez enregistrer jusqu'à {n} favoris. Avec Premium, c'est illimité. ||| في النسخة المجانية يمكنك حفظ حتى {n} عنصرًا مفضلًا. مع Premium بلا حدود. ||| 免费版最多可收藏 {n} 项。Premium 不限数量。
Limite playlist raggiunto: con Free puoi salvarne una sola. Togli la spunta "Ricorda" per usarla solo in questa sessione. ||| Playlist limit reached: with Free you can save only one. Untick "Remember" to use it for this session only. ||| Límite de playlists alcanzado: con Free solo puedes guardar una. Desmarca «Recordar» para usarla solo en esta sesión. ||| Limite de playlists atteinte : avec Free, vous ne pouvez en enregistrer qu'une. Décochez « Mémoriser » pour l'utiliser uniquement pour cette session. ||| تم بلوغ حد القوائم: في النسخة المجانية يمكنك حفظ قائمة واحدة فقط. ألغِ تحديد «تذكّر» لاستخدامها في هذه الجلسة فقط. ||| 已达到播放列表上限：免费版只能保存一个。取消勾选“记住”即可仅在本次使用。
Prova Premium · {n} g ||| Premium trial · {n} d ||| Prueba Premium · {n} d ||| Essai Premium · {n} j ||| تجربة Premium · {n} ي ||| Premium 试用 · {n} 天
Free · Passa a Premium ||| Free · Go Premium ||| Free · Pasa a Premium ||| Free · Passer à Premium ||| Free · انتقل إلى Premium ||| 免费版 · 升级 Premium
Prova Premium attiva: 1 giorno rimasto. ||| Premium trial active: 1 day left. ||| Prueba Premium activa: queda 1 día. ||| Essai Premium actif : 1 jour restant. ||| تجربة Premium فعّالة: متبقٍ يوم واحد. ||| Premium 试用中：剩余 1 天。
Prova Premium attiva: {n} giorni rimasti. ||| Premium trial active: {n} days left. ||| Prueba Premium activa: quedan {n} días. ||| Essai Premium actif : {n} jours restants. ||| تجربة Premium فعّالة: متبقّي {n} أيام. ||| Premium 试用中：剩余 {n} 天。
La prova Premium è terminata: Sipario è passato alla versione Free. ||| The Premium trial has ended: Sipario has switched to the Free version. ||| La prueba Premium ha terminado: Sipario ha pasado a la versión Free. ||| L'essai Premium est terminé : Sipario est passé à la version Free. ||| انتهت تجربة Premium: انتقل Sipario إلى النسخة المجانية. ||| Premium 试用已结束：Sipario 已切换为免费版。
Vedi cosa sblocca Premium ||| See what Premium unlocks ||| Mira lo que desbloquea Premium ||| Voir ce que Premium débloque ||| اطّلع على ما يفتحه Premium ||| 查看 Premium 解锁的内容
Profili ||| Profiles ||| Perfiles ||| Profils ||| الملفات الشخصية ||| 用户档案
Gestisci profili… ||| Manage profiles… ||| Gestionar perfiles… ||| Gérer les profils… ||| إدارة الملفات الشخصية… ||| 管理用户档案…
Playlist ||| Playlist ||| Playlist ||| Playlist ||| قائمة التشغيل ||| 播放列表
Aggiungi playlist ||| Add playlist ||| Añadir playlist ||| Ajouter une playlist ||| إضافة قائمة تشغيل ||| 添加播放列表
Licenza e Premium ||| License and Premium ||| Licencia y Premium ||| Licence et Premium ||| الترخيص وPremium ||| 许可证与 Premium
Aggiungi ||| Add ||| Añadir ||| Ajouter ||| إضافة ||| 添加
Fatto ||| Done ||| Hecho ||| Terminé ||| تم ||| 完成
Elimina profilo ||| Delete profile ||| Eliminar perfil ||| Supprimer le profil ||| حذف الملف الشخصي ||| 删除档案
Nome del nuovo profilo ||| New profile name ||| Nombre del nuevo perfil ||| Nom du nouveau profil ||| اسم الملف الشخصي الجديد ||| 新档案名称
Rinomina profilo ||| Rename profile ||| Renombrar perfil ||| Renommer le profil ||| إعادة تسمية الملف الشخصي ||| 重命名档案
Eliminare il profilo "{n}" con i suoi preferiti e la sua cronologia? ||| Delete the profile "{n}" with its favorites and history? ||| ¿Eliminar el perfil «{n}» con sus favoritos e historial? ||| Supprimer le profil « {n} » avec ses favoris et son historique ? ||| حذف الملف الشخصي «{n}» مع مفضلته وسجله؟ ||| 要删除档案“{n}”及其收藏和历史记录吗？
Rimuovere la playlist "{n}"? Preferiti e cronologia collegati verranno eliminati. ||| Remove the playlist "{n}"? Linked favorites and history will be deleted. ||| ¿Quitar la playlist «{n}»? Se eliminarán los favoritos y el historial asociados. ||| Retirer la playlist « {n} » ? Les favoris et l'historique associés seront supprimés. ||| إزالة القائمة «{n}»؟ سيتم حذف المفضلة والسجل المرتبطين بها. ||| 要移除播放列表“{n}”吗？相关的收藏和历史记录将被删除。
Verifica delle credenziali… ||| Checking credentials… ||| Verificando las credenciales… ||| Vérification des identifiants… ||| جارٍ التحقق من بيانات الدخول… ||| 正在验证凭据…
Caricamento del catalogo… con liste grandi può richiedere un minuto. ||| Loading the catalog… with large lists it can take a minute. ||| Cargando el catálogo… con listas grandes puede tardar un minuto. ||| Chargement du catalogue… avec de grandes listes, cela peut prendre une minute. ||| جارٍ تحميل الكتالوج… قد يستغرق دقيقة مع القوائم الكبيرة. ||| 正在加载目录…列表很大时可能需要一分钟。
Aggiornamento in corso… ||| Updating… ||| Actualizando… ||| Mise à jour en cours… ||| جارٍ التحديث… ||| 正在更新…
Catalogo aggiornato ||| Catalog updated ||| Catálogo actualizado ||| Catalogue mis à jour ||| تم تحديث الكتالوج ||| 目录已更新
Cronologia cancellata ||| History cleared ||| Historial borrado ||| Historique effacé ||| تم مسح السجل ||| 历史记录已清除
Cancellare tutta la cronologia di visione di questo profilo? ||| Clear the entire viewing history of this profile? ||| ¿Borrar todo el historial de reproducción de este perfil? ||| Effacer tout l'historique de visionnage de ce profil ? ||| مسح كل سجل المشاهدة لهذا الملف الشخصي؟ ||| 要清除此档案的全部观看记录吗？
Guarda ||| Watch ||| Ver ||| Regarder ||| شاهد ||| 观看
Nei preferiti ||| In favorites ||| En favoritos ||| Dans les favoris ||| في المفضلة ||| 已收藏
Aggiungi ai preferiti ||| Add to favorites ||| Añadir a favoritos ||| Ajouter aux favoris ||| أضف إلى المفضلة ||| 添加到收藏
Continua a guardare ||| Continue watching ||| Seguir viendo ||| Reprendre la lecture ||| تابع المشاهدة ||| 继续观看
I tuoi preferiti ||| Your favorites ||| Tus favoritos ||| Vos favoris ||| مفضلتك ||| 你的收藏
Film da scoprire ||| Movies to discover ||| Películas por descubrir ||| Films à découvrir ||| أفلام لتكتشفها ||| 发现电影
Serie da scoprire ||| Series to discover ||| Series por descubrir ||| Séries à découvrir ||| مسلسلات لتكتشفها ||| 发现剧集
Canali live ||| Live channels ||| Canales en vivo ||| Chaînes en direct ||| قنوات مباشرة ||| 直播频道
Riprendi da {t} ||| Resume from {t} ||| Continuar desde {t} ||| Reprendre à {t} ||| متابعة من {t} ||| 从 {t} 继续
Nascondi categoria ||| Hide category ||| Ocultar categoría ||| Masquer la catégorie ||| إخفاء الفئة ||| 隐藏分类
Categoria nascosta ||| Category hidden ||| Categoría oculta ||| Catégorie masquée ||| تم إخفاء الفئة ||| 分类已隐藏
Nessun contenuto visibile. Controlla le categorie nascoste nelle Impostazioni. ||| No visible content. Check the hidden categories in Settings. ||| No hay contenido visible. Revisa las categorías ocultas en Ajustes. ||| Aucun contenu visible. Vérifiez les catégories masquées dans les Paramètres. ||| لا يوجد محتوى ظاهر. تحقّق من الفئات المخفية في الإعدادات. ||| 没有可见内容。请在设置中检查已隐藏的分类。
Tutte le categorie ||| All categories ||| Todas las categorías ||| Toutes les catégories ||| كل الفئات ||| 全部分类
Nessuna categoria visibile in questa sezione. ||| No visible categories in this section. ||| No hay categorías visibles en esta sección. ||| Aucune catégorie visible dans cette section. ||| لا توجد فئات ظاهرة في هذا القسم. ||| 此栏目没有可见分类。
Ancora nessun preferito. Tocca la stella su un canale, film o serie per salvarlo qui. ||| No favorites yet. Tap the star on a channel, movie or series to save it here. ||| Aún no hay favoritos. Toca la estrella en un canal, película o serie para guardarlo aquí. ||| Pas encore de favoris. Touchez l'étoile sur une chaîne, un film ou une série pour l'enregistrer ici. ||| لا توجد عناصر مفضلة بعد. المس النجمة على قناة أو فيلم أو مسلسل لحفظه هنا. ||| 还没有收藏。点击频道、电影或剧集上的星标即可保存到这里。
Risultati per “{q}” ||| Results for “{q}” ||| Resultados para «{q}» ||| Résultats pour « {q} » ||| نتائج «{q}» ||| “{q}”的搜索结果
{n} risultati ||| {n} results ||| {n} resultados ||| {n} résultats ||| {n} نتيجة ||| {n} 条结果
Nessun risultato. Prova con meno parole o cambia “Solo qui” in “Ovunque”. ||| No results. Try fewer words or switch “Here only” to “Everywhere”. ||| Sin resultados. Prueba con menos palabras o cambia «Solo aquí» por «Todo». ||| Aucun résultat. Essayez avec moins de mots ou passez de « Ici seulement » à « Partout ». ||| لا نتائج. جرّب كلمات أقل أو غيّر «هنا فقط» إلى «في كل مكان». ||| 没有结果。请减少关键词，或将“仅此处”改为“全部”。
Aspetto ||| Appearance ||| Aspecto ||| Apparence ||| المظهر ||| 外观
Notte ||| Night ||| Noche ||| Nuit ||| ليل ||| 夜晚
Bosco ||| Forest ||| Bosque ||| Forêt ||| غابة ||| 森林
Rubino ||| Ruby ||| Rubí ||| Rubis ||| ياقوت ||| 红宝石
Categorie visibili ||| Visible categories ||| Categorías visibles ||| Catégories visibles ||| الفئات الظاهرة ||| 可见分类
Togli la spunta alle categorie che non vuoi vedere. Spariscono da navigazione, home e ricerca. ||| Untick the categories you don't want to see. They disappear from browsing, home and search. ||| Desmarca las categorías que no quieras ver. Desaparecen de la navegación, el inicio y la búsqueda. ||| Décochez les catégories que vous ne voulez pas voir. Elles disparaissent de la navigation, de l'accueil et de la recherche. ||| ألغِ تحديد الفئات التي لا تريد رؤيتها. ستختفي من التصفح والرئيسية والبحث. ||| 取消勾选你不想看到的分类。它们会从浏览、首页和搜索中消失。
Con Free puoi nasconderne fino a {n} (ora: {m}). ||| With Free you can hide up to {n} (now: {m}). ||| Con Free puedes ocultar hasta {n} (ahora: {m}). ||| Avec Free, vous pouvez en masquer jusqu'à {n} (actuellement : {m}). ||| في النسخة المجانية يمكنك إخفاء حتى {n} (الآن: {m}). ||| 免费版最多可隐藏 {n} 个（当前：{m}）。
Filtra categorie… ||| Filter categories… ||| Filtrar categorías… ||| Filtrer les catégories… ||| تصفية الفئات… ||| 筛选分类…
Mostra tutte ||| Show all ||| Mostrar todas ||| Tout afficher ||| إظهار الكل ||| 全部显示
Nascondi tutte ||| Hide all ||| Ocultar todas ||| Tout masquer ||| إخفاء الكل ||| 全部隐藏
Nessuna categoria ||| No categories ||| Sin categorías ||| Aucune catégorie ||| لا توجد فئات ||| 没有分类
Controllo parentale ||| Parental control ||| Control parental ||| Contrôle parental ||| الرقابة الأبوية ||| 家长控制
Proteggi intere categorie con un PIN: restano nascoste da home, ricerca e preferiti finché non le sblocchi. ||| Protect whole categories with a PIN: they stay hidden from home, search and favorites until you unlock them. ||| Protege categorías enteras con un PIN: permanecen ocultas en el inicio, la búsqueda y los favoritos hasta que las desbloqueas. ||| Protégez des catégories entières avec un code PIN : elles restent masquées de l'accueil, de la recherche et des favoris jusqu'à leur déverrouillage. ||| احمِ فئات كاملة برمز PIN: تبقى مخفية من الرئيسية والبحث والمفضلة حتى تفتحها. ||| 用 PIN 保护整个分类：解锁前，它们会从首页、搜索和收藏中隐藏。
Imposta PIN ||| Set PIN ||| Establecer PIN ||| Définir un PIN ||| تعيين PIN ||| 设置 PIN
Cambia PIN ||| Change PIN ||| Cambiar PIN ||| Changer le PIN ||| تغيير PIN ||| 更改 PIN
Rimuovi PIN ||| Remove PIN ||| Quitar PIN ||| Supprimer le PIN ||| إزالة PIN ||| 移除 PIN
Blocca di nuovo ||| Lock again ||| Bloquear de nuevo ||| Verrouiller à nouveau ||| أعد القفل ||| 重新锁定
Sblocca per questa sessione ||| Unlock for this session ||| Desbloquear en esta sesión ||| Déverrouiller pour cette session ||| افتح لهذه الجلسة ||| 本次会话解锁
Scegli le categorie da proteggere: ||| Choose the categories to protect: ||| Elige las categorías que proteger: ||| Choisissez les catégories à protéger : ||| اختر الفئات المراد حمايتها: ||| 选择要保护的分类：
Sblocca con il PIN per modificare le categorie protette. ||| Unlock with the PIN to change the protected categories. ||| Desbloquea con el PIN para modificar las categorías protegidas. ||| Déverrouillez avec le PIN pour modifier les catégories protégées. ||| افتح باستخدام PIN لتعديل الفئات المحمية. ||| 使用 PIN 解锁后才能修改受保护的分类。
in uso ||| in use ||| en uso ||| utilisée ||| قيد الاستخدام ||| 使用中
Usa ||| Use ||| Usar ||| Utiliser ||| استخدام ||| 使用
Rimuovi ||| Remove ||| Quitar ||| Retirer ||| إزالة ||| 移除
Nessuna playlist salvata. ||| No saved playlists. ||| No hay playlists guardadas. ||| Aucune playlist enregistrée. ||| لا توجد قوائم تشغيل محفوظة. ||| 没有已保存的播放列表。
Aggiorna catalogo ||| Refresh catalog ||| Actualizar catálogo ||| Actualiser le catalogue ||| تحديث الكتالوج ||| 刷新目录
attivo ||| active ||| activo ||| actif ||| نشط ||| 当前
Rinomina ||| Rename ||| Renombrar ||| Renommer ||| إعادة تسمية ||| 重命名
Elimina ||| Delete ||| Eliminar ||| Supprimer ||| حذف ||| 删除
Nuovo profilo ||| New profile ||| Nuevo perfil ||| Nouveau profil ||| ملف شخصي جديد ||| 新建档案
Backup ||| Backup ||| Copia de seguridad ||| Sauvegarde ||| نسخ احتياطي ||| 备份
Esporta o ripristina preferiti, categorie nascoste e cronologia del profilo attivo. ||| Export or restore favorites, hidden categories and history of the active profile. ||| Exporta o restaura favoritos, categorías ocultas e historial del perfil activo. ||| Exportez ou restaurez les favoris, catégories masquées et l'historique du profil actif. ||| صدّر أو استعد المفضلة والفئات المخفية وسجل الملف الشخصي النشط. ||| 导出或恢复当前档案的收藏、隐藏分类和历史记录。
Esporta backup ||| Export backup ||| Exportar copia ||| Exporter la sauvegarde ||| تصدير نسخة احتياطية ||| 导出备份
Importa backup ||| Import backup ||| Importar copia ||| Importer une sauvegarde ||| استيراد نسخة احتياطية ||| 导入备份
Cancella cronologia ||| Clear history ||| Borrar historial ||| Effacer l'historique ||| مسح السجل ||| 清除历史记录
Premium attivo ||| Premium active ||| Premium activo ||| Premium actif ||| Premium فعّال ||| Premium 已激活
Prova Premium: {n} giorni rimasti ||| Premium trial: {n} days left ||| Prueba Premium: quedan {n} días ||| Essai Premium : {n} jours restants ||| تجربة Premium: متبقّي {n} أيام ||| Premium 试用：剩余 {n} 天
Versione Free ||| Free version ||| Versión Free ||| Version Free ||| النسخة المجانية ||| 免费版
Dettagli licenza ||| License details ||| Detalles de la licencia ||| Détails de la licence ||| تفاصيل الترخيص ||| 许可证详情
Passa a Premium ||| Go Premium ||| Pasa a Premium ||| Passer à Premium ||| انتقل إلى Premium ||| 升级到 Premium
Informazioni ||| About ||| Información ||| À propos ||| معلومات ||| 关于
Sipario {v} · {c} canali, {m} film, {s} serie ||| Sipario {v} · {c} channels, {m} movies, {s} series ||| Sipario {v} · {c} canales, {m} películas, {s} series ||| Sipario {v} · {c} chaînes, {m} films, {s} séries ||| Sipario {v} · {c} قناة، {m} فيلم، {s} مسلسل ||| Sipario {v} · {c} 个频道，{m} 部电影，{s} 部剧集
conversione video: ffmpeg rilevato ||| video conversion: ffmpeg detected ||| conversión de vídeo: ffmpeg detectado ||| conversion vidéo : ffmpeg détecté ||| تحويل الفيديو: تم اكتشاف ffmpeg ||| 视频转换：已检测到 ffmpeg
conversione video: ffmpeg non installato (facoltativo) ||| video conversion: ffmpeg not installed (optional) ||| conversión de vídeo: ffmpeg no instalado (opcional) ||| conversion vidéo : ffmpeg non installé (facultatif) ||| تحويل الفيديو: ffmpeg غير مثبّت (اختياري) ||| 视频转换：未安装 ffmpeg（可选）
Assistenza: {e} ||| Support: {e} ||| Asistencia: {e} ||| Assistance : {e} ||| الدعم: {e} ||| 支持：{e}
Esci dalla playlist ||| Leave playlist ||| Salir de la playlist ||| Quitter la playlist ||| الخروج من القائمة ||| 退出播放列表
Inserisci il PIN ||| Enter the PIN ||| Introduce el PIN ||| Saisissez le PIN ||| أدخل رمز PIN ||| 输入 PIN
Prima conferma il PIN attuale ||| First confirm the current PIN ||| Primero confirma el PIN actual ||| Confirmez d'abord le PIN actuel ||| أكّد رمز PIN الحالي أولًا ||| 请先确认当前 PIN
PIN errato ||| Wrong PIN ||| PIN incorrecto ||| PIN incorrect ||| رمز PIN غير صحيح ||| PIN 错误
Scegli un PIN ||| Choose a PIN ||| Elige un PIN ||| Choisissez un PIN ||| اختر رمز PIN ||| 选择一个 PIN
Da 4 a 8 cifre ||| 4 to 8 digits ||| De 4 a 8 cifras ||| De 4 à 8 chiffres ||| من 4 إلى 8 أرقام ||| 4 到 8 位数字
Il PIN deve avere da 4 a 8 cifre ||| The PIN must have 4 to 8 digits ||| El PIN debe tener de 4 a 8 cifras ||| Le PIN doit comporter de 4 à 8 chiffres ||| يجب أن يتكوّن PIN من 4 إلى 8 أرقام ||| PIN 必须为 4 到 8 位数字
Ripeti il PIN ||| Repeat the PIN ||| Repite el PIN ||| Répétez le PIN ||| أعد إدخال رمز PIN ||| 再次输入 PIN
I due PIN non coincidono ||| The two PINs don't match ||| Los dos PIN no coinciden ||| Les deux PIN ne correspondent pas ||| رمزا PIN غير متطابقين ||| 两次输入的 PIN 不一致
PIN impostato ||| PIN set ||| PIN establecido ||| PIN défini ||| تم تعيين PIN ||| PIN 已设置
Categorie sbloccate per questa sessione ||| Categories unlocked for this session ||| Categorías desbloqueadas en esta sesión ||| Catégories déverrouillées pour cette session ||| تم فتح الفئات لهذه الجلسة ||| 本次会话已解锁分类
Backup salvato ||| Backup saved ||| Copia guardada ||| Sauvegarde enregistrée ||| تم حفظ النسخة الاحتياطية ||| 备份已保存
Backup ripristinato ||| Backup restored ||| Copia restaurada ||| Sauvegarde restaurée ||| تمت استعادة النسخة الاحتياطية ||| 备份已恢复
File di backup non valido ||| Invalid backup file ||| Archivo de copia no válido ||| Fichier de sauvegarde invalide ||| ملف النسخة الاحتياطية غير صالح ||| 备份文件无效
Rimosso dai preferiti ||| Removed from favorites ||| Quitado de favoritos ||| Retiré des favoris ||| تمت الإزالة من المفضلة ||| 已取消收藏
Aggiunto ai preferiti ||| Added to favorites ||| Añadido a favoritos ||| Ajouté aux favoris ||| تمت الإضافة إلى المفضلة ||| 已添加到收藏
Nessun episodio disponibile per questa serie. ||| No episodes available for this series. ||| No hay episodios disponibles para esta serie. ||| Aucun épisode disponible pour cette série. ||| لا توجد حلقات متاحة لهذا المسلسل. ||| 此剧集没有可用的剧集。
Riproduci ||| Play ||| Reproducir ||| Lire ||| تشغيل ||| 播放
Ricomincia dall'inizio ||| Start over ||| Empezar de nuevo ||| Recommencer du début ||| ابدأ من البداية ||| 从头开始
Dall'inizio ||| From the start ||| Desde el principio ||| Depuis le début ||| من البداية ||| 从头开始
Carico stagioni ed episodi… ||| Loading seasons and episodes… ||| Cargando temporadas y episodios… ||| Chargement des saisons et épisodes… ||| جارٍ تحميل المواسم والحلقات… ||| 正在加载季和剧集…
Riprendi S{s}·E{e} da {t} ||| Resume S{s}·E{e} from {t} ||| Continuar T{s}·E{e} desde {t} ||| Reprendre S{s}·E{e} à {t} ||| متابعة م{s}·ح{e} من {t} ||| 从 {t} 继续第{s}季第{e}集
Prossimo episodio: S{s}·E{e} ||| Next episode: S{s}·E{e} ||| Siguiente episodio: T{s}·E{e} ||| Épisode suivant : S{s}·E{e} ||| الحلقة التالية: م{s}·ح{e} ||| 下一集：第{s}季第{e}集
Inizia dalla prima puntata ||| Start from the first episode ||| Empezar desde el primer episodio ||| Commencer au premier épisode ||| ابدأ من الحلقة الأولى ||| 从第一集开始
Ricomincia la serie da capo ||| Restart the series from the beginning ||| Reiniciar la serie desde el principio ||| Recommencer la série depuis le début ||| أعد المسلسل من البداية ||| 从头重新观看此剧集
Episodi ||| Episodes ||| Episodios ||| Épisodes ||| الحلقات ||| 剧集
Stagione ||| Season ||| Temporada ||| Saison ||| الموسم ||| 季
Stagione {n} ||| Season {n} ||| Temporada {n} ||| Saison {n} ||| الموسم {n} ||| 第 {n} 季
Episodio {n} ||| Episode {n} ||| Episodio {n} ||| Épisode {n} ||| الحلقة {n} ||| 第 {n} 集
Visto ||| Watched ||| Visto ||| Vu ||| تمت المشاهدة ||| 已看
Provo un metodo alternativo… ||| Trying an alternative method… ||| Probando un método alternativo… ||| Essai d'une autre méthode… ||| جارٍ تجربة طريقة بديلة… ||| 正在尝试其他方式…
Il canale non risponde ||| The channel is not responding ||| El canal no responde ||| La chaîne ne répond pas ||| القناة لا تستجيب ||| 频道没有响应
Impossibile riprodurre questo video ||| Unable to play this video ||| No se puede reproducir este vídeo ||| Impossible de lire cette vidéo ||| تعذّر تشغيل هذا الفيديو ||| 无法播放此视频
Il canale potrebbe essere offline, il tuo abbonamento potrebbe aver raggiunto il numero massimo di connessioni contemporanee (chiudi altre app IPTV e riprova), oppure usa un formato che questo lettore non decodifica (ad esempio HEVC o audio AC3/E-AC3). ||| The channel may be offline, your subscription may have reached its maximum number of simultaneous connections (close other IPTV apps and try again), or it uses a format this player can't decode (for example HEVC or AC3/E-AC3 audio). ||| Puede que el canal esté fuera de línea, que tu suscripción haya alcanzado el máximo de conexiones simultáneas (cierra otras apps IPTV y reinténtalo) o que use un formato que este reproductor no decodifica (por ejemplo HEVC o audio AC3/E-AC3). ||| La chaîne est peut-être hors ligne, votre abonnement a peut-être atteint le nombre maximal de connexions simultanées (fermez les autres applications IPTV et réessayez), ou elle utilise un format que ce lecteur ne décode pas (par exemple HEVC ou audio AC3/E-AC3). ||| قد تكون القناة غير متصلة، أو بلغ اشتراكك الحد الأقصى للاتصالات المتزامنة (أغلق تطبيقات IPTV الأخرى وأعد المحاولة)، أو تستخدم صيغة لا يفكّ هذا المشغّل ترميزها (مثل HEVC أو صوت AC3/E-AC3). ||| 频道可能已离线；你的订阅可能已达到同时连接数上限（请关闭其他 IPTV 应用后重试）；或者它使用了此播放器无法解码的格式（例如 HEVC 或 AC3/E-AC3 音频）。
Il formato o il codec (ad esempio HEVC o MKV con audio particolari) potrebbe non essere supportato dal browser. ||| The format or codec (for example HEVC or MKV with special audio) may not be supported by the browser. ||| Puede que el navegador no admita el formato o códec (por ejemplo HEVC o MKV con audio especial). ||| Le format ou le codec (par exemple HEVC ou MKV avec un audio particulier) n'est peut-être pas pris en charge par le navigateur. ||| قد لا يدعم المتصفح هذه الصيغة أو المرمّز (مثل HEVC أو MKV بصوت خاص). ||| 浏览器可能不支持该格式或编解码器（例如 HEVC 或带特殊音频的 MKV）。
Per la conversione automatica installa ffmpeg e riavvia Sipario. ||| For automatic conversion, install ffmpeg and restart Sipario. ||| Para la conversión automática, instala ffmpeg y reinicia Sipario. ||| Pour la conversion automatique, installez ffmpeg et redémarrez Sipario. ||| للتحويل التلقائي، ثبّت ffmpeg ثم أعد تشغيل Sipario. ||| 如需自动转换，请安装 ffmpeg 并重启 Sipario。
Può anche essere un problema temporaneo del server. ||| It may also be a temporary server problem. ||| También puede ser un problema temporal del servidor. ||| Il peut aussi s'agir d'un problème temporaire du serveur. ||| وقد تكون أيضًا مشكلة مؤقتة في الخادم. ||| 也可能是服务器的暂时性问题。
Dettagli tecnici: ||| Technical details: ||| Detalles técnicos: ||| Détails techniques : ||| التفاصيل التقنية: ||| 技术详情：
Prossimo: {l} tra {s}s ||| Next: {l} in {s}s ||| Siguiente: {l} en {s}s ||| Suivant : {l} dans {s}s ||| التالي: {l} خلال {s} ث ||| 下一集：{l}，{s} 秒后
Prossimo: {l}  ·  Riproduzione automatica: Premium ||| Next: {l}  ·  Autoplay: Premium ||| Siguiente: {l}  ·  Reproducción automática: Premium ||| Suivant : {l}  ·  Lecture automatique : Premium ||| التالي: {l}  ·  التشغيل التلقائي: Premium ||| 下一集：{l}  ·  自动播放：Premium
Guida TV · Premium ||| TV guide · Premium ||| Guía TV · Premium ||| Guide TV · Premium ||| دليل التلفاز · Premium ||| 电视指南 · Premium
Guida TV… ||| TV guide… ||| Guía TV… ||| Guide TV… ||| دليل التلفاز… ||| 电视指南…
Ora ||| Now ||| Ahora ||| Maintenant ||| الآن ||| 现在
Dopo ||| Next ||| Después ||| Ensuite ||| لاحقًا ||| 接下来
Guida non disponibile per questo canale ||| Guide not available for this channel ||| Guía no disponible para este canal ||| Guide non disponible pour cette chaîne ||| الدليل غير متاح لهذه القناة ||| 此频道没有可用指南
Guida non disponibile ||| Guide not available ||| Guía no disponible ||| Guide non disponible ||| الدليل غير متاح ||| 指南不可用
Timer impostato: {m} minuti ||| Timer set: {m} minutes ||| Temporizador: {m} minutos ||| Minuterie : {m} minutes ||| تم ضبط المؤقّت: {m} دقيقة ||| 已设置定时：{m} 分钟
Timer disattivato ||| Timer off ||| Temporizador desactivado ||| Minuterie désactivée ||| تم إيقاف المؤقّت ||| 定时已关闭
Timer di spegnimento: riproduzione fermata ||| Sleep timer: playback stopped ||| Temporizador de apagado: reproducción detenida ||| Minuterie d'arrêt : lecture arrêtée ||| مؤقّت الإيقاف: تم إيقاف التشغيل ||| 睡眠定时器：播放已停止
È disponibile Sipario {v}. ||| Sipario {v} is available. ||| Sipario {v} está disponible. ||| Sipario {v} est disponible. ||| الإصدار {v} من Sipario متاح. ||| Sipario {v} 现已推出。
Scarica ||| Download ||| Descargar ||| Télécharger ||| تنزيل ||| 下载
Io ||| Me ||| Yo ||| Moi ||| أنا ||| 我
`;

let lang = 'it';
const MAPS = {}; ORDER.forEach((c) => { MAPS[c] = new Map(); });
ROWS.split('\n').forEach((line) => {
  if (!line.trim()) return;
  const f = line.split(' ||| ').map((x) => x.trim());
  if (f.length !== 6) { if (typeof console !== 'undefined') console.warn('[i18n] riga malformata:', line.slice(0, 60)); return; }
  ORDER.forEach((c, i) => { if (!MAPS[c].has(f[0])) MAPS[c].set(f[0], f[i + 1]); });
});

function fill(s, p) { return p ? s.replace(/\{(\w+)\}/g, (_, k) => (p[k] === undefined ? '' : p[k])) : s; }
function tr(s, p) { const m = MAPS[lang]; return fill((m && m.get(s)) || s, p); }

/* testo con eventuali simboli iniziali/finali (★ ▶ ↺ + ← 🔒 ✓ · ×) che non vanno tradotti */
const SPLIT = /^([\s★☆▶↺+←🔒✓·×]*)([\s\S]*?)([\s🔒✓·]*)$/u;
function trText(raw) {
  const m = MAPS[lang]; if (!m) return null;
  const parts = raw.match(SPLIT); if (!parts) return null;
  const core = parts[2].replace(/\s+/g, ' ');
  if (!core) return null;
  const t2 = m.get(core);
  return t2 === undefined ? null : parts[1] + t2 + parts[3];
}

/* ---- DOM ---- */
const SKIP = '.card,.hero-in h1,.m-head h2,.et b,#ptitle,.list-row .grow,script,style,textarea,.legal';
const ATTRS = ['placeholder', 'title', 'aria-label'];
const TORIG = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const AORIG = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

function doText(n) {
  const has = TORIG.has(n); const orig = has ? TORIG.get(n) : n.nodeValue;
  if (lang === 'it') { if (has && n.nodeValue !== orig) n.nodeValue = orig; return; }
  const r = trText(orig);
  if (r !== null) { if (!has) TORIG.set(n, orig); if (n.nodeValue !== r) n.nodeValue = r; }
}
function doAttrs(el) {
  for (const a of ATTRS) {
    if (!el.hasAttribute || !el.hasAttribute(a)) continue;
    let o = AORIG.get(el); if (!o) { o = {}; AORIG.set(el, o); }
    const orig = o[a] !== undefined ? o[a] : el.getAttribute(a);
    if (lang === 'it') { if (o[a] !== undefined) el.setAttribute(a, o[a]); continue; }
    const r = trText(orig);
    if (r !== null) { if (o[a] === undefined) o[a] = orig; if (el.getAttribute(a) !== r) el.setAttribute(a, r); }
  }
}
function translateTree(root) {
  if (!root || typeof document === 'undefined') return;
  if (root.nodeType === 3) return doText(root);
  if (root.nodeType !== 1 || (root.matches && root.matches(SKIP))) return;
  doAttrs(root);
  const w = document.createTreeWalker(root, 1 | 4, {
    acceptNode(n) {
      if (n.nodeType === 1) { if (n.matches(SKIP)) return 2; doAttrs(n); return 3; }
      return 1;
    }
  });
  let n; while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); }
}

const listeners = [];
function fillSelects() {
  document.querySelectorAll('select.langsel').forEach((s) => {
    if (!s.options.length) s.innerHTML = LANGS.map(([c, n]) => `<option value="${c}">${n}</option>`).join('');
    s.value = lang;
  });
}
function setLang(code, silent) {
  if (!META[code]) code = 'en';
  lang = code;
  try { localStorage.setItem('sipario:lang', code); } catch (e) { /* ignore */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
    document.documentElement.dir = META[code].rtl ? 'rtl' : 'ltr';
    translateTree(document.body); fillSelects();
    if (!silent) listeners.forEach((f) => f(code));
  }
}
function detect() {
  let c = null; try { c = localStorage.getItem('sipario:lang'); } catch (e) { /* ignore */ }
  if (c && META[c]) return c;
  const n = ((typeof navigator !== 'undefined' && navigator.language) || 'it').slice(0, 2).toLowerCase();
  return META[n] ? n : 'en';
}

const api = { LANGS, tr, trText, lang: () => lang, locale: () => META[lang].loc, setLang, detect, fillSelects, translateTree, onChange: (f) => listeners.push(f), _MAPS: MAPS };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') {
  window.SI18N = api;
  fillSelects();
  setLang(detect(), true);
  new MutationObserver((muts) => {
    if (lang === 'it') return;
    for (const m of muts) m.addedNodes.forEach((n) => translateTree(n));
  }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('change', (e) => { const s = e.target.closest && e.target.closest('select.langsel'); if (s) setLang(s.value); });
}
})();
