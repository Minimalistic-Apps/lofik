# lofik (sync) server

You can use the public lofik server at api.lofik.com (it can't read your data) or run your own.

Currently, there are 2 ways of running lofik server.

## Docker (recommended)

`docker run -d --name lofik-server -p 8080:8080 -e ORIGIN=http://localhost:5000 -v /path-to-local-folder-to-store-your-db:/home/node/app/prisma/db pycan/lofik-server`

Using the volume is important to persist the database with update messages.

## NPM package

`npm i @lofik/server`

index.js/ts

```
import {startLofikServer} from "@lofik/server";

startLofikServer();
```

> [!IMPORTANT]
> When running the server, you must specify the `DATABASE_URL` env variable. Use absolute path. Example: `DATABASE_URL=file:/Users/user/Documents/lofik/main.db`
