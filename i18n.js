/* ระบบหลายภาษา (TH / EN / VN / LA / IN / BR)
   ภาษาต้นฉบับของเว็บคือลาว: ตารางด้านล่างใช้ "ข้อความลาว" เป็นคีย์ แล้วแทนที่ข้อความบนหน้าเว็บตามภาษาที่เลือก
   - ครอบคลุมข้อความที่มีอยู่ในหน้า และข้อความที่ JavaScript สร้างทีหลัง (ใช้ MutationObserver)
   - ข้อความที่ไม่มีในตาราง (เช่นชื่อสินค้าเฉพาะ) จะคงเดิม
   เพิ่มข้อความใหม่: ใส่คีย์ลาว + คำแปลตามลำดับ [th, en, vi, hi, pt] */
(function () {
  const ORDER = ['th', 'en', 'vi', 'hi', 'pt'];
  const D = {
"ຮ້ານບໍລິການຈຳໜ່າຍໂປຣແກຣມຊ່ວຍຫຼິ້ນ Fivem / ປົດແບນ Fivem ຈຳໜ່າຍໂປຣແກຣມຊ່ວຍຫຼິ້ນ Rov / Valorant / Pugb ແລະ ເກມອື່ນໆ Account Social / App Premium ອື່ນໆ ຕອບໂຈດທຸກການນຳໃຊ້": [
"ร้านบริการจำหน่ายโปรแกรมช่วยเล่น Fivem / ปลดแบน Fivem จำหน่ายโปรแกรมช่วยเล่น Rov / Valorant / Pugb และเกมอื่นๆ Account Social / App Premium อื่นๆ ตอบโจทย์ทุกการใช้งาน",
"Store for Fivem game helper software / Fivem unbans, helper software for Rov / Valorant / PUBG and other games, Social accounts / Premium apps and more, made for every need.",
"Cửa hàng phần mềm hỗ trợ chơi Fivem / gỡ ban Fivem, phần mềm hỗ trợ Rov / Valorant / PUBG và các game khác, tài khoản Social / ứng dụng Premium và hơn thế nữa, đáp ứng mọi nhu cầu.",
"Fivem गेम हेल्पर सॉफ़्टवेयर / Fivem अनबैन, Rov / Valorant / PUBG और अन्य गेम्स के हेल्पर सॉफ़्टवेयर, Social अकाउंट / Premium ऐप और भी बहुत कुछ, हर ज़रूरत के लिए।",
"Loja de softwares auxiliares para Fivem / remoção de ban no Fivem, auxiliares para Rov / Valorant / PUBG e outros jogos, contas Social / apps Premium e mais, para todas as necessidades."
],
"ໃສ່ໃຈໃນຄຸນນະພາບຂອງສິນຄ້າ ແລະ ການບໍລິການ ດ້ວຍລະບົບຮັກສາຄວາມປອດໄພທີ່ທັນສະໄໝ ພ້ອມການບໍລິການທີ່ວ່ອງໄວ ແລະ ເຊື່ອຖືໄດ້ຕະຫຼອດ 24 ຊົ່ວໂມງ": [
"ใส่ใจในคุณภาพของสินค้าและการบริการ ด้วยระบบรักษาความปลอดภัยที่ทันสมัย พร้อมการบริการที่รวดเร็วและเชื่อถือได้ตลอด 24 ชั่วโมง",
"We care about the quality of our products and service, with modern security and fast, reliable support 24 hours a day.",
"Chúng tôi chú trọng chất lượng sản phẩm và dịch vụ, với hệ thống bảo mật hiện đại cùng dịch vụ nhanh chóng, đáng tin cậy 24 giờ mỗi ngày.",
"हम उत्पाद और सेवा की गुणवत्ता का ध्यान रखते हैं, आधुनिक सुरक्षा प्रणाली और 24 घंटे तेज़, भरोसेमंद सेवा के साथ।",
"Cuidamos da qualidade dos produtos e do atendimento, com segurança moderna e suporte rápido e confiável 24 horas por dia."
],
"ທີມງານມືອາຊີບພ້ອມໃຫ້ຄຳປຶກສາ ແລະ ແກ້ໄຂບັນຫາຕະຫຼອດ 24 ຊົ່ວໂມງ ດ້ວຍໃຈທີ່ໃສ່ໃຈທຸກລາຍລະອຽດ ເພື່ອຄວາມພໍໃຈສູງສຸດຂອງລູກຄ້າ": [
"ทีมงานมืออาชีพพร้อมให้คำปรึกษาและแก้ไขปัญหาตลอด 24 ชั่วโมง ด้วยใจที่ใส่ใจทุกรายละเอียด เพื่อความพึงพอใจสูงสุดของลูกค้า",
"A professional team ready to advise and solve problems 24 hours a day, caring about every detail for maximum customer satisfaction.",
"Đội ngũ chuyên nghiệp sẵn sàng tư vấn và xử lý vấn đề 24 giờ mỗi ngày, quan tâm từng chi tiết để khách hàng hài lòng nhất.",
"पेशेवर टीम 24 घंटे सलाह देने और समस्याएँ सुलझाने के लिए तैयार है, हर बारीकी पर ध्यान के साथ, ताकि ग्राहक पूरी तरह संतुष्ट रहें।",
"Equipe profissional pronta para orientar e resolver problemas 24 horas por dia, atenta a cada detalhe para a máxima satisfação do cliente."
],
"ຍັງບໍ່ເປີດໃຫ້ໃຊ້ງານໃນຕອນນີ້ ກຳລັງລໍຖ້າການປັບປຸງ ແລະ ອັບເດດໃນອະນາຄົດ ເມື່ອພ້ອມຈະເປີດໃຫ້ເຂົ້າສູ່ລະບົບດ້ວຍ Discord ທັນທີ": [
"ยังไม่เปิดให้ใช้งานตอนนี้ กำลังรอการปรับปรุงและอัปเดตในอนาคต เมื่อพร้อมจะเปิดให้เข้าสู่ระบบด้วย Discord ได้ทันที",
"Not available yet. It's waiting for improvements and a future update. Once ready, you'll be able to sign in with Discord right away.",
"Hiện chưa mở. Đang chờ cải tiến và cập nhật trong tương lai. Khi sẵn sàng sẽ cho đăng nhập bằng Discord ngay.",
"अभी उपलब्ध नहीं है। सुधार और भविष्य के अपडेट का इंतज़ार है। तैयार होते ही Discord से लॉगिन शुरू हो जाएगा।",
"Ainda não disponível. Aguardando melhorias e uma atualização futura. Quando estiver pronto, você poderá entrar com o Discord na hora."
],
"ໂໝດທົດລອງ: ຂໍ້ມູນຖືກຮູບແບບ ແຕ່ຍັງບໍ່ໄດ້ເຊື່ອມລະບົບຫຼັງບ້ານ ຈຶ່ງຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ": [
"โหมดทดลอง: ข้อมูลถูกรูปแบบ แต่ยังไม่ได้เชื่อมระบบหลังบ้าน จึงยังไม่ได้เข้าสู่ระบบ",
"Demo mode: the data is valid, but the backend isn't connected yet, so you haven't been signed in.",
"Chế độ thử nghiệm: dữ liệu hợp lệ nhưng chưa kết nối hệ thống backend nên chưa đăng nhập.",
"डेमो मोड: डेटा सही फ़ॉर्मेट में है, लेकिन बैकएंड अभी जुड़ा नहीं है, इसलिए लॉगिन नहीं हुआ।",
"Modo de teste: os dados estão válidos, mas o back-end ainda não está conectado, então você não entrou."
],
"ໂໝດທົດລອງ: ຂໍ້ມູນຖືກຮູບແບບ ແຕ່ຍັງບໍ່ໄດ້ເຊື່ອມລະບົບຫຼັງບ້ານ ຈຶ່ງຍັງບໍ່ໄດ້ສ້າງບັນຊີ": [
"โหมดทดลอง: ข้อมูลถูกรูปแบบ แต่ยังไม่ได้เชื่อมระบบหลังบ้าน จึงยังไม่ได้สร้างบัญชี",
"Demo mode: the data is valid, but the backend isn't connected yet, so no account was created.",
"Chế độ thử nghiệm: dữ liệu hợp lệ nhưng chưa kết nối hệ thống backend nên chưa tạo tài khoản.",
"डेमो मोड: डेटा सही फ़ॉर्मेट में है, लेकिन बैकएंड अभी जुड़ा नहीं है, इसलिए खाता नहीं बना।",
"Modo de teste: os dados estão válidos, mas o back-end ainda não está conectado, então a conta não foi criada."
],
"ໂໝດທົດລອງ: ຍັງບໍ່ໄດ້ເຊື່ອມ Google Sign-In ຈຶ່ງຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ": [
"โหมดทดลอง: ยังไม่ได้เชื่อม Google Sign-In จึงยังไม่ได้เข้าสู่ระบบ",
"Demo mode: Google Sign-In isn't connected yet, so you haven't been signed in.",
"Chế độ thử nghiệm: chưa kết nối Google Sign-In nên chưa đăng nhập.",
"डेमो मोड: Google Sign-In अभी जुड़ा नहीं है, इसलिए लॉगिन नहीं हुआ।",
"Modo de teste: o Google Sign-In ainda não está conectado, então você não entrou."
],
"ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ": [
"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
"Incorrect username or password",
"Tên người dùng hoặc mật khẩu không đúng",
"यूज़रनेम या पासवर्ड गलत है",
"Usuário ou senha incorretos"
],
"ສະໝັກບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່": [
"สมัครไม่สำเร็จ กรุณาลองใหม่",
"Sign-up failed. Please try again",
"Đăng ký không thành công, vui lòng thử lại",
"साइन अप नहीं हो सका, कृपया फिर कोशिश करें",
"Não foi possível cadastrar, tente novamente"
],
"ຊື່ຜູ້ໃຊ້ 3–20 ຕົວ (a-z, 0-9, _)": [
"ชื่อผู้ใช้ 3–20 ตัว (a-z, 0-9, _)",
"Username: 3–20 characters (a-z, 0-9, _)",
"Tên người dùng 3–20 ký tự (a-z, 0-9, _)",
"यूज़रनेम 3–20 अक्षर (a-z, 0-9, _)",
"Usuário: 3–20 caracteres (a-z, 0-9, _)"
],
"ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ": [
"รูปแบบอีเมลไม่ถูกต้อง",
"Invalid email format",
"Định dạng email không hợp lệ",
"ईमेल का फ़ॉर्मेट सही नहीं है",
"Formato de e-mail inválido"
],
"ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ": [
"รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
"Password must be at least 6 characters",
"Mật khẩu phải có ít nhất 6 ký tự",
"पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
"A senha deve ter pelo menos 6 caracteres"
],
"ລະຫັດຜ່ານບໍ່ກົງກັນ": [
"รหัสผ่านไม่ตรงกัน",
"Passwords don't match",
"Mật khẩu không khớp",
"पासवर्ड मेल नहीं खाते",
"As senhas não coincidem"
],
"ເຊື່ອມຕໍ່ເຊີບເວີບໍ່ໄດ້ ກະລຸນາກວດອິນເຕີເນັດແລ້ວລອງໃໝ່": [
"เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่",
"Can't connect to the server. Check your internet and try again",
"Không kết nối được máy chủ, hãy kiểm tra internet và thử lại",
"सर्वर से कनेक्ट नहीं हो सका, इंटरनेट जाँचकर फिर कोशिश करें",
"Não foi possível conectar ao servidor. Verifique a internet e tente de novo"
],
"ໂຫຼດການກວດສອບ Cloudflare ບໍ່ສຳເລັດ ລອງຣີເຟຣດໜ້າໃໝ່": [
"โหลดการตรวจสอบ Cloudflare ไม่สำเร็จ ลองรีเฟรชหน้า",
"Couldn't load the Cloudflare check. Try refreshing the page",
"Không tải được xác minh Cloudflare, hãy làm mới trang",
"Cloudflare जाँच लोड नहीं हुई, पेज रीफ़्रेश करें",
"Não foi possível carregar a verificação da Cloudflare. Atualize a página"
],
"ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້": [
"กรุณากรอกชื่อผู้ใช้",
"Please enter your username",
"Vui lòng nhập tên người dùng",
"कृपया यूज़रनेम दर्ज करें",
"Digite seu usuário"
],
"ກະລຸນາປ້ອນລະຫັດຜ່ານ": [
"กรุณากรอกรหัสผ่าน",
"Please enter your password",
"Vui lòng nhập mật khẩu",
"कृपया पासवर्ड दर्ज करें",
"Digite sua senha"
],
"ເຂົ້າສູ່ລະບົບສຳເລັດ": [
"เข้าสู่ระบบสำเร็จ",
"Signed in successfully",
"Đăng nhập thành công",
"लॉगिन सफल रहा",
"Login realizado com sucesso"
],
"ສະໝັກສະມາຊິກສຳເລັດ": [
"สมัครสมาชิกสำเร็จ",
"Signed up successfully",
"Đăng ký thành công",
"साइन अप सफल रहा",
"Cadastro realizado com sucesso"
],
"ເຊື່ອງລະຫັດຜ່ານ": [
"ซ่อนรหัสผ่าน",
"Hide password",
"Ẩn mật khẩu",
"पासवर्ड छिपाएँ",
"Ocultar senha"
],
"ສະແດງລະຫັດຜ່ານ": [
"แสดงรหัสผ่าน",
"Show password",
"Hiện mật khẩu",
"पासवर्ड दिखाएँ",
"Mostrar senha"
],
"ຍັງບໍ່ໄດ້ຕັ້ງລິ້ງປາຍທາງ": [
"ยังไม่ได้ตั้งลิงก์ปลายทาง",
"Destination link not set",
"Chưa đặt liên kết đích",
"गंतव्य लिंक सेट नहीं है",
"Link de destino não definido"
],
"ຊື້ສິນຄ້າສຳເລັດແລ້ວເຂົ້າ Discord ຂອງທາງຮ້ານນຳເດີ້!": [
"ซื้อสินค้าเสร็จสิ้นเข้า Discord ของทางร้านด้วยน้า!",
"After purchasing, join the store's Discord!",
"Mua xong hãy vào Discord của cửa hàng nhé!",
"खरीदारी के बाद दुकान के Discord से जुड़ें!",
"Depois da compra, entre no Discord da loja!"
],
"ເຊື່ອມລະບົບຊຳລະເງິນທີ່": [
"เชื่อมระบบชำระเงินที่",
"connect payment at",
"kết nối thanh toán tại",
"भुगतान यहाँ जोड़ें:",
"conecte o pagamento em"
],
"ປ່ຽນໄດ້ທຸກເວລາຈາກປຸ່ມດວງຈັນ/ດວງອາທິດດ້ານເທິງ": [
"เปลี่ยนได้ทุกเมื่อจากปุ่มดวงจันทร์/ดวงอาทิตย์ด้านบน",
"You can change this anytime with the moon/sun button at the top",
"Có thể đổi bất cứ lúc nào bằng nút mặt trăng/mặt trời ở trên",
"ऊपर चाँद/सूरज बटन से कभी भी बदल सकते हैं",
"Você pode mudar a qualquer momento no botão de lua/sol no topo"
],
"ຂາວສະອາດ ຊັດເຈນຕອນກາງເວັນ": [
"ขาวสะอาด ชัดเจนตอนกลางวัน",
"Clean white, clear by day",
"Trắng sạch, rõ ràng ban ngày",
"साफ़ सफ़ेद, दिन में स्पष्ट",
"Branco limpo, nítido de dia"
],
"ດຳສະໜິດ ສະບາຍຕາຕອນກາງຄືນ": [
"ดำสนิท สบายตาตอนกลางคืน",
"Pure black, easy on the eyes at night",
"Đen tuyền, dịu mắt ban đêm",
"गहरा काला, रात में आँखों को आराम",
"Preto puro, confortável à noite"
],
"ເຂົ້າສູ່ລະບົບ ຫຼື ສະໝັກສະມາຊິກ": [
"เข้าสู่ระบบหรือสมัครสมาชิก",
"Log in or sign up",
"Đăng nhập hoặc đăng ký",
"लॉगिन या साइन अप",
"Entrar ou cadastrar-se"
],
"ເຂົ້າສູ່ລະບົບ": [
"เข้าสู่ระบบ",
"Log in",
"Đăng nhập",
"लॉगिन",
"Entrar"
],
"ສະໝັກສະມາຊິກ": [
"สมัครสมาชิก",
"Sign up",
"Đăng ký",
"साइन अप",
"Cadastrar"
],
"ຢືນຢັນລະຫັດຜ່ານ": [
"ยืนยันรหัสผ่าน",
"Confirm password",
"Xác nhận mật khẩu",
"पासवर्ड की पुष्टि करें",
"Confirmar senha"
],
"ຊື່ຜູ້ໃຊ້": [
"ชื่อผู้ใช้",
"Username",
"Tên người dùng",
"यूज़रनेम",
"Usuário"
],
"ລະຫັດຜ່ານ": [
"รหัสผ่าน",
"Password",
"Mật khẩu",
"पासवर्ड",
"Senha"
],
"ອີເມວ (ຖ້າມີ)": [
"อีเมล (ถ้ามี)",
"Email (optional)",
"Email (nếu có)",
"ईमेल (यदि हो)",
"E-mail (se tiver)"
],
"ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ": [
"อย่างน้อย 6 ตัวอักษร",
"At least 6 characters",
"Ít nhất 6 ký tự",
"कम से कम 6 अक्षर",
"Pelo menos 6 caracteres"
],
"(ບໍ່ບັງຄັບ)": [
"(ไม่บังคับ)",
"(optional)",
"(không bắt buộc)",
"(वैकल्पिक)",
"(opcional)"
],
"ສ້າງບັນຊີ": [
"สร้างบัญชี",
"Create account",
"Tạo tài khoản",
"खाता बनाएँ",
"Criar conta"
],
"ຍັງບໍ່ມີບັນຊີ?": [
"ยังไม่มีบัญชี?",
"Don't have an account?",
"Chưa có tài khoản?",
"खाता नहीं है?",
"Ainda não tem conta?"
],
"ມີບັນຊີແລ້ວ?": [
"มีบัญชีแล้ว?",
"Already have an account?",
"Đã có tài khoản?",
"पहले से खाता है?",
"Já tem conta?"
],
"ພ້ອມແລ້ວ": [
"พร้อมแล้ว",
"All set",
"Xong rồi",
"तैयार!",
"Tudo pronto"
],
"ລໍຖ້າການອັບເດດ": [
"รอการอัปเดต",
"Awaiting update",
"Chờ cập nhật",
"अपडेट का इंतज़ार",
"Aguardando atualização"
],
"ຮັບຊາບ": [
"รับทราบ",
"Got it",
"Đã hiểu",
"समझ गया",
"Entendi"
],
"ໃຊ້ໂໝດມືດ": [
"ใช้โหมดมืด",
"Use dark mode",
"Dùng chế độ tối",
"डार्क मोड चुनें",
"Usar modo escuro"
],
"ໃຊ້ໂໝດສະຫວ່າງ": [
"ใช้โหมดสว่าง",
"Use light mode",
"Dùng chế độ sáng",
"लाइट मोड चुनें",
"Usar modo claro"
],
"ໂໝດມືດ": [
"โหมดมืด",
"Dark mode",
"Chế độ tối",
"डार्क मोड",
"Modo escuro"
],
"ໂໝດສະຫວ່າງ": [
"โหมดสว่าง",
"Light mode",
"Chế độ sáng",
"लाइट मोड",
"Modo claro"
],
"ເລືອກໂໝດສີທີ່ທ່ານມັກ": [
"เลือกโหมดสีที่คุณชอบ",
"Choose your color mode",
"Chọn chế độ màu bạn thích",
"अपना पसंदीदा कलर मोड चुनें",
"Escolha seu modo de cor"
],
"ເລືອກໂໝດສີ": [
"เลือกโหมดสี",
"Choose color mode",
"Chọn chế độ màu",
"कलर मोड चुनें",
"Escolher modo de cor"
],
"ພາສາ": [
"ภาษา",
"Language",
"Ngôn ngữ",
"भाषा",
"Idioma"
],
"ເມນູ": [
"เมนู",
"Menu",
"Menu",
"मेन्यू",
"Menu"
],
"ປິດ": [
"ปิด",
"Close",
"Đóng",
"बंद करें",
"Fechar"
],
"ປ່ຽນທີມ": [
"เปลี่ยนธีม",
"Change theme",
"Đổi giao diện",
"थीम बदलें",
"Mudar tema"
],
"ຮ້ານຄ້າ": [
"ร้านค้า",
"Shop",
"Cửa hàng",
"दुकान",
"Loja"
],
"ໜ້າຫຼັກ": [
"หน้าหลัก",
"Home",
"Trang chủ",
"होम",
"Início"
],
"ເຕີມເງິນ": [
"เติมเงิน",
"Top up",
"Nạp tiền",
"टॉप अप",
"Recarregar"
],
"ປະຫວັດການສັ່ງຊື້": [
"ประวัติการสั่งซื้อ",
"Order history",
"Lịch sử đơn hàng",
"ऑर्डर इतिहास",
"Histórico de pedidos"
],
"ປະຫວັດສັ່ງຊື້": [
"ประวัติสั่งซื้อ",
"Order history",
"Lịch sử đơn hàng",
"ऑर्डर इतिहास",
"Histórico de pedidos"
],
"ແຊັດ": [
"แชต",
"Chat",
"Chat",
"चैट",
"Chat"
],
"ປະກາດ": [
"ประกาศ",
"News",
"Tin tức",
"सूचना",
"Aviso"
],
"ແບນເນີ": [
"แบนเนอร์",
"Banner",
"Banner",
"बैनर",
"Banner"
],
"ຊື້ເລີຍ": [
"ซื้อเลย",
"Buy now",
"Mua ngay",
"अभी खरीदें",
"Comprar agora"
],
"ຍິນດີຕ້ອນຮັບສູ່": [
"ยินดีต้อนรับสู่",
"Welcome to",
"Chào mừng đến với",
"स्वागत है",
"Bem-vindo(a) a"
],
"ເວັບບໍ່ມີເຈົ້າຂອງ": [
"เว็บไม่มีเจ้าของ",
"This site has no owner",
"Trang web này chưa có chủ",
"इस साइट का कोई मालिक नहीं है",
"Este site não tem dono"
],
"ເປັນຫຍັງຕ້ອງເລືອກເຮົາ": [
"ทำไมต้องเลือกเรา",
"Why choose us",
"Vì sao chọn chúng tôi",
"हमें क्यों चुनें",
"Por que nos escolher"
],
"ປອດໄພ ວ່ອງໄວ": [
"ปลอดภัย รวดเร็ว",
"Safe & fast",
"An toàn, nhanh chóng",
"सुरक्षित और तेज़",
"Seguro e rápido"
],
"ບໍລິການລູກຄ້າ": [
"บริการลูกค้า",
"Customer service",
"Chăm sóc khách hàng",
"ग्राहक सेवा",
"Atendimento ao cliente"
],
"ໝວດໝູ່ແນະນຳ": [
"หมวดหมู่แนะนำ",
"Featured categories",
"Danh mục đề xuất",
"अनुशंसित श्रेणियाँ",
"Categorias em destaque"
],
"ເບິ່ງທັງໝົດ": [
"ดูทั้งหมด",
"View all",
"Xem tất cả",
"सभी देखें",
"Ver tudo"
],
"ໝວດໝູ່ :": [
"หมวดหมู่ :",
"Category :",
"Danh mục :",
"श्रेणी :",
"Categoria :"
],
"ຜູ້ໃຊ້ງານ": [
"ผู้ใช้งาน",
"Users",
"Người dùng",
"उपयोगकर्ता",
"Usuários"
],
"ຄົນ": [
"คน",
"people",
"người",
"लोग",
"pessoas"
],
"ສິນຄ້າ": [
"สินค้า",
"Products",
"Sản phẩm",
"उत्पाद",
"Produtos"
],
"ລາຍການ": [
"รายการ",
"items",
"mục",
"आइटम",
"itens"
],
"ຄຳສັ່ງຊື້": [
"คำสั่งซื้อ",
"Orders",
"Đơn hàng",
"ऑर्डर",
"Pedidos"
],
"ຂາຍແລ້ວ": [
"ขายแล้ว",
"Sold",
"Đã bán",
"बिके",
"Vendidos"
],
"ຊິ້ນ": [
"ชิ้น",
"pcs",
"cái",
"पीस",
"un."
],
"ຍັງບໍ່ມີສິນຄ້າໃນໝວດນີ້": [
"ยังไม่มีสินค้าในหมวดนี้",
"No products in this category yet",
"Chưa có sản phẩm trong danh mục này",
"इस श्रेणी में अभी कोई उत्पाद नहीं",
"Ainda não há produtos nesta categoria"
],
"ເຫຼືອ": [
"เหลือ",
"Stock",
"Còn",
"शेष",
"Restam"
],
"ຂາຍໄປແລ້ວ": [
"ขายไปแล้ว",
"Sold",
"Đã bán",
"बिक चुके",
"Vendidos"
],
"ສະໄລດ໌": [
"สไลด์",
"Slide",
"Slide",
"स्लाइड",
"Slide"
],
"ສັ່ງຊື້": [
"สั่งซื้อ",
"Order",
"Đặt mua",
"ऑर्डर करें",
"Pedir"
],
"ໂປຣແກຣມຊ່ວຍຫຼິ້ນ": [
"โปรแกรมช่วยเล่น",
"Game helper software",
"Phần mềm hỗ trợ chơi game",
"गेम हेल्पर सॉफ़्टवेयर",
"Software auxiliar de jogo"
],
"ສຸ່ມໄອດີເກມ": [
"สุ่มไอดีเกม",
"Random game IDs",
"ID game ngẫu nhiên",
"रैंडम गेम आईडी",
"IDs de jogo aleatórios"
],
"ປົດລັອກສະກິນ": [
"ปลดล็อกสกิน",
"Skin unlock",
"Mở khóa skin",
"स्किन अनलॉक",
"Desbloqueio de skins"
],
"ປົດແບນບໍ່ມີໂດນຍ້ອນຫຼັງ": [
"ปลดแบนไม่มีโดนย้อนหลัง",
"Unban with no retroactive bans",
"Gỡ ban, không bị ban lại về sau",
"अनबैन, बाद में दोबारा बैन नहीं",
"Remoção de ban sem punição retroativa"
],
"ບໍ່ຕ້ອງເຕີມຊື້ສະກິນ": [
"ไม่ต้องเติมซื้อสกิน",
"No need to top up for skins",
"Không cần nạp để mua skin",
"स्किन खरीदने के लिए टॉप अप ज़रूरी नहीं",
"Sem precisar recarregar para comprar skins"
],
"ອີເມວ": [
"อีเมล",
"Email",
"Email",
"ईमेल",
"E-mail"
],
"ຈື່ບັນຊີ": [
"จำบัญชี",
"Remember me",
"Ghi nhớ tài khoản",
"अकाउंट याद रखें",
"Lembrar conta"
],
"ອອກຈາກລະບົບ": [
"ออกจากระบบ",
"Log out",
"Đăng xuất",
"लॉग आउट",
"Sair"
],
"ກະລຸນາປ້ອນອີເມວ": [
"กรุณากรอกอีเมล",
"Please enter your email",
"Vui lòng nhập email",
"कृपया ईमेल दर्ज करें",
"Informe seu e-mail"
],
"ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ": [
"อีเมลหรือรหัสผ่านไม่ถูกต้อง",
"Incorrect email or password",
"Email hoặc mật khẩu không đúng",
"ईमेल या पासवर्ड गलत है",
"E-mail ou senha incorretos"
],
"ກະລຸນາຢືນຢັນອີເມວກ່ອນເຂົ້າສູ່ລະບົບ (ກວດກ່ອງຈົດໝາຍຂອງທ່ານ)": [
"กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ (ตรวจสอบกล่องจดหมายของคุณ)",
"Please confirm your email before logging in (check your inbox)",
"Vui lòng xác nhận email trước khi đăng nhập (kiểm tra hộp thư)",
"लॉगिन से पहले ईमेल की पुष्टि करें (इनबॉक्स देखें)",
"Confirme seu e-mail antes de entrar (verifique sua caixa de entrada)"
],
"ອີເມວນີ້ຖືກໃຊ້ສະໝັກແລ້ວ": [
"อีเมลนี้ถูกใช้สมัครแล้ว",
"This email is already registered",
"Email này đã được đăng ký",
"यह ईमेल पहले से पंजीकृत है",
"Este e-mail já está cadastrado"
],
"ຊື່ຜູ້ໃຊ້ນີ້ມີຄົນໃຊ້ແລ້ວ": [
"ชื่อผู้ใช้นี้มีคนใช้แล้ว",
"This username is taken",
"Tên người dùng này đã có người dùng",
"यह यूज़रनेम पहले से लिया जा चुका है",
"Este usuário já está em uso"
],
"ລອງຫຼາຍເກີນໄປ ກະລຸນາລໍຖ້າສັກຄູ່ແລ້ວລອງໃໝ່": [
"ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่",
"Too many attempts, please wait a moment and try again",
"Thử quá nhiều lần, vui lòng chờ một lát rồi thử lại",
"बहुत ज़्यादा प्रयास, कृपया थोड़ी देर बाद फिर कोशिश करें",
"Muitas tentativas, aguarde um momento e tente novamente"
],
"ການກວດສອບບໍ່ຜ່ານ ກະລຸນາລອງໃໝ່": [
"การตรวจสอบไม่ผ่าน กรุณาลองใหม่",
"Verification failed, please try again",
"Xác minh không thành công, vui lòng thử lại",
"सत्यापन विफल, कृपया फिर कोशिश करें",
"Falha na verificação, tente novamente"
],
"ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່": [
"เกิดข้อผิดพลาด กรุณาลองใหม่",
"Something went wrong, please try again",
"Đã xảy ra lỗi, vui lòng thử lại",
"कुछ गड़बड़ हुई, कृपया फिर कोशिश करें",
"Algo deu errado, tente novamente"
],
"ສະໝັກສະມາຊິກສຳເລັດ ກະລຸນາເຂົ້າສູ່ລະບົບ": [
"สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ",
"Sign-up complete, please log in",
"Đăng ký thành công, vui lòng đăng nhập",
"पंजीकरण सफल, कृपया लॉगिन करें",
"Cadastro concluído, faça login"
],
"ສະໝັກສຳເລັດ! ກະລຸນາຢືນຢັນອີເມວ (ກວດກ່ອງຈົດໝາຍ) ແລ້ວເຂົ້າສູ່ລະບົບ": [
"สมัครสำเร็จ! กรุณายืนยันอีเมล (ตรวจสอบกล่องจดหมาย) แล้วเข้าสู่ระบบ",
"Signed up! Please confirm your email (check your inbox), then log in",
"Đăng ký thành công! Vui lòng xác nhận email (kiểm tra hộp thư) rồi đăng nhập",
"साइन अप सफल! कृपया ईमेल की पुष्टि करें (इनबॉक्स देखें), फिर लॉगिन करें",
"Cadastro feito! Confirme seu e-mail (veja a caixa de entrada) e depois faça login"
],
"ຍັງບໍ່ໄດ້ເຊື່ອມຖານຂໍ້ມູນ ກະລຸນາລອງຣີເຟຣດໜ້າໃໝ່": [
"ยังเชื่อมฐานข้อมูลไม่ได้ กรุณารีเฟรชหน้าใหม่",
"Database not connected, please refresh the page",
"Chưa kết nối cơ sở dữ liệu, vui lòng tải lại trang",
"डेटाबेस कनेक्ट नहीं है, कृपया पेज रीफ़्रेश करें",
"Banco de dados não conectado, atualize a página"
],
"ເຂົ້າສູ່ລະບົບດ້ວຍ Google ບໍ່ສຳເລັດ": [
"เข้าสู่ระบบด้วย Google ไม่สำเร็จ",
"Google sign-in failed",
"Đăng nhập bằng Google không thành công",
"Google से लॉगिन विफल",
"Falha ao entrar com Google"
],
"ກະລຸນາສະໝັກສະມາຊິກ ຫຼື ເຂົ້າສູ່ລະບົບກ່ອນໃຊ້ງານ": [
"กรุณาสมัครสมาชิกหรือเข้าสู่ระบบก่อนใช้งาน",
"Please sign up or log in to continue",
"Vui lòng đăng ký hoặc đăng nhập để tiếp tục",
"जारी रखने के लिए कृपया साइन अप या लॉगिन करें",
"Cadastre-se ou entre para continuar"
]
};
  const HTML_LANG = { lo: 'lo', th: 'th', en: 'en', vi: 'vi', hi: 'hi', pt: 'pt-BR' };
  const FONT = {
    th: 'family=Noto+Sans+Thai+Looped:wght@300;400;500;600;700',
    hi: 'family=Noto+Sans+Devanagari:wght@300;400;500;600;700'
  };
  const LAO = /[\u0E80-\u0EFF]/, isLao = c => c >= '\u0E80' && c <= '\u0EFF';
  const KEYS = Object.keys(D).sort((a, b) => b.length - a.length);
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const TS = new WeakMap(), AS = new WeakMap();
  let lang = 'lo', fontLink = null;

  /* แทนที่เฉพาะเมื่อไม่ติดตัวอักษรลาวด้านหน้า/หลัง (กันแทนกลางคำ) */
  function tr(s, idx) {
    for (const k of KEYS) {
      let from = 0, i;
      while ((i = s.indexOf(k, from)) > -1) {
        const before = s[i - 1], after = s[i + k.length];
        if ((before && isLao(before)) || (after && isLao(after))) { from = i + 1; continue; }
        const v = D[k][idx];
        s = s.slice(0, i) + v + s.slice(i + k.length);
        from = i + v.length;
      }
    }
    return s;
  }
  const idxOf = () => ORDER.indexOf(lang);

  function doText(n) {
    const st = TS.get(n);
    const orig = st && n.data === st.out ? st.orig : n.data;
    if (!LAO.test(orig)) { if (st) TS.delete(n); return; }
    const out = lang === 'lo' ? orig : tr(orig, idxOf());
    TS.set(n, { orig, out });
    if (n.data !== out) n.data = out;
  }
  function doAttr(el, a) {
    const cur = el.getAttribute(a); if (cur == null) return;
    let m = AS.get(el); if (!m) { m = {}; AS.set(el, m); }
    const st = m[a], orig = st && cur === st.out ? st.orig : cur;
    if (!LAO.test(orig)) { delete m[a]; return; }
    const out = lang === 'lo' ? orig : tr(orig, idxOf());
    m[a] = { orig, out };
    if (cur !== out) el.setAttribute(a, out);
  }
  function walk(root) {
    if (root.nodeType === 3) { if (!/^(SCRIPT|STYLE)$/.test(root.parentNode && root.parentNode.nodeName)) doText(root); return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
    ATTRS.forEach(a => root.hasAttribute && root.hasAttribute(a) && doAttr(root, a));
    for (let c = root.firstChild; c; c = c.nextSibling) walk(c);
  }

  const mo = new MutationObserver(list => {
    for (const m of list) {
      if (m.type === 'characterData') walk(m.target);
      else if (m.type === 'attributes') doAttr(m.target, m.attributeName);
      else m.addedNodes.forEach(walk);
    }
  });
  function observe() {
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  function markTiles() {
    document.querySelectorAll('.lg').forEach(b => {
      const on = b.dataset.lang === lang;
      b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
    });
    const cur = document.getElementById('lgCur'), t = document.querySelector('.lg[data-lang="' + lang + '"]');
    if (cur && t && cur.dataset.l !== lang) {
      cur.innerHTML = t.innerHTML; cur.dataset.l = lang;
      cur.classList.remove('flip'); void cur.offsetWidth; cur.classList.add('flip');
    }
  }
  function loadFont(l) {
    if (!FONT[l]) return;
    if (!fontLink) { fontLink = document.createElement('link'); fontLink.rel = 'stylesheet'; document.head.appendChild(fontLink); }
    fontLink.href = 'https://fonts.googleapis.com/css2?' + FONT[l] + '&display=swap';
  }
  function setLang(l, save) {
    if (l !== 'lo' && !ORDER.includes(l)) l = 'lo';
    lang = l;
    document.documentElement.lang = HTML_LANG[l];
    document.documentElement.dataset.lang = l;
    loadFont(l);
    mo.disconnect(); walk(document.documentElement); observe();
    markTiles();
    if (save) { try { localStorage.setItem('lang', l); } catch (e) {} }
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  window.setLang = setLang;

  const lgBtn = document.getElementById('lgBtn'), lgPanel = document.getElementById('lgPanel');
  function toggleLang(open) {
    if (!lgBtn) return;
    const on = open == null ? lgBtn.getAttribute('aria-expanded') !== 'true' : open;
    lgBtn.setAttribute('aria-expanded', on); lgPanel.classList.toggle('open', on); lgPanel.inert = !on;
    if (on) setTimeout(() => { if (lgPanel.scrollIntoView) lgPanel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 420);
  }
  if (lgBtn) {
    lgBtn.addEventListener('click', () => toggleLang());
    const ov = document.getElementById('ov');
    if (ov) new MutationObserver(() => { if (!ov.classList.contains('open')) toggleLang(false); })
      .observe(ov, { attributes: true, attributeFilter: ['class'] });
  }
  let collapseT;
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.lg');
    if (!b) return;
    setLang(b.dataset.lang, true);
    b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
    clearTimeout(collapseT);
    if (e.detail > 0) collapseT = setTimeout(() => toggleLang(false), 850); /* แตะ/คลิกแล้วพับกลับ */
  });
  document.addEventListener('keydown', e => {
    const b = e.target.closest && e.target.closest('.lg');
    if (!b || !/^Arrow/.test(e.key)) return;
    const tiles = [...document.querySelectorAll('.lg')];
    const i = tiles.indexOf(b), d = /Right|Down/.test(e.key) ? 1 : -1;
    const n = tiles[(i + d + tiles.length) % tiles.length];
    e.preventDefault(); n.focus(); setLang(n.dataset.lang, true);
  });

  let saved = 'lo';
  try { saved = localStorage.getItem('lang') || 'lo'; } catch (e) {}
  setLang(saved, false);
})();
