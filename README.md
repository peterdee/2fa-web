## 2FA WEB

WEB application for [2FA Mobile](https://github.com/peterdee/2fa-mobile)

### Deployment

```shell script
git clone https://github.com/peterdee/2fa-web
cd ./2fa-web
nvm use 18
npm i
```

### Environment variables

The `.env` file is required, see [.env.example](.env.example) for details

### Launch

```sh
npm run dev
```

Application will be available at http://localhost:5173

### Build static files

```shell script
npm run build
```

### Linting

```shell script
npm run lint
```

Using [ESLint](https://eslint.org)

### License

[MIT](LICENSE.md)
