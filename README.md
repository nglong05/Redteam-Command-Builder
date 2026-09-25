# Red Team Command Builder (redteam::cmd-builder)

Bài thực hành 1 — **Lập trình Web** (Frontend với React).

Ứng dụng web **nhiều trang** liệt kê các **command** của một red teamer theo **từng giai đoạn tấn công**
và cho phép **dựng lệnh động**: chọn giai đoạn → chọn command → tick switch → app tự ghép thành dòng
lệnh hoàn chỉnh để copy hoặc gom vào một kịch bản, xuất ra script `.sh`.

> ⚠️ **Chỉ dùng cho mục đích học tập.** Các lệnh chỉ nên chạy trên hệ thống bạn sở hữu hoặc được ủy
> quyền kiểm thử (CTF, lab, hợp đồng pentest). Ứng dụng **không thực thi** bất kỳ lệnh nào — chỉ sinh
> ra chuỗi văn bản.

## 5 trang / chức năng

| Trang | Chức năng |
|-------|-----------|
| **Dựng lệnh** (trang chính) | Chọn switch → sinh lệnh → copy → thêm vào kịch bản; ★ yêu thích; mục tiêu chung |
| **Tra cứu nhanh** | Bảng toàn bộ command/switch, lọc theo giai đoạn, tìm kiếm, chỉ yêu thích |
| **Kịch bản** | Gom lệnh, sắp thứ tự, ghi chú, xuất script `.sh`, copy tất cả |
| **Kho công cụ** | Thư mục 20 công cụ, lọc theo nhóm, link chính thức |
| **Cài đặt** | Theme, màu nhấn, mục tiêu mặc định, **import/export (JSON)** & xóa dữ liệu |

## Kỹ thuật React

- **Component hóa** (6 component tái sử dụng) + **5 trang**.
- **Hooks:** `useState`, `useEffect`, `useMemo`, `useRef`, `useContext`.
- **React Router 6** (HashRouter) cho ứng dụng nhiều trang.
- **Context API** quản lý state toàn cục; **localStorage** lưu bền vững (yêu thích, kịch bản).
- Tách **dữ liệu** (`data/`) – **logic** (`utils/`) – **giao diện** (`components/`, `pages/`).
- Giao diện **responsive**, **sáng/tối**. Style: **Editorial Mono**.

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # đóng gói vào dist/
npm run preview    # xem thử bản build
```

## Cấu trúc

```
src/
  main.jsx  App.jsx  index.css
  data/      phases.js (5 giai đoạn · 26 command · 134 switch) · tools.js
  utils/     buildCommand.js · storage.js
  context/   AppContext.jsx
  components/ Layout · PhaseTabs · CommandCard · SwitchItem · CommandOutput · Icons
  pages/     Builder · Cheatsheet · Playbook · Tools · Settings
```

Xem **`BAOCAO.md`** để đọc báo cáo đầy đủ.
