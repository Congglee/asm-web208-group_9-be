# Quy định sử dụng git trong project

## Quy trình làm việc với git

1. Khi muốn phát triền chức năng mới, tạo 1 nhánh feature/key-issues_key-name từ feature
   VD: Muốn phát triển chức năng login thì đứng ở nhánh feature ghi

```bash
git checkout -b feature/key-issues-login
```

2. Làm việc, code trên nhánh khi làm xong thì git add ., khi commit thì phải ghi message commit như sau:

```bash
git commit -m "feature: login refs: key-issues"
```

3. Commit thì push code lên nhánh đang làm việc của cá nhân

```bash
git push origin feature/key-issues-login
```

4. Tạo pull request, ghi tiêu đề chức năng mình đang phát triển, comment thì ghi chi tiết chức năng mình đã làm và assign cho mọi người để review và test code

5. Khi review và test chạy được ổn thì team lead sẽ merge vào nhánh feature và develop

## Quy định message commit và làm việc với git

1. Khi muốn phát triển hay fix một feature (chức năng) gì đó, thì phải checkout từ nhánh feature ra
   VD: Muốn fix chức năng login thì sẽ --> git checkout -b hotfixes/key-issues-login
2. Khi fix xong thì git add . và git commit thì message commit phải được ghi như sau:

```bash
git commit -m "hotfix: login refs: key-issues"
```

3. Rồi push lên nhánh làm việc của cá nhân

```bash
git push origin hotfixes/key-issues-login
```

4. Tạo pull request để cho mọi người trong nhóm vào review và test
