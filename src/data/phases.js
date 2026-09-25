/**
 * DỮ LIỆU: các giai đoạn tấn công (kill-chain) → danh sách command → danh sách switch.
 *
 * Đây là tài liệu THAM KHẢO / HỌC TẬP mô phỏng quy trình của một red teamer.
 * Chỉ dùng trên hệ thống bạn được phép kiểm thử (CTF, lab, hoặc có văn bản ủy quyền).
 *
 * Cấu trúc mỗi command:
 *   {
 *     id, tool, name, desc,
 *     target: { prefix, placeholder } | null,   // ô nhập mục tiêu (host/URL/...)
 *     switches: [
 *       {
 *         id,
 *         flag,                 // ví dụ '-sV' hoặc 'LHOST='
 *         label,                // giải thích tiếng Việt
 *         takesValue?: bool,    // switch có kèm giá trị người dùng nhập không
 *         valuePlaceholder?,    // gợi ý giá trị
 *         defaultValue?,        // giá trị mặc định điền sẵn
 *         glue?: ' ' | '',      // nối flag với value: ' ' -> "-p 80", '' -> "LHOST=1.2.3.4"
 *         defaultOn?: bool,     // bật sẵn khi mở trang
 *         required?: bool       // đánh dấu switch "nên có" (chỉ để nhắc, không ép)
 *       }
 *     ]
 *   }
 */

