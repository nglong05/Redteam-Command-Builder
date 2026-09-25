# BÁO CÁO BÀI KIỂM TRA GIỮA KỲ
## Môn: Lập trình Web
### Đề tài: Xây dựng giao diện Frontend bằng React — "Red Team Command Builder"

---

**Tên ứng dụng:** redteam::cmd-builder — Trình liệt kê & dựng lệnh tấn công theo giai đoạn
**Công nghệ chính:** React 18 · React Router 6 · Vite 5
**Ngày hoàn thành:** 25/09/2026

> ⚠️ **Tuyên bố sử dụng có trách nhiệm:** Đây là sản phẩm **học tập**, mô phỏng quy trình làm việc
> của một chuyên gia kiểm thử xâm nhập (penetration tester / red teamer). Mọi câu lệnh trong ứng dụng
> chỉ được phép chạy trên hệ thống mà người dùng **sở hữu** hoặc **được ủy quyền hợp pháp** để kiểm thử
> (thi CTF, phòng lab cá nhân, hợp đồng đánh giá an ninh). Sử dụng để tấn công hệ thống không được phép
> là hành vi vi phạm pháp luật.

---

## MỤC LỤC

1. [Giới thiệu đề tài](#1-giới-thiệu-đề-tài)
2. [Cơ sở lý thuyết](#2-cơ-sở-lý-thuyết)
3. [Phân tích và thiết kế hệ thống](#3-phân-tích-và-thiết-kế-hệ-thống)
4. [Triển khai chi tiết](#4-triển-khai-chi-tiết)
5. [Thuật toán dựng lệnh](#5-thuật-toán-dựng-lệnh)
6. [Kiểm thử](#6-kiểm-thử)
7. [Kết quả đạt được](#7-kết-quả-đạt-được)
8. [Hạn chế và hướng phát triển](#8-hạn-chế-và-hướng-phát-triển)
9. [Kết luận](#9-kết-luận)
10. [Phụ lục](#10-phụ-lục)

---

## 1. GIỚI THIỆU ĐỀ TÀI

### 1.1. Bối cảnh và lý do chọn đề tài

Trong lĩnh vực an toàn thông tin, một chuyên gia kiểm thử xâm nhập phải ghi nhớ hàng trăm câu lệnh
của hàng chục công cụ khác nhau (nmap, gobuster, sqlmap, hydra, metasploit...). Mỗi công cụ lại có
rất nhiều **tùy chọn dòng lệnh (switch/flag)** với ý nghĩa riêng. Việc nhớ chính xác cú pháp và ghép
các tùy chọn cho đúng là một gánh nặng, đặc biệt với người mới học.

Xuất phát từ nhu cầu thực tế đó, nhóm chọn xây dựng một **công cụ tra cứu và dựng lệnh trực quan**:
người dùng chỉ cần chọn giai đoạn tấn công, chọn công cụ, rồi tick vào các tùy chọn mong muốn; ứng
dụng sẽ tự động ghép lại thành câu lệnh hoàn chỉnh để sao chép và sử dụng. Đề tài vừa có tính ứng dụng
thực tế, vừa đủ độ phức tạp để thể hiện đầy đủ các kỹ thuật lập trình giao diện với React theo yêu cầu
của môn học.

### 1.2. Mục tiêu

**Mục tiêu về môn học (trọng tâm chấm điểm):**

- Thành thạo xây dựng giao diện bằng **React**: component hóa, JSX, props, state.
- Sử dụng các **React Hooks**: `useState`, `useEffect`, `useMemo`, `useRef`, `useContext`.
- Xây dựng ứng dụng **nhiều trang (SPA)** với **React Router**.
- Quản lý **state toàn cục** bằng **Context API** và lưu trữ bền vững bằng **localStorage**.
- Thiết kế giao diện **responsive**, hỗ trợ **chế độ sáng/tối**, có tính thẩm mỹ và nhất quán.

**Mục tiêu về sản phẩm:**

- Số hóa quy trình tấn công theo mô hình "kill chain" thành dữ liệu có cấu trúc.
- Cho phép dựng lệnh động, sao chép, gom lệnh thành kịch bản và xuất ra script `.sh`.
- Hỗ trợ học tập qua tra cứu nhanh và gom lệnh thành kịch bản có thể xuất ra script.

### 1.3. Phạm vi

- **Trong phạm vi:** Toàn bộ phần **frontend** chạy trên trình duyệt. Dữ liệu lệnh được nhúng tĩnh
  trong mã nguồn. Dữ liệu người dùng (yêu thích, kịch bản, mục tiêu, giao diện) lưu tại `localStorage`.
- **Ngoài phạm vi:** Không có backend/server, không có cơ sở dữ liệu, và **ứng dụng không thực thi**
  bất kỳ câu lệnh nào — nó chỉ **sinh ra chuỗi văn bản** của câu lệnh.

### 1.4. Đối tượng sử dụng

Sinh viên an toàn thông tin, người chơi CTF, người mới học pentest cần một sổ tay tra cứu nhanh và
một công cụ hỗ trợ dựng lệnh trong phòng lab.

---

## 2. CƠ SỞ LÝ THUYẾT

### 2.1. React

**React** là một thư viện JavaScript mã nguồn mở do Meta phát triển, dùng để xây dựng giao diện người
dùng theo hướng **thành phần (component-based)**. Các đặc điểm cốt lõi được vận dụng trong đề tài:

- **Component:** Giao diện được chia thành các khối độc lập, tái sử dụng được. Mỗi component là một hàm
  JavaScript trả về JSX. Ví dụ trong dự án: `CommandCard`, `SwitchItem`, `Layout`...
- **JSX:** Cú pháp lai giữa JavaScript và HTML, cho phép mô tả giao diện ngay trong mã.
- **Virtual DOM:** React duy trì một cây DOM ảo và chỉ cập nhật những phần thực sự thay đổi ra DOM
  thật, giúp render hiệu quả.
- **Luồng dữ liệu một chiều (one-way data flow):** Dữ liệu truyền từ component cha xuống con qua
  **props**; component con báo ngược lên cha thông qua các hàm callback.

### 2.2. React Hooks

Hooks là các hàm cho phép sử dụng state và các tính năng khác của React trong function component.
Đề tài sử dụng:

| Hook | Vai trò | Nơi sử dụng tiêu biểu |
|------|---------|-----------------------|
| `useState` | Khai báo biến trạng thái cục bộ | Hầu hết các trang & component |
| `useEffect` | Thực thi side-effect (đồng bộ localStorage, gắn thuộc tính `data-theme`) | `AppContext` |
| `useMemo` | Ghi nhớ giá trị tính toán tốn kém (lọc/tìm kiếm command) | `Builder`, `Cheatsheet`, `Tools` |
| `useRef` | Tham chiếu trực tiếp phần tử DOM (input file ẩn khi import) | `Settings` |
| `useContext` | Truy cập state toàn cục | Thông qua hook tùy chỉnh `useApp()` |

### 2.3. React Router

**React Router** cho phép xây dựng ứng dụng một trang (SPA) có nhiều "trang" mà không tải lại toàn bộ
website. Đề tài dùng **`HashRouter`** (điều hướng qua phần `#` của URL) để ứng dụng chạy tốt kể cả khi
mở trực tiếp file build mà không cần cấu hình server. Các khái niệm sử dụng: `Routes`, `Route`,
`NavLink` (liên kết biết được trang đang active), `Outlet` (vị trí render trang con trong layout dùng
chung), và `Navigate` (chuyển hướng khi gặp đường dẫn không hợp lệ).

### 2.4. Context API

**Context API** giúp chia sẻ dữ liệu cho nhiều component ở các cấp khác nhau mà không phải truyền props
thủ công qua nhiều tầng ("prop drilling"). Đề tài tạo `AppContext` để quản lý toàn bộ state dùng
chung: giao diện, màu nhấn, mục tiêu mặc định, danh sách yêu thích và kịch bản.

### 2.5. localStorage

`localStorage` là kho lưu trữ khóa–giá trị trong trình duyệt, dữ liệu tồn tại kể cả sau khi đóng tab.
Đề tài bọc `localStorage` trong một lớp tiện ích an toàn (`utils/storage.js`) có `try/catch` để không
vỡ khi trình duyệt chặn (chế độ riêng tư).

### 2.6. Vite

**Vite** là công cụ build thế hệ mới cho frontend: dev server khởi động gần như tức thời nhờ ES
modules native, hỗ trợ **Hot Module Replacement (HMR)** và đóng gói production tối ưu bằng Rollup.

### 2.7. Kiến thức nền về "Kill Chain"

Về mặt nghiệp vụ, một cuộc tấn công thực tế diễn ra theo chuỗi giai đoạn nối tiếp — gọi là *kill
chain*. Đề tài mô hình hóa 5 giai đoạn: **Reconnaissance** (trinh sát) → **Enumeration** (dò quét
chi tiết) → **Exploitation** (khai thác) → **Post-Exploitation** (sau khai thác) → **PrivEsc &
Lateral Movement** (leo thang & di chuyển ngang). Mỗi giai đoạn tạo tiền đề cho giai đoạn kế tiếp.

---

## 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Yêu cầu chức năng

| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F1 | Dựng lệnh (trang chính) | Chọn giai đoạn → chọn command → tick switch → sinh câu lệnh; sao chép; thêm vào kịch bản; đánh dấu yêu thích; đặt mục tiêu chung |
| F2 | Tra cứu nhanh | Bảng tổng hợp mọi command/switch; lọc theo giai đoạn; tìm kiếm; đánh dấu yêu thích |
| F3 | Kịch bản | Gom nhiều lệnh; sắp xếp thứ tự; ghi chú từng bước; xuất script `.sh`; copy tất cả |
| F4 | Kho công cụ | Thư mục 20 công cụ; lọc theo nhóm; tìm kiếm; liên kết trang chính thức |
| F5 | Cài đặt | Đổi theme, màu nhấn, mục tiêu mặc định; import/export dữ liệu (JSON); xóa sạch |

### 3.2. Yêu cầu phi chức năng

- **Responsive:** hoạt động tốt từ điện thoại (~400px) đến màn hình lớn; sidebar biến thành drawer trên
  mobile.
- **Giao diện sáng/tối:** tôn trọng lựa chọn hệ điều hành, có nút chuyển và ghi nhớ lựa chọn.
- **Hiệu năng:** dùng `useMemo` để tránh tính toán lại khi lọc/tìm kiếm.
- **Bền vững dữ liệu:** mọi thao tác của người dùng được lưu ngay và khôi phục khi mở lại.
- **Khả dụng (accessibility):** dùng thẻ ngữ nghĩa, `aria-*`, hỗ trợ điều khiển bằng bàn phím.

### 3.3. Kiến trúc tổng thể

Ứng dụng theo mô hình **tách biệt ba tầng** rõ ràng:

```
DỮ LIỆU  (src/data)      →  Bảng thông tin thuần: giai đoạn, command, switch, công cụ
LOGIC    (src/utils)     →  Hàm thuần: dựng lệnh, khởi tạo state, lưu trữ
GIAO DIỆN (components/pages) →  React component hiển thị & xử lý tương tác
```

Việc tách dữ liệu khỏi giao diện giúp: (1) thêm command mới chỉ cần sửa `phases.js`, không đụng tới
mã giao diện; (2) logic dựng lệnh có thể kiểm thử độc lập.

### 3.4. Sơ đồ cấu trúc thư mục

```
kiem-tra-giua-ky/
├── index.html                  # điểm vào HTML, nạp font
├── package.json                # khai báo dependency & script
├── vite.config.js              # cấu hình Vite
├── public/favicon.svg          # icon
└── src/
    ├── main.jsx                # bootstrap: HashRouter + AppProvider
    ├── App.jsx                 # khai báo toàn bộ route
    ├── index.css               # hệ token Editorial Mono + style
    ├── data/
    │   ├── phases.js           # 5 giai đoạn · 26 command · 134 switch
    │   └── tools.js            # 20 công cụ, phân theo nhóm
    ├── utils/
    │   ├── buildCommand.js     # thuật toán dựng lệnh + khởi tạo state
    │   └── storage.js          # bọc localStorage an toàn + xuất/nhập
    ├── context/
    │   └── AppContext.jsx      # state toàn cục + hook useApp()
    ├── components/             # 6 component tái sử dụng
    │   ├── Layout.jsx          # sidebar + topbar + Outlet
    │   ├── PhaseTabs.jsx       # tab chọn giai đoạn
    │   ├── CommandCard.jsx     # thẻ một command
    │   ├── SwitchItem.jsx      # một switch bật/tắt
    │   ├── CommandOutput.jsx   # khối lệnh kết quả + copy
    │   └── Icons.jsx           # bộ icon SVG nội tuyến
    └── pages/                  # 5 trang tương ứng 5 route
        ├── Builder.jsx         # trang chính (index)
        ├── Cheatsheet.jsx
        ├── Playbook.jsx
        ├── Tools.jsx
        └── Settings.jsx
```

### 3.5. Mô hình dữ liệu

Cấu trúc một **command** trong `phases.js`:

```js
{
  id, tool, name, desc,
  target: { prefix, placeholder } | null,   // ô nhập mục tiêu (host/URL)
  switches: [
    {
      id, flag,                 // ví dụ '-sV' hoặc 'LHOST='
      label,                    // giải thích tiếng Việt
      takesValue?, valuePlaceholder?, defaultValue?,
      glue?: ' ' | '',          // cách nối flag với giá trị
      defaultOn?, required?
    }
  ]
}
```

Sơ đồ quan hệ: **Phase (1) — (n) Command (1) — (n) Switch**.

### 3.6. Thiết kế điều hướng (routing)

| Đường dẫn (#) | Trang | Component |
|---------------|-------|-----------|
| `/` | Dựng lệnh (index) | `Builder` |
| `/cheatsheet` | Tra cứu nhanh | `Cheatsheet` |
| `/playbook` | Kịch bản | `Playbook` |
| `/tools` | Kho công cụ | `Tools` |
| `/settings` | Cài đặt | `Settings` |
| `*` | (không hợp lệ) | chuyển hướng về `/` |

Tất cả trang con được render bên trong `Layout` chung (sidebar + topbar) qua `<Outlet/>`.

### 3.7. Thiết kế giao diện

Giao diện áp dụng phong cách **"Editorial Mono"**:

- **Font:** JetBrains Mono cho toàn bộ giao diện (rất hợp với chủ đề dòng lệnh/terminal); Newsreader
  (serif) chỉ dùng cho tiêu đề lớn để tạo điểm nhấn thẩm mỹ.
- **Màu:** nền giấy ấm, mực gần đen, đường kẻ mảnh (hairline); màu nhấn coral dùng tiết chế (người
  dùng có thể đổi sang 5 màu nhấn trong trang Cài đặt).
- **Bố cục:** canh trái kiểu editorial, chia khối bằng đường kẻ mảnh và khoảng trắng thay vì đổ bóng;
  danh mục được đánh số; số dùng `tabular-nums`.
- **Hệ token màu** được định nghĩa bằng CSS variables cho cả ba trạng thái: sáng (`:root`), tối theo
  hệ điều hành (`@media prefers-color-scheme`), và tối do người dùng chọn (`:root[data-theme="dark"]`).

---

## 4. TRIỂN KHAI CHI TIẾT

### 4.1. Khởi động ứng dụng (`main.jsx`)

Ứng dụng được bọc bởi hai lớp provider: `HashRouter` (định tuyến) và `AppProvider` (state toàn cục),
sau đó mới tới `App` (khai báo route). `React.StrictMode` được bật để phát hiện lỗi tiềm ẩn khi phát
triển.

### 4.2. Quản lý state toàn cục (`AppContext.jsx`)

`AppProvider` giữ 5 nhóm state (giao diện, màu nhấn, mục tiêu mặc định, yêu thích, kịch bản) và tự
đồng bộ với `localStorage` bằng các `useEffect`:

```js
useEffect(() => { save('theme', theme) }, [theme])
useEffect(() => { save('favorites', favorites) }, [favorites])
useEffect(() => { save('playbook', playbook) }, [playbook])
// ...
```

Một `useEffect` khác gắn thuộc tính `data-theme` và biến CSS `--accent` lên thẻ `<html>` mỗi khi theme
hoặc màu nhấn thay đổi — đây là cầu nối giữa state React và hệ token CSS.

Context cung cấp sẵn các **action** thao tác bất biến (immutable), ví dụ di chuyển một mục trong kịch
bản lên/xuống:

```js
const movePlaybookItem = (id, dir) =>
  setPlaybook((p) => {
    const i = p.findIndex((it) => it.uid === id)
    const j = dir === 'up' ? i - 1 : i + 1
    if (j < 0 || j >= p.length) return p
    const copy = [...p]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]   // hoán đổi
    return copy
  })
```

Hook tùy chỉnh `useApp()` bọc `useContext` và ném lỗi rõ ràng nếu bị dùng ngoài provider — một thực
hành tốt giúp bắt lỗi sớm.

### 4.3. Layout dùng chung (`Layout.jsx`)

`Layout` gồm **sidebar** (trên desktop) và **topbar + drawer** (trên mobile). Danh sách điều hướng
được khai báo dưới dạng mảng dữ liệu `NAV` rồi render bằng `.map()`, dùng `NavLink` để tự tô sáng mục
đang mở. Số lượng mục trong kịch bản được hiển thị như một "badge" động cạnh mục "Kịch bản".

Trạng thái mở/đóng drawer là state cục bộ (`useState`); khi chuyển trang, drawer tự đóng.

### 4.4. Trang Dựng lệnh (`Builder.jsx`) — chức năng trọng tâm

- Khởi tạo state cho **mọi** command ngay từ đầu (`buildInitialStates`) để lựa chọn được giữ nguyên
  khi chuyển qua lại giữa các giai đoạn.
- Lọc command theo ô tìm kiếm bằng `useMemo` (khớp tên tool, mô tả, flag, nhãn switch).
- Ba hàm cập nhật state bất biến: `toggleSwitch`, `setValue`, `setTarget`; và `resetCommand` để đưa một
  command về mặc định.
- "Mục tiêu chung" được nối thẳng vào Context (`defaultTarget`) nên giá trị này **được lưu và dùng
  chung** cho cả các trang khác.

### 4.5. Component `SwitchItem` và xử lý sự kiện tinh tế

Mỗi switch là một vùng bấm được (`role="button"`, hỗ trợ phím Enter/Space). Với switch có kèm giá trị,
một ô `input` hiện ra khi switch được bật.

**Một lỗi UX đã được phát hiện và sửa:** ban đầu, khi người dùng gõ dấu **cách** trong ô nhập giá trị,
sự kiện phím **nổi bọt (bubble)** lên vùng cha khiến switch bị bật/tắt ngoài ý muốn. Cách khắc phục là
chỉ xử lý phím khi sự kiện phát ra từ chính vùng cha, không phải từ input con:

```js
onKeyDown={(e) => {
  if (e.target !== e.currentTarget) return   // bỏ qua sự kiện nổi bọt từ input
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
}}
```

### 4.6. Trang Kịch bản (`Playbook.jsx`)

- Hiển thị các lệnh đã thêm; cho phép **sắp xếp** (lên/xuống), **xóa**, **ghi chú** từng bước.
- **Xuất script `.sh`:** hàm `buildScript()` sinh nội dung file bash (kèm header cảnh báo, mục tiêu,
  chú thích từng bước) rồi tải về bằng cơ chế `Blob` + thẻ `<a download>`:

```js
const blob = new Blob([buildScript()], { type: 'text/x-shellscript' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url; a.download = 'attack-playbook.sh'
a.click(); URL.revokeObjectURL(url)
```

- **Copy tất cả** dùng `navigator.clipboard`.

### 4.7. Trang Cài đặt (`Settings.jsx`) — import/export dữ liệu

- Cho phép đổi **giao diện** (sáng/tối), chọn **màu nhấn** (5 lựa chọn), và đặt **mục tiêu mặc định**.
- **Export:** hàm `exportAll()` gom mọi khóa `rtcb:*` trong localStorage thành một object, ghi ra file
  JSON và tải về (`rtcb-backup.json`) qua `Blob` + `<a download>`.
- **Import:** dùng `useRef` trỏ tới một `<input type="file">` ẩn; khi chọn file, `FileReader` đọc nội
  dung, `JSON.parse` rồi `importAll()` ghi lại vào localStorage và tải lại trang.
- **Xóa toàn bộ:** `clearAll()` xóa mọi khóa của app rồi tải lại.

### 4.8. Các trang còn lại

- **Cheatsheet:** bảng dữ liệu với chip lọc theo giai đoạn, ô tìm kiếm, và cột yêu thích; dùng
  `useMemo` để lọc hiệu quả.
- **Tools:** lưới card công cụ, lọc theo nhóm, mở liên kết ngoài an toàn (`rel="noreferrer noopener"`).

Việc chuyển giao diện sáng/tối được đặt ở thanh điều hướng (`Layout`) nên có mặt trên mọi trang.

---

## 5. THUẬT TOÁN DỰNG LỆNH

Trái tim của ứng dụng là hàm thuần `buildCommand(cmd, state, globalTarget)` trong `utils/buildCommand.js`.
Hàm nhận vào một command, trạng thái switch của người dùng và mục tiêu chung, trả về:

- `tokens`: mảng các "mảnh" đã phân loại (`tool` / `flag` / `val`) — phục vụ **tô màu cú pháp**.
- `text`: chuỗi lệnh thuần để **sao chép**.

**Các bài toán con đã xử lý:**

1. **Switch chỉ bật/tắt** (vd `-sV`) → chỉ thêm cờ.
2. **Switch kèm giá trị** (vd `-p 80`) → thêm cờ và giá trị; nếu người dùng chưa nhập thì lấy giá trị
   mặc định hoặc placeholder làm gợi ý.
3. **Cách nối khác nhau (`glue`)**: đa số công cụ nối bằng dấu cách (`-p 80`), nhưng có công cụ nối
   liền (`LHOST=10.10.14.1`, `/u:admin`). Thuộc tính `glue` xử lý cả hai trường hợp:

```js
if (glue === '') tokens.push({ type: 'flag', text: s.flag + value })   // LHOST=10.10.14.1
else { tokens.push({ type: 'flag', text: s.flag });                     // -p
       if (value) tokens.push({ type: 'val', text: value }) }           // 80
```

4. **Vị trí mục tiêu**: một số công cụ đặt mục tiêu ở cuối trần (nmap `10.10.10.5`), số khác cần tiền
   tố (sqlmap `-u <url>`, xfreerdp `/v:host`). Thuộc tính `target.prefix` bao quát mọi kiểu.
5. **Ưu tiên mục tiêu**: dùng mục tiêu riêng của command nếu có, ngược lại dùng mục tiêu chung.

Đi kèm còn có `initCommandState(cmd)` (tạo state mặc định) và `countOn(state)` (đếm số switch đang bật).

---

## 6. KIỂM THỬ

### 6.1. Cách chạy

```bash
npm install       # cài dependency (đã thực hiện)
npm run dev       # chạy dev server tại http://localhost:5173
npm run build     # đóng gói production vào thư mục dist/
npm run preview   # xem thử bản production
```

### 6.2. Kết quả build

Lệnh `npm run build` thành công, không lỗi biên dịch:

```
✓ 55 modules transformed.
dist/index.html                   1.03 kB │ gzip:  0.60 kB
dist/assets/index-*.css          17.80 kB │ gzip:  4.10 kB
dist/assets/index-*.js          231.30 kB │ gzip: 73.89 kB
✓ built in ~0.84s
```

### 6.3. Các trường hợp kiểm thử thủ công

| # | Kịch bản kiểm thử | Kỳ vọng | Kết quả |
|---|-------------------|---------|---------|
| 1 | Tick `-sV`, `-p` = `80,443` trên nmap | Lệnh hiện `nmap -sV -p 80,443 <target>` | Đạt |
| 2 | Nhập mục tiêu chung `10.10.10.5` | Mọi command trống mục tiêu dùng giá trị này | Đạt |
| 3 | Gõ dấu cách trong ô giá trị | Không làm bật/tắt switch | Đạt (sau khi sửa) |
| 4 | Bấm ★ ở một command, bật "Chỉ yêu thích" ở Tra cứu nhanh | Chỉ còn command đã đánh dấu; giữ sau khi tải lại | Đạt |
| 5 | Thêm 3 lệnh vào kịch bản, đảo thứ tự, xuất `.sh` | File `.sh` đúng thứ tự, có chú thích | Đạt |
| 6 | Thêm lệnh vào kịch bản rồi tải lại trang | Kịch bản vẫn còn (localStorage) | Đạt |
| 7 | Đổi theme/màu nhấn ở trang Cài đặt | Giao diện đổi ngay, nhớ sau khi tải lại | Đạt |
| 8 | Export JSON → Xóa toàn bộ → Import lại file vừa xuất | Dữ liệu (yêu thích, kịch bản) trở lại như trước | Đạt |
| 9 | Thu nhỏ cửa sổ xuống ~400px | Sidebar thành drawer, không tràn ngang | Đạt |
| 10 | Truy cập đường dẫn `#/khong-ton-tai` | Tự chuyển về trang Dựng lệnh | Đạt |

---

## 7. KẾT QUẢ ĐẠT ĐƯỢC

### 7.1. Thống kê sản phẩm

| Chỉ số | Giá trị |
|--------|---------|
| Số trang (route) | 5 |
| Số component tái sử dụng | 6 |
| Số giai đoạn tấn công | 5 |
| Số command | 26 |
| Số switch (cờ) | 134 |
| Số công cụ trong thư mục | 20 |
| Số file mã nguồn | 19 |
| Tổng số dòng code | ~1.851 |

### 7.2. Đối chiếu mục tiêu

Tất cả mục tiêu của môn học đã đạt: component hóa triệt để; dùng các hook `useState`, `useEffect`,
`useMemo`, `useContext`; ứng dụng nhiều trang với React Router; state toàn cục qua Context API; lưu
trữ bền vững bằng localStorage; giao diện responsive và có chế độ sáng/tối. Về sản phẩm, ứng dụng đã
số hóa quy trình tấn công thành dữ liệu, hỗ trợ dựng lệnh động, tra cứu, gom lệnh thành kịch bản,
xuất script, và sao lưu/khôi phục dữ liệu (import/export JSON).

---

## 8. HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN

### 8.1. Hạn chế

- Dữ liệu lệnh nhúng tĩnh trong mã, chưa lấy từ backend/API.
- Chưa có kiểm thử tự động (unit test) — mới kiểm thử thủ công.
- localStorage giới hạn phạm vi một trình duyệt; chưa đồng bộ đa thiết bị.

### 8.2. Hướng phát triển

- Bổ sung giai đoạn **Exfiltration** và **Cleanup**; thêm nhiều công cụ.
- Cho phép **chỉnh sửa switch trực tiếp trong kịch bản** (không chỉ chỉnh văn bản).
- Viết **unit test** cho `buildCommand` bằng Vitest.
- Thêm backend (Node/Express) + cơ sở dữ liệu để cộng đồng đóng góp lệnh và đồng bộ tài khoản.
- Xuất kịch bản sang nhiều định dạng khác (PowerShell `.ps1`, tài liệu Markdown báo cáo).

---

## 9. KẾT LUẬN

Đề tài đã xây dựng thành công một ứng dụng frontend **hoàn chỉnh, nhiều trang và nhiều chức năng** bằng
React, đáp ứng đầy đủ yêu cầu của bài kiểm tra giữa kỳ môn Lập trình Web. Sản phẩm không chỉ minh họa
các kỹ thuật React cốt lõi (component, hooks, router, context, localStorage) mà còn giải quyết một bài
toán thực tế có ý nghĩa với người học an toàn thông tin. Quá trình thực hiện cũng giúp nhóm rèn luyện
tư duy tách lớp dữ liệu – logic – giao diện, xử lý các tình huống tương tác tinh tế, và chú trọng trải
nghiệm người dùng (responsive, sáng/tối, lưu trạng thái).

---

## 10. PHỤ LỤC

### 10.1. Bảng command đầy đủ theo giai đoạn

**Giai đoạn 01 — Reconnaissance (Trinh sát):**
`nmap` (ping sweep), `nmap` (quét dịch vụ & phiên bản), `subfinder`, `amass enum`, `whatweb`.

**Giai đoạn 02 — Enumeration (Dò quét chi tiết):**
`gobuster dir`, `ffuf`, `nikto`, `wpscan`, `enum4linux-ng`, `crackmapexec smb`.

**Giai đoạn 03 — Exploitation (Khai thác):**
`sqlmap`, `hydra`, `searchsploit`, `nuclei`, `msfconsole`.

**Giai đoạn 04 — Post-Exploitation (Sau khai thác):**
`nc` (listener), `msfvenom`, `linpeas.sh`, `impacket-secretsdump`, `impacket-psexec`.

**Giai đoạn 05 — PrivEsc & Lateral Movement (Leo thang & di chuyển ngang):**
`sudo -l`, `crackmapexec winrm`, `evil-winrm`, `xfreerdp`, `ssh` (tunnel/pivot).

### 10.2. Danh mục công nghệ & thư viện

| Thư viện | Phiên bản | Vai trò |
|----------|-----------|---------|
| react / react-dom | ^18.3.1 | Thư viện UI |
| react-router-dom | ^6.30.6 | Định tuyến nhiều trang |
| vite | ^5.4.11 | Build tool & dev server |
| @vitejs/plugin-react | ^4.3.4 | Hỗ trợ JSX/Fast Refresh |

### 10.3. Tài liệu tham khảo

1. Tài liệu chính thức React — https://react.dev
2. Tài liệu React Router — https://reactrouter.com
3. Tài liệu Vite — https://vite.dev
4. MDN Web Docs (localStorage, Blob, Clipboard API) — https://developer.mozilla.org
5. Trang chủ các công cụ được liệt kê trong mục "Kho công cụ" của ứng dụng.

---

*Báo cáo được biên soạn kèm mã nguồn dự án. Xem thêm `README.md` để biết hướng dẫn cài đặt và chạy.*
