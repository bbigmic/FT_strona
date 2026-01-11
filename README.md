# FT Strona - Strona główna

Strona główna firmy Feliz Trade Ltd.

## Wdrożenie na Vercel

### Krok 1: Repozytorium GitHub

```bash
cd FT_strona
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ft-strona.git
git push -u origin main
```

### Krok 2: Konfiguracja Vercel

1. Przejdź do [Vercel Dashboard](https://vercel.com/dashboard)
2. Kliknij "Add New Project"
3. Połącz z repozytorium GitHub: `ft-strona`
4. Vercel automatycznie wykryje Next.js - nie musisz zmieniać ustawień
5. Kliknij "Deploy"

### Krok 3: Zmienne środowiskowe

W Vercel Dashboard → Settings → Environment Variables dodaj:

- `NEXT_PUBLIC_SUPABASE_URL` - URL Twojego projektu Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key z Supabase
- `SMTP_HOST` - Host SMTP (np. s134.cyber-folks.pl)
- `SMTP_PORT` - Port SMTP (np. 465)
- `SMTP_USER` - Użytkownik SMTP
- `SMTP_PASSWORD` - Hasło SMTP

### Lokalny rozwój

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:3000`

