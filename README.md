# Útěk ze školy

3D hororová hra v prohlížeči odehrávající se v budově školy. Celá hra je v jednom souboru `index.html`
(Three.js, fonty, zvuky i textury jsou vložené uvnitř), takže nepotřebuje žádný build.

## Spuštění
- **Lokálně:** stačí otevřít `index.html` v prohlížeči (singleplayer).
- **Na webu:** Netlify z GitHubu – každý push do `main` se nasadí sám (nastavení je v `netlify.toml`).

## Struktura
| Soubor | K čemu je |
|---|---|
| `index.html` | celá hra |
| `mp-config.js` | adresa multiplayer serveru (prázdná = jen singleplayer) |
| `netlify.toml` | nastavení Netlify (bez buildu, bez dlouhé cache) |
| `relay/` | multiplayer server pro Cloudflare Workers (na Netlify se nenasazuje) |
| `PREDANI.md` | popis hry pro další úpravy přes Claude |

## Co hra umí
- Singleplayer: najdi klíče (stačí 3 z 5), odemkni hlavní dveře a uteč.
- Tvorba postavy na začátku: barva kůže, pokrývka hlavy (kšiltovka, kulich, hlava klauna, medvěda, žáby, koně, helmy, koruna…),
  oblečení (tričko, mikina, kabát, bunda, vesta, banánový kostým, baletní sukýnka, plášť hrdiny, havajská košile),
  5 druhů bot a zvířecí parťák (kočka, sovička, dráček, sliz, liška).
- Strašidla David nebo Daniel Dufek, po 4 minutách přijde druhý učitel.
- Každé 3 minuty se strašidla na 30 s rozzuří a běhají stejně rychle jako hráč (odpočet na obrazovce).
- Lepicí páska, záchodové miny, kantýna s během, inventář, pejsek, výtah, výpadky světla, bouřka.
- Ovládání na PC i na mobilu (joystick + tlačítka).

## Multiplayer
Až 20 hráčů, režimy kooperace / hráč je strašidlo / závod, lobby se 4místným kódem.

- **Na claude.ai** (publikovaný artifact) se použije propojení přes claude.ai.
- **Na Netlify / jiném webu** se použije vlastní server ze složky `relay/` (Cloudflare Workers, zdarma).
  Jednorázové nastavení je v [`relay/README.md`](relay/README.md): nasadit server a jeho adresu (`wss://…`) zapsat do `mp-config.js`.
  Dokud je `mp-config.js` prázdný, tlačítko Multiplayer je vypnuté a hra běží jako singleplayer.

Hraní: jeden hráč dá **Multiplayer → Založit hru** a pošle ostatním 4místný kód, ostatní ho zadají v **Připojit se**.
Hostitel vybere režim a spustí hru.

## Ovládání (PC)
WASD/šipky pohyb · myš rozhlížení · Shift běh · F/klik páska · X záchod · V pes · B čůrání ·
I/Tab inventář · E/Q výtah · 1/2 kantýna · G/H/J pozdravy (multiplayer) · M zvuk · Esc pauza

## Aktualizace hry
Novou verzi ulož jako `index.html` do kořene repozitáře, pak:

```bash
git add index.html && git commit -m "Nová verze hry" && git push
```

Netlify ji nasadí sám. Pokud nová verze vznikla na claude.ai, zkontroluj, že v ní zůstal řádek
`<script src="mp-config.js"></script>` v `<head>` a funkce `relayNS` (jinak na Netlify nepůjde multiplayer).
