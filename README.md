# Wunderlich Elektrotechnik – Website

Professionelle Handwerker-Website für Wunderlich Elektrotechnik, Witten.
Gebaut mit Next.js 15, TypeScript, Tailwind CSS.

---

## Lokal starten

### 1. Voraussetzungen

- Node.js 18+ (empfohlen: Node 20 oder neuer)
- npm 9+

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen einrichten

```bash
# .env.example kopieren
cp .env.example .env.local
```

Dann `.env.local` öffnen und die Werte eintragen:

```env
RESEND_API_KEY=re_xxxxxxxxxx        # Von resend.com → API Keys
CONTACT_EMAIL=ihre@email.de         # Wohin Kontaktformular-E-Mails gehen
NEXT_PUBLIC_SITE_URL=https://ihre-domain.de
```

**Resend-Konto einrichten:**
1. Kostenlos registrieren unter [resend.com](https://resend.com)
2. Ihre Domain verifizieren (DNS-Eintrag)
3. API-Key erstellen und in `.env.local` eintragen

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Website ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

## Deployment auf Vercel

### Option A: Git-Push (empfohlen)

1. Auf [github.com](https://github.com) ein neues Repository anlegen
2. Lokales Projekt verbinden:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/IHR-NAME/REPO-NAME.git
   git push -u origin main
   ```
3. Auf [vercel.com](https://vercel.com) anmelden (kostenlos mit GitHub-Account)
4. „New Project" → GitHub-Repository auswählen → „Deploy"
5. Umgebungsvariablen in Vercel unter „Settings → Environment Variables" eintragen

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## Umgebungsvariablen

| Variable | Beschreibung | Pflicht |
|----------|-------------|---------|
| `RESEND_API_KEY` | API-Key von resend.com | Ja (für Kontaktformular) |
| `CONTACT_EMAIL` | Ziel-E-Mail für Kontaktformular | Ja |
| `NEXT_PUBLIC_SITE_URL` | Öffentliche URL der Website (ohne `/` am Ende) | Nein (Fallback: `https://wunderlich-elektrotechnik.de`) |

---

## Projektstruktur

```
app/
├── layout.tsx              ← Root-Layout (Header, Footer, SEO)
├── page.tsx                ← Startseite
├── sitemap.ts              ← Automatische Sitemap
├── robots.ts               ← robots.txt
├── leistungen/
│   ├── page.tsx            ← Leistungsübersicht
│   ├── klimaanlagen/       ← Klimaanlagen-Unterseite
│   ├── waermepumpen/
│   ├── elektroinstallation/
│   ├── photovoltaik/
│   ├── wallbox/
│   ├── wartung/
│   └── klimaanlagen-witten/ ← Template für Stadt-Seiten
├── ueber-mich/
├── referenzen/
├── kontakt/
├── impressum/
├── datenschutz/
├── agb/
└── api/
    └── contact/route.ts    ← E-Mail-API (Resend)

components/
├── Header.tsx
├── Footer.tsx
├── Hero.tsx
├── ServiceCard.tsx
├── CTA.tsx
├── ContactForm.tsx
├── FAQ.tsx
├── StickyMobileCTA.tsx
├── CookieBanner.tsx
└── GoogleMapsEmbed.tsx

lib/
└── utils.ts                ← cn()-Hilfsfunktion für Tailwind
```

---

## Nach dem Deployment: To-Do-Liste

- [ ] E-Mail-Adresse eintragen (Impressum, Datenschutz, Kontaktseite, API-Route)
- [ ] Steuernummer und USt-IdNr. im Impressum ergänzen
- [ ] Resend-Domain verifizieren und E-Mail-Versand testen
- [ ] Google Business Profil anlegen (für Bewertungen und Maps)
- [ ] Echte Referenzfotos hochladen (aktuell: Platzhalter)
- [ ] Foto von Sebastian in /ueber-mich einfügen
- [ ] Google Maps Embed-Link auf die korrekte Adresse anpassen
- [ ] AGB durch Rechtsbeistand erstellen lassen und einfügen
- [ ] Stadt-Landingpages nach dem Template `/leistungen/klimaanlagen-witten` erstellen
- [ ] Domain auf Vercel konfigurieren
- [ ] NEXT_PUBLIC_SITE_URL auf echte Domain setzen

---

## Weitere Stadt-Landingpages erstellen

Template liegt unter `/app/leistungen/klimaanlagen-witten/page.tsx`.
Für weitere Seiten den Ordner kopieren und anpassen:

```
app/leistungen/klimaanlagen-hattingen/page.tsx
app/leistungen/klimaanlagen-gevelsberg/page.tsx
app/leistungen/waermepumpen-witten/page.tsx
app/leistungen/elektroinstallation-hagen/page.tsx
```

---

## Technologie-Stack

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Next.js | 15 | Framework (App Router) |
| TypeScript | 5 | Typsicherheit |
| Tailwind CSS | 3 | Styling |
| Lucide React | latest | Icons |
| React Hook Form | 7 | Formular-State |
| Zod | 3 | Validierung |
| Resend | 4 | E-Mail-Versand |
