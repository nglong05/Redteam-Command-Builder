/**
 * DỮ LIỆU: kho công cụ (tool directory) — mô tả ngắn + phân loại + trang chủ.
 * Dùng cho trang "Kho công cụ".
 */
export const TOOLS = [
  { name: 'Nmap', cat: 'Trinh sát mạng', desc: 'Máy quét cổng & dịch vụ mạnh nhất, có engine script NSE.', url: 'https://nmap.org' },
  { name: 'Subfinder', cat: 'Trinh sát mạng', desc: 'Liệt kê subdomain thụ động từ nhiều nguồn (ProjectDiscovery).', url: 'https://github.com/projectdiscovery/subfinder' },
  { name: 'Amass', cat: 'Trinh sát mạng', desc: 'Bản đồ tấn công & khám phá tài sản (OWASP).', url: 'https://github.com/owasp-amass/amass' },
  { name: 'WhatWeb', cat: 'Trinh sát mạng', desc: 'Nhận diện công nghệ website (CMS, framework, server).', url: 'https://github.com/urbanadventurer/WhatWeb' },

  { name: 'Gobuster', cat: 'Dò quét web', desc: 'Brute-force thư mục/DNS/vhost tốc độ cao.', url: 'https://github.com/OJ/gobuster' },
  { name: 'ffuf', cat: 'Dò quét web', desc: 'Web fuzzer nhanh, linh hoạt vị trí FUZZ.', url: 'https://github.com/ffuf/ffuf' },
  { name: 'Nikto', cat: 'Dò quét web', desc: 'Quét cấu hình sai & lỗ hổng web server đã biết.', url: 'https://github.com/sullo/nikto' },
  { name: 'WPScan', cat: 'Dò quét web', desc: 'Chuyên soi lỗ hổng WordPress (plugin/theme/user).', url: 'https://wpscan.com' },
  { name: 'Nuclei', cat: 'Dò quét web', desc: 'Quét lỗ hổng theo template cộng đồng (ProjectDiscovery).', url: 'https://github.com/projectdiscovery/nuclei' },

  { name: 'sqlmap', cat: 'Khai thác', desc: 'Tự động dò & khai thác SQL Injection.', url: 'https://sqlmap.org' },
  { name: 'Hydra', cat: 'Khai thác', desc: 'Brute-force đăng nhập đa giao thức.', url: 'https://github.com/vanhauser-thc/thc-hydra' },
  { name: 'Metasploit', cat: 'Khai thác', desc: 'Framework khai thác & post-exploitation toàn diện.', url: 'https://www.metasploit.com' },
  { name: 'SearchSploit', cat: 'Khai thác', desc: 'Tra cứu offline kho exploit của Exploit-DB.', url: 'https://www.exploit-db.com/searchsploit' },

  { name: 'msfvenom', cat: 'Payload & Shell', desc: 'Sinh payload/reverse shell đa nền tảng.', url: 'https://docs.metasploit.com/docs/using-metasploit/basics/how-to-use-msfvenom.html' },
  { name: 'Netcat', cat: 'Payload & Shell', desc: '"Dao đa năng" TCP/UDP — listener, chuyển file, shell.', url: 'https://nc110.sourceforge.io' },
  { name: 'Impacket', cat: 'Payload & Shell', desc: 'Bộ script Python thao tác giao thức Windows (SMB/RPC/Kerberos).', url: 'https://github.com/fortra/impacket' },

  { name: 'LinPEAS', cat: 'Leo thang quyền', desc: 'Script dò đường leo thang quyền trên Linux.', url: 'https://github.com/peass-ng/PEASS-ng' },
  { name: 'Evil-WinRM', cat: 'Di chuyển ngang', desc: 'Shell WinRM tương tác cho Windows.', url: 'https://github.com/Hackplayers/evil-winrm' },
  { name: 'CrackMapExec', cat: 'Di chuyển ngang', desc: '"Dao Thụy Sĩ" cho pentest mạng Active Directory.', url: 'https://github.com/byt3bl33d3r/CrackMapExec' },
  { name: 'FreeRDP', cat: 'Di chuyển ngang', desc: 'Client RDP mã nguồn mở (xfreerdp).', url: 'https://www.freerdp.com' },
]

/** Danh sách nhóm công cụ theo thứ tự xuất hiện. */
export const TOOL_CATEGORIES = [...new Set(TOOLS.map((t) => t.cat))]
