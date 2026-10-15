# OptiPlex deployment

Run tests and `npm run build`. Package only `dist/` and copy it to a new timestamped directory in `/var/www/notsims/releases/` on `optiplex`. Atomically update `/var/www/notsims/current` to that release. Keep prior releases for rollback. Nginx serves static files; no database, Node service, or game secrets are needed on the server.

Install `notsims.conf` at `/etc/nginx/conf.d/notsims.conf`, then run `sudo nginx -t` before reloading Nginx. This adds an isolated loopback listener at port 4601.

Register the new path on the existing public HTTPS Funnel:

```sh
sudo tailscale funnel --bg --https=443 --set-path=/notsims http://127.0.0.1:4601
```

Do not reset Tailscale Funnel or replace existing root routes. Verify `https://optiplex.tailb97cdb.ts.net/notsims/` and its `src/main.js`, `src/render.js`, `src/engine.js`, and `src/style.css` return successful responses. A redirect from `/notsims` to `/notsims/` ensures relative asset URLs work. Confirm existing public routes still respond.

To roll back, atomically point `current` to the previous release; reload the page. Removing the game requires only removing this path from Funnel and removing this isolated Nginx configuration after verification.