export const PHASES = [
  /* ========================================================= */
  {
    id: 'recon',
    name: 'Reconnaissance',
    commands: [
      {
        id: 'nmap-discovery',
        tool: 'nmap',
        name: 'Ping sweep — phát hiện host sống',
        desc: 'Quét một dải mạng để tìm các máy đang hoạt động trước khi quét sâu.',
        target: { prefix: '', placeholder: '10.10.10.0/24' },
        switches: [
          { id: 'sn', flag: '-sn', label: 'Không quét cổng, chỉ phát hiện host (ping scan).', defaultOn: true },
          { id: 'pe', flag: '-PE', label: 'Dùng ICMP echo request để ping.' },
          { id: 'ps', flag: '-PS', label: 'TCP SYN ping tới các cổng chỉ định.', takesValue: true, valuePlaceholder: '80,443' },
          { id: 'n', flag: '-n', label: 'Không phân giải DNS ngược (quét nhanh hơn).' },
          { id: 'v', flag: '-v', label: 'Hiện chi tiết tiến trình quét.' },
          { id: 'oa', flag: '-oA', label: 'Lưu kết quả ra cả 3 định dạng.', takesValue: true, valuePlaceholder: 'recon/hosts' },
        ],
      },
      {
        id: 'nmap-service',
        tool: 'nmap',
        name: 'Quét dịch vụ & phiên bản',
        desc: 'Xác định cổng mở, dịch vụ chạy trên đó và phiên bản để tìm lỗ hổng.',
        target: { prefix: '', placeholder: '10.10.10.5' },
        switches: [
          { id: 'ss', flag: '-sS', label: 'TCP SYN scan (nhanh, "bán mở").', defaultOn: true },
          { id: 'sv', flag: '-sV', label: 'Phát hiện phiên bản dịch vụ.', defaultOn: true, required: true },
          { id: 'sc', flag: '-sC', label: 'Chạy bộ script mặc định (NSE).' },
          { id: 'pall', flag: '-p-', label: 'Quét toàn bộ 65535 cổng.' },
          { id: 'p', flag: '-p', label: 'Chỉ quét các cổng chỉ định.', takesValue: true, valuePlaceholder: '22,80,443' },
          { id: 'o', flag: '-O', label: 'Đoán hệ điều hành.' },
          { id: 'a', flag: '-A', label: 'Aggressive: OS + version + script + traceroute.' },
          { id: 't4', flag: '-T4', label: 'Tốc độ nhanh (T0 chậm nhất → T5 nhanh nhất).' },
          { id: 'minrate', flag: '--min-rate', label: 'Số gói tối thiểu mỗi giây.', takesValue: true, valuePlaceholder: '1000' },
          { id: 'on', flag: '-oN', label: 'Ghi kết quả ra file text.', takesValue: true, valuePlaceholder: 'scan.txt' },
        ],
      },
      {
        id: 'subfinder',
        tool: 'subfinder',
        name: 'Liệt kê subdomain (thụ động)',
        desc: 'Tìm tên miền phụ từ các nguồn công khai — mở rộng bề mặt tấn công.',
        target: { prefix: '-d ', placeholder: 'example.com' },
        switches: [
          { id: 'silent', flag: '-silent', label: 'Chỉ in domain, bỏ banner.', defaultOn: true },
          { id: 'all', flag: '-all', label: 'Dùng mọi nguồn (chậm hơn, nhiều kết quả hơn).' },
          { id: 'recursive', flag: '-recursive', label: 'Đệ quy để tìm subdomain của subdomain.' },
          { id: 'nw', flag: '-nW', label: 'Chỉ giữ host phân giải được (loại bỏ chết).' },
          { id: 'o', flag: '-o', label: 'Lưu ra file.', takesValue: true, valuePlaceholder: 'subs.txt' },
        ],
      },
      {
        id: 'amass',
        tool: 'amass enum',
        name: 'Bản đồ tên miền chuyên sâu',
        desc: 'OWASP Amass — dò subdomain bằng nhiều kỹ thuật (thụ động/chủ động/brute).',
        target: { prefix: '-d ', placeholder: 'example.com' },
        switches: [
          { id: 'passive', flag: '-passive', label: 'Chỉ thụ động, không gửi gói tới target.', defaultOn: true },
          { id: 'active', flag: '-active', label: 'Chủ động: resolve DNS + lấy chứng chỉ TLS.' },
          { id: 'brute', flag: '-brute', label: 'Brute-force tên subdomain theo từ điển.' },
          { id: 'o', flag: '-o', label: 'Lưu ra file.', takesValue: true, valuePlaceholder: 'amass.txt' },
        ],
      },
      {
        id: 'whatweb',
        tool: 'whatweb',
        name: 'Nhận diện công nghệ web',
        desc: 'Xác định CMS, framework, server, thư viện JS của một website.',
        target: { prefix: '', placeholder: 'https://example.com' },
        switches: [
          { id: 'a', flag: '-a', label: 'Mức "hung hăng" 1 (nhẹ) → 4 (nặng).', takesValue: true, valuePlaceholder: '3' },
          { id: 'v', flag: '-v', label: 'In chi tiết mọi plugin khớp.' },
          { id: 'log', flag: '--log-verbose', label: 'Ghi log chi tiết ra file.', takesValue: true, valuePlaceholder: 'whatweb.log' },
        ],
      },
    ],
  },

  /* ========================================================= */
  {
    id: 'enum',
    name: 'Enumeration & Scanning',
    commands: [
      {
        id: 'gobuster-dir',
        tool: 'gobuster dir',
        name: 'Dò thư mục & file ẩn (web)',
        desc: 'Brute-force đường dẫn web theo wordlist để tìm trang/endpoint ẩn.',
        target: { prefix: '-u ', placeholder: 'http://10.10.10.5' },
        switches: [
          { id: 'w', flag: '-w', label: 'Wordlist đường dẫn.', takesValue: true, valuePlaceholder: '/usr/share/wordlists/dirb/common.txt', defaultValue: '/usr/share/wordlists/dirb/common.txt', defaultOn: true, required: true },
          { id: 'x', flag: '-x', label: 'Các đuôi file cần thử.', takesValue: true, valuePlaceholder: 'php,txt,html' },
          { id: 't', flag: '-t', label: 'Số luồng song song.', takesValue: true, valuePlaceholder: '50' },
          { id: 's', flag: '-s', label: 'Chỉ chấp nhận các mã trạng thái này.', takesValue: true, valuePlaceholder: '200,204,301,302,401' },
          { id: 'k', flag: '-k', label: 'Bỏ qua lỗi chứng chỉ TLS.' },
          { id: 'o', flag: '-o', label: 'Ghi kết quả ra file.', takesValue: true, valuePlaceholder: 'gobuster.txt' },
        ],
      },
      {
        id: 'ffuf',
        tool: 'ffuf',
        name: 'Fuzzing web tốc độ cao',
        desc: 'Fuzz đường dẫn/tham số/subdomain. Chèn FUZZ vào vị trí muốn thử.',
        target: { prefix: '-u ', placeholder: 'http://10.10.10.5/FUZZ' },
        switches: [
          { id: 'w', flag: '-w', label: 'Wordlist.', takesValue: true, valuePlaceholder: '/usr/share/wordlists/dirb/common.txt', defaultValue: '/usr/share/wordlists/dirb/common.txt', defaultOn: true, required: true },
          { id: 'mc', flag: '-mc', label: 'Chỉ khớp các mã trạng thái này.', takesValue: true, valuePlaceholder: '200,301,302' },
          { id: 'fc', flag: '-fc', label: 'Lọc bỏ các mã trạng thái này.', takesValue: true, valuePlaceholder: '404' },
          { id: 'fs', flag: '-fs', label: 'Lọc bỏ theo kích thước phản hồi.', takesValue: true, valuePlaceholder: '0' },
          { id: 'e', flag: '-e', label: 'Các đuôi mở rộng.', takesValue: true, valuePlaceholder: '.php,.html' },
          { id: 'H', flag: '-H', label: 'Header tùy chỉnh (vd token, host).', takesValue: true, valuePlaceholder: 'Authorization: Bearer ...' },
          { id: 'recursion', flag: '-recursion', label: 'Đệ quy vào thư mục tìm được.' },
        ],
      },
      {
        id: 'nikto',
        tool: 'nikto',
        name: 'Quét lỗ hổng web cơ bản',
        desc: 'Kiểm tra nhanh cấu hình sai, file nguy hiểm và lỗ hổng đã biết của web server.',
        target: { prefix: '-h ', placeholder: 'http://10.10.10.5' },
        switches: [
          { id: 'p', flag: '-p', label: 'Cổng cần quét.', takesValue: true, valuePlaceholder: '80,443' },
          { id: 'ssl', flag: '-ssl', label: 'Ép sử dụng HTTPS.' },
          { id: 'tuning', flag: '-Tuning', label: 'Chọn nhóm kiểm thử (vd 6 = XSS).', takesValue: true, valuePlaceholder: 'x 6' },
          { id: 'o', flag: '-o', label: 'Xuất báo cáo ra file.', takesValue: true, valuePlaceholder: 'nikto.html' },
        ],
      },
      {
        id: 'wpscan',
        tool: 'wpscan',
        name: 'Kiểm thử WordPress',
        desc: 'Liệt kê user, plugin, theme dễ tổn thương của site WordPress.',
        target: { prefix: '--url ', placeholder: 'https://blog.example.com' },
        switches: [
          { id: 'enum', flag: '--enumerate', label: 'Liệt kê (vp=plugin lỗi, vt=theme lỗi, u=user).', takesValue: true, valuePlaceholder: 'vp,vt,u', defaultValue: 'vp,vt,u', defaultOn: true },
          { id: 'api', flag: '--api-token', label: 'Token WPScan để lấy chi tiết CVE.', takesValue: true, valuePlaceholder: 'YOUR_TOKEN' },
          { id: 'usernames', flag: '--usernames', label: 'User để brute-force.', takesValue: true, valuePlaceholder: 'admin' },
          { id: 'passwords', flag: '--passwords', label: 'File mật khẩu để brute.', takesValue: true, valuePlaceholder: '/usr/share/wordlists/rockyou.txt' },
          { id: 'ua', flag: '--random-user-agent', label: 'Ngẫu nhiên User-Agent để đỡ bị chặn.' },
        ],
      },
      {
        id: 'enum4linux',
        tool: 'enum4linux-ng',
        name: 'Liệt kê SMB / Windows',
        desc: 'Rút thông tin user, share, group, chính sách mật khẩu qua SMB.',
        target: { prefix: '', placeholder: '10.10.10.5' },
        switches: [
          { id: 'a', flag: '-A', label: 'Bật tất cả kiểm tra (users, shares, groups...).', defaultOn: true },
          { id: 'u', flag: '-u', label: 'Username đăng nhập.', takesValue: true, valuePlaceholder: 'guest' },
          { id: 'p', flag: '-p', label: 'Password đăng nhập.', takesValue: true, valuePlaceholder: '' },
          { id: 'oj', flag: '-oJ', label: 'Xuất kết quả ra JSON.', takesValue: true, valuePlaceholder: 'enum' },
        ],
      },
      {
        id: 'cme-smb',
        tool: 'crackmapexec smb',
        name: 'Quét SMB toàn mạng',
        desc: 'Kiểm tra thông tin đăng nhập, liệt kê share & user trên nhiều host cùng lúc.',
        target: { prefix: '', placeholder: '10.10.10.0/24' },
        switches: [
          { id: 'u', flag: '-u', label: 'User (hoặc file user).', takesValue: true, valuePlaceholder: 'administrator' },
          { id: 'p', flag: '-p', label: 'Password (hoặc file password).', takesValue: true, valuePlaceholder: 'Password123' },
          { id: 'H', flag: '-H', label: 'Đăng nhập bằng hash NTLM (pass-the-hash).', takesValue: true, valuePlaceholder: 'aad3b...:hash' },
          { id: 'shares', flag: '--shares', label: 'Liệt kê các share truy cập được.' },
          { id: 'users', flag: '--users', label: 'Liệt kê user của domain.' },
          { id: 'passpol', flag: '--pass-pol', label: 'Đọc chính sách mật khẩu.' },
        ],
      },
    ],
  },

  /* ========================================================= */
  {
    id: 'exploit',
    name: 'Exploitation',
    commands: [
      {
        id: 'sqlmap',
        tool: 'sqlmap',
        name: 'Tự động khai thác SQL Injection',
        desc: 'Dò và khai thác SQLi để liệt kê database, bảng và trích xuất dữ liệu.',
        target: { prefix: '-u ', placeholder: '"http://site/item.php?id=1"' },
        switches: [
          { id: 'batch', flag: '--batch', label: 'Tự chọn đáp án mặc định (không hỏi).', defaultOn: true },
          { id: 'dbs', flag: '--dbs', label: 'Liệt kê toàn bộ database.' },
          { id: 'curdb', flag: '--current-db', label: 'Lấy tên database hiện tại.' },
          { id: 'tables', flag: '--tables', label: 'Liệt kê bảng trong database.' },
          { id: 'D', flag: '-D', label: 'Chọn database mục tiêu.', takesValue: true, valuePlaceholder: 'appdb' },
          { id: 'T', flag: '-T', label: 'Chọn bảng mục tiêu.', takesValue: true, valuePlaceholder: 'users' },
          { id: 'dump', flag: '--dump', label: 'Trích xuất (dump) dữ liệu.' },
          { id: 'level', flag: '--level', label: 'Mức độ kiểm thử 1–5.', takesValue: true, valuePlaceholder: '3' },
          { id: 'risk', flag: '--risk', label: 'Mức rủi ro payload 1–3.', takesValue: true, valuePlaceholder: '2' },
          { id: 'cookie', flag: '--cookie', label: 'Cookie phiên (khi cần đăng nhập).', takesValue: true, valuePlaceholder: 'PHPSESSID=...' },
          { id: 'data', flag: '--data', label: 'Dữ liệu POST cần test.', takesValue: true, valuePlaceholder: 'id=1&submit=1' },
        ],
      },
      {
        id: 'hydra',
        tool: 'hydra',
        name: 'Brute-force đăng nhập',
        desc: 'Thử hàng loạt cặp user/mật khẩu trên SSH, FTP, HTTP form, RDP...',
        target: { prefix: '', placeholder: 'ssh://10.10.10.5' },
        switches: [
          { id: 'l', flag: '-l', label: 'Một username.', takesValue: true, valuePlaceholder: 'root' },
          { id: 'L', flag: '-L', label: 'File danh sách username.', takesValue: true, valuePlaceholder: 'users.txt' },
          { id: 'p', flag: '-p', label: 'Một password.', takesValue: true, valuePlaceholder: 'toor' },
          { id: 'P', flag: '-P', label: 'File danh sách password.', takesValue: true, valuePlaceholder: '/usr/share/wordlists/rockyou.txt', defaultValue: '/usr/share/wordlists/rockyou.txt', defaultOn: true, required: true },
          { id: 't', flag: '-t', label: 'Số kết nối song song.', takesValue: true, valuePlaceholder: '4' },
          { id: 's', flag: '-s', label: 'Cổng dịch vụ tùy chỉnh.', takesValue: true, valuePlaceholder: '2222' },
          { id: 'f', flag: '-f', label: 'Dừng ngay khi tìm được cặp hợp lệ.' },
          { id: 'V', flag: '-V', label: 'Hiện từng lần thử.' },
        ],
      },
      {
        id: 'searchsploit',
        tool: 'searchsploit',
        name: 'Tra cứu exploit (Exploit-DB)',
        desc: 'Tìm mã khai thác công khai theo tên/phiên bản dịch vụ hoặc CVE.',
        target: { prefix: '', placeholder: 'apache 2.4.49' },
        switches: [
          { id: 'w', flag: '-w', label: 'Kèm link Exploit-DB.' },
          { id: 'cve', flag: '--cve', label: 'Tìm theo mã CVE.', takesValue: true, valuePlaceholder: 'CVE-2021-41773' },
          { id: 'm', flag: '-m', label: 'Sao chép exploit về thư mục hiện tại.', takesValue: true, valuePlaceholder: '50383' },
          { id: 'j', flag: '-j', label: 'Xuất kết quả JSON.' },
        ],
      },
      {
        id: 'nuclei',
        tool: 'nuclei',
        name: 'Quét lỗ hổng theo template',
        desc: 'Kiểm tra hàng nghìn mẫu lỗ hổng (CVE, misconfig) một cách nhanh gọn.',
        target: { prefix: '-u ', placeholder: 'https://example.com' },
        switches: [
          { id: 't', flag: '-t', label: 'Thư mục/template áp dụng.', takesValue: true, valuePlaceholder: 'cves/' },
          { id: 'severity', flag: '-severity', label: 'Lọc theo mức nghiêm trọng.', takesValue: true, valuePlaceholder: 'critical,high' },
          { id: 'tags', flag: '-tags', label: 'Lọc theo tag.', takesValue: true, valuePlaceholder: 'cve,rce' },
          { id: 'rl', flag: '-rl', label: 'Giới hạn tốc độ (req/giây).', takesValue: true, valuePlaceholder: '150' },
          { id: 'o', flag: '-o', label: 'Ghi kết quả ra file.', takesValue: true, valuePlaceholder: 'nuclei.txt' },
        ],
      },
      {
        id: 'msfconsole',
        tool: 'msfconsole',
        name: 'Metasploit Framework',
        desc: 'Mở console khai thác; có thể nạp sẵn lệnh để tự dựng handler/exploit.',
        target: null,
        switches: [
          { id: 'q', flag: '-q', label: 'Ẩn banner khởi động.', defaultOn: true },
          { id: 'x', flag: '-x', label: 'Chạy chuỗi lệnh ngay khi mở.', takesValue: true, valuePlaceholder: 'use multi/handler; set PAYLOAD ...; run' },
          { id: 'r', flag: '-r', label: 'Chạy resource script tự động.', takesValue: true, valuePlaceholder: 'auto.rc' },
        ],
      },
    ],
  },

  /* ========================================================= */
  {
    id: 'post',
    name: 'Post-Exploitation',
    commands: [
      {
        id: 'nc-listener',
        tool: 'nc',
        name: 'Listener nhận reverse shell',
        desc: 'Mở cổng lắng nghe để nhận kết nối ngược từ máy nạn nhân.',
        target: null,
        switches: [
          { id: 'l', flag: '-l', label: 'Chế độ lắng nghe.', defaultOn: true, required: true },
          { id: 'v', flag: '-v', label: 'Hiện chi tiết kết nối.', defaultOn: true },
          { id: 'n', flag: '-n', label: 'Không phân giải DNS.', defaultOn: true },
          { id: 'p', flag: '-p', label: 'Cổng lắng nghe.', takesValue: true, valuePlaceholder: '4444', defaultValue: '4444', defaultOn: true, required: true },
        ],
      },
      {
        id: 'msfvenom',
        tool: 'msfvenom',
        name: 'Tạo payload reverse shell',
        desc: 'Sinh file thực thi/mã shell kết nối ngược về listener của bạn.',
        target: null,
        switches: [
          { id: 'p', flag: '-p', label: 'Loại payload.', takesValue: true, valuePlaceholder: 'windows/x64/meterpreter/reverse_tcp', defaultValue: 'windows/x64/meterpreter/reverse_tcp', defaultOn: true, required: true },
          { id: 'lhost', flag: 'LHOST=', label: 'IP máy tấn công (nơi nhận kết nối).', takesValue: true, valuePlaceholder: '10.10.14.1', glue: '', defaultOn: true, required: true },
          { id: 'lport', flag: 'LPORT=', label: 'Cổng nhận kết nối.', takesValue: true, valuePlaceholder: '4444', defaultValue: '4444', glue: '', defaultOn: true, required: true },
          { id: 'f', flag: '-f', label: 'Định dạng xuất (exe, elf, raw, php...).', takesValue: true, valuePlaceholder: 'exe', defaultValue: 'exe', defaultOn: true },
          { id: 'e', flag: '-e', label: 'Encoder để né AV cơ bản.', takesValue: true, valuePlaceholder: 'x86/shikata_ga_nai' },
          { id: 'o', flag: '-o', label: 'File đầu ra.', takesValue: true, valuePlaceholder: 'shell.exe' },
        ],
      },
      {
        id: 'linpeas',
        tool: './linpeas.sh',
        name: 'Dò leo thang quyền (Linux)',
        desc: 'Script quét toàn diện tìm cấu hình sai, SUID, cron, credential trên Linux.',
        target: null,
        switches: [
          { id: 'a', flag: '-a', label: 'Chạy tất cả kiểm tra (kỹ nhất, chậm hơn).' },
          { id: 'q', flag: '-q', label: 'Không màu / không banner (dễ đọc log).' },
          { id: 's', flag: '-s', label: 'Nhanh & kín đáo (bỏ vài kiểm tra ồn ào).' },
        ],
      },
      {
        id: 'secretsdump',
        tool: 'impacket-secretsdump',
        name: 'Trích xuất hash mật khẩu',
        desc: 'Dump hash NTLM từ SAM/LSA hoặc NTDS.dit của Domain Controller.',
        target: { prefix: '', placeholder: 'DOMAIN/admin:Passw0rd@10.10.10.5' },
        switches: [
          { id: 'justdc', flag: '-just-dc', label: 'Chỉ dump NTDS.dit (từ Domain Controller).' },
          { id: 'justdcntlm', flag: '-just-dc-ntlm', label: 'Chỉ lấy hash NTLM (bỏ Kerberos keys).' },
          { id: 'hashes', flag: '-hashes', label: 'Xác thực bằng hash thay vì mật khẩu.', takesValue: true, valuePlaceholder: 'LMhash:NThash' },
          { id: 'out', flag: '-outputfile', label: 'Lưu kết quả ra file.', takesValue: true, valuePlaceholder: 'loot' },
        ],
      },
      {
        id: 'psexec',
        tool: 'impacket-psexec',
        name: 'Thực thi lệnh từ xa (SMB)',
        desc: 'Lấy shell SYSTEM trên máy Windows qua SMB bằng credential/hash hợp lệ.',
        target: { prefix: '', placeholder: 'DOMAIN/admin:Passw0rd@10.10.10.5' },
        switches: [
          { id: 'hashes', flag: '-hashes', label: 'Pass-the-hash thay vì mật khẩu.', takesValue: true, valuePlaceholder: 'LMhash:NThash' },
          { id: 'target-ip', flag: '-target-ip', label: 'IP mục tiêu (khi tên khác IP).', takesValue: true, valuePlaceholder: '10.10.10.5' },
        ],
      },
    ],
  },

  /* ========================================================= */
  {
    id: 'lateral',
    name: 'PrivEsc & Lateral Movement',
    commands: [
      {
        id: 'sudo-l',
        tool: 'sudo',
        name: 'Kiểm tra quyền sudo',
        desc: 'Xem người dùng hiện tại được phép chạy lệnh gì với quyền root — điểm leo thang phổ biến.',
        target: null,
        switches: [
          { id: 'l', flag: '-l', label: 'Liệt kê các lệnh sudo được phép.', defaultOn: true, required: true },
          { id: 'll', flag: '-ll', label: 'Liệt kê chi tiết hơn (định dạng dài).' },
        ],
      },
      {
        id: 'cme-winrm',
        tool: 'crackmapexec winrm',
        name: 'Thực thi lệnh qua WinRM',
        desc: 'Chạy lệnh trên host Windows từ xa qua WinRM bằng credential/hash.',
        target: { prefix: '', placeholder: '10.10.10.5' },
        switches: [
          { id: 'u', flag: '-u', label: 'Username.', takesValue: true, valuePlaceholder: 'administrator', defaultOn: true },
          { id: 'p', flag: '-p', label: 'Password.', takesValue: true, valuePlaceholder: 'Passw0rd' },
          { id: 'H', flag: '-H', label: 'Hash NTLM (pass-the-hash).', takesValue: true, valuePlaceholder: 'NThash' },
          { id: 'x', flag: '-x', label: 'Lệnh CMD cần chạy.', takesValue: true, valuePlaceholder: 'whoami /all' },
          { id: 'X', flag: '-X', label: 'Lệnh PowerShell cần chạy.', takesValue: true, valuePlaceholder: 'Get-LocalUser' },
        ],
      },
      {
        id: 'evil-winrm',
        tool: 'evil-winrm',
        name: 'Shell tương tác WinRM',
        desc: 'Mở phiên shell đầy đủ trên Windows qua WinRM (cổng 5985/5986).',
        target: { prefix: '-i ', placeholder: '10.10.10.5' },
        switches: [
          { id: 'u', flag: '-u', label: 'Username.', takesValue: true, valuePlaceholder: 'Administrator', defaultValue: 'Administrator', defaultOn: true, required: true },
          { id: 'p', flag: '-p', label: 'Password.', takesValue: true, valuePlaceholder: 'Passw0rd' },
          { id: 'H', flag: '-H', label: 'Hash NTLM (pass-the-hash).', takesValue: true, valuePlaceholder: 'NThash' },
          { id: 's', flag: '-s', label: 'Thư mục chứa script để nạp.', takesValue: true, valuePlaceholder: './scripts' },
          { id: 'e', flag: '-e', label: 'Thư mục chứa file thực thi.', takesValue: true, valuePlaceholder: './exes' },
        ],
      },
      {
        id: 'xfreerdp',
        tool: 'xfreerdp',
        name: 'Kết nối RDP (Windows)',
        desc: 'Điều khiển màn hình đồ họa Windows từ xa qua Remote Desktop.',
        target: { prefix: '/v:', placeholder: '10.10.10.5' },
        switches: [
          { id: 'u', flag: '/u:', label: 'Username.', takesValue: true, valuePlaceholder: 'administrator', defaultValue: 'administrator', glue: '', defaultOn: true, required: true },
          { id: 'p', flag: '/p:', label: 'Password.', takesValue: true, valuePlaceholder: 'Passw0rd', glue: '' },
          { id: 'd', flag: '/d:', label: 'Domain.', takesValue: true, valuePlaceholder: 'CORP', glue: '' },
          { id: 'cert', flag: '/cert:ignore', label: 'Bỏ qua cảnh báo chứng chỉ.' },
          { id: 'clip', flag: '+clipboard', label: 'Chia sẻ clipboard hai chiều.' },
          { id: 'dr', flag: '/dynamic-resolution', label: 'Tự co giãn độ phân giải theo cửa sổ.' },
        ],
      },
      {
        id: 'ssh-tunnel',
        tool: 'ssh',
        name: 'Pivot / tunnel qua SSH',
        desc: 'Dùng một máy đã chiếm làm bàn đạp để với tới mạng nội bộ phía sau.',
        target: { prefix: '', placeholder: 'user@10.10.10.5' },
        switches: [
          { id: 'i', flag: '-i', label: 'Khóa riêng để xác thực.', takesValue: true, valuePlaceholder: 'id_rsa' },
          { id: 'p', flag: '-p', label: 'Cổng SSH.', takesValue: true, valuePlaceholder: '22' },
          { id: 'L', flag: '-L', label: 'Local port forward (local→remote).', takesValue: true, valuePlaceholder: '8080:127.0.0.1:80' },
          { id: 'D', flag: '-D', label: 'Tạo SOCKS proxy động (pivot cả mạng).', takesValue: true, valuePlaceholder: '1080' },
          { id: 'N', flag: '-N', label: 'Không chạy lệnh, chỉ giữ tunnel.' },
          { id: 'f', flag: '-f', label: 'Đẩy tiến trình xuống chạy nền.' },
        ],
      },
    ],
  },
]
