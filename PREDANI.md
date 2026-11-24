# Útěk ze školy – předání na jiný účet Claude

## 1. Prompt pro nový účet (zkopíruj do nové konverzace na claude.ai)

Do nové konverzace nahraj soubor `utek-ze-skoly.html` (nebo `index.html` ze ZIPu) a tento soubor `PREDANI.md`, a pak vlož:

---
Nahrál jsem hotovou 3D hru „Útěk ze školy“ v jednom HTML souboru a předávací dokument PREDANI.md s popisem projektu.
Publikuj soubor beze změny jako artifact s názvem „Útěk ze školy“ a faviconou 👻.
Při publikování deklaruj capabilities `{"room": {}}`, protože hra má multiplayer přes room (join, presence, peers).
Soubor nijak neupravuj a nepřepisuj, jen ho zkopíruj do /mnt/user-data/outputs/ a publikuj.
Pak mi pošli odkaz. Při dalších úpravách vycházej z popisu v PREDANI.md.
---

Po publikování: Share → pozvi spoluhráče e-mailem. Multiplayer funguje jen pro přihlášené hráče, kterým je hra nasdílená.

## 2. Co hra je

3D hororová hra v prohlížeči v budově Moravské střední školy (Olomouc). Jeden soubor HTML (~7 MB),
uvnitř Three.js r128 + EffectComposer/UnrealBloomPass, fonty Cinzel Decorative a Poppins (woff2 base64),
zvuky (MP3 base64), textury z fotek školy. Žádné externí domény.

## 3. Funkce

- **Cíl:** najít 5 klíčů (stačí 3), odemknout hlavní dveře a utéct.
- **Budova:** přízemí (hala, kantýna, tělocvična, výtah, schodiště), patra 2–7 s chodbami, učebnami a kabinety.
- **Tvorba postavy (před hrou):** 5 barev kůže; na hlavu: nic, kšiltovka, kulich, hlava klauna, medvěda, žáby, koňská hlava,
  helma na motorku, rytířská helma, koruna, párty klobouk, cylindr, hrnec; oblečení: tričko, mikina, kabát, bunda, vesta,
  banánový kostým, baletní sukýnka, plášť hrdiny, havajská košile; 8 barev oblečení; boty: tenisky, kanady, sandály,
  gumáky, klaunské boty; zvířecí parťák (vlastní, ne Pokémoni): kočka Micka, sovička Hůhů, dráček Plamínek, sliz Bloblík, liška Rezka.
  Výběr se ukládá do localStorage (`utek_look`), v multiplayeru se posílá ostatním (`lk` v presence).
- **Postavy:** stylizované 3D modely (~1,5 m, širší, velká hlava, kreslené oči), sloučené geometrie s vertex colors.
- **Strašidla:** David Dufek / Daniel Dufek (výběr na startu), animovaný rig z fotky, modrá omráčená podoba, vlastní hlasy.
  Po 4 minutách se objeví druhý učitel (ten druhý z nabídky). Každé 3 minuty se strašidla na 30 s rozzuří
  a běhají rychlostí běžícího hráče (odpočet nahoře na obrazovce, varování 10 s předem).
- **Předměty a mechaniky:** lepicí páska (omráčí na 10 s), propustky – bílá kartička, past na strašidlo (zpomalí / omráčí;
  hráč má na začátku 5 a za každý nalezený klíč +5; v kódu pořád objekt `TOIL` a funkce `throwToilet`, počet v `PASS`),
  papuče (5 kusů náhodně po škole, v inventáři, klávesa P = 10 s neviditelný pro strašidla, `INVIS`, v multiplayeru `iv` v presence),
  mince a kantýna (běh), inventář (baterie, zvonek, papuče), pejsek, výtah, výpadky světla, bouřka, tlukot srdce.
  Čůrání a jídlo (čokoláda, energiťák) byly odstraněny.
- **Vzhled:** hororový filtr (zrno, vinětace, barevné ladění, chromatická aberace při blízkosti strašidla), záře světel (jen PC),
  krev a nápisy na stěnách, prach. Ve škole je většinou světlo, zhasíná v nepravidelných intervalech.
- **Multiplayer (claude.ai přes capability room, jinde přes vlastní relay server – viz níže):** lobby s 4místným kódem, až 20 hráčů, režimy Kooperace,
  Hráč je strašidlo, Závod; deterministický seed (mulberry32), presence 10×/s, pozdravy G/H/J.
- **Mobil:** joystick, look pad, tlačítka akcí, fullscreen.

## 4. Ovládání (PC)
WASD/šipky pohyb · myš rozhlížení · Shift běh · F/klik páska · X propustka · P papuče · V pes · I/Tab inventář ·
E/Q výtah · 1/2 kantýna · G/H/J pozdravy · M zvuk · Esc pauza

## 5. Poznámky pro další vývoj
- Upravuj vždy celý soubor a před publikováním ho otestuj; při republikování stejného artifactu nech capabilities beze změny.
- Na GitHubu/Netlify multiplayer funguje přes vlastní server `relay/` (Cloudflare Worker). Hra má funkci `relayNS`,
  která napodobuje API claude.ai room (join/presence/peers/onPeers/leave) přes WebSocket; použije se, když chybí `window.claude`
  a `mp-config.js` obsahuje adresu `wss://…`. Při úpravách hry na claude.ai zachovej `relayNS`, `getRoomNS` a
  `<script src="mp-config.js"></script>` v `<head>`. V kódu nepoužívej `Math.random` pro síťové věci – je seedovaný kvůli společné mapě.
- Při spuštění hry se zobrazí zámek s heslem (`#gate`, `UTEK_OK`, `GATE_HASH`; heslo je uložené jen jako otisk, zapamatuje se v `sessionStorage` klíč `utek_ok`, aby multiplayer po restartu stránky nechtěl heslo znovu). Při úpravách hry ho zachovej.
- Repozitář: https://github.com/dfkartkitchen/utek-ze-koly (push do `main` = nasazení na Netlify).
- Pokémony ani jiné chráněné postavy do hry nepřidávat.
