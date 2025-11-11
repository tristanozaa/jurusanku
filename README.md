# jurusanku

## cara setup

```bash
gh repo clone tristanozaa/jurusanku
npm install
npm run dev
```

## beberapa hal yang perlu diperhatikan saat deploy

1. pastikan config netlify udah bener (netlify.toml), cuma perlu salah satu diantara ui atau .toml. benerin run command sama build directory.
2. perhatikan juga vite.config.ts, siapa tau ada yang salah.
3. ternyata api key itu sangat krusial, kalau implementasinya gak lengkap, bahkan web gak render sama sekali. secara default/best practice, .env.local itu gak diupload ke git, tapi supaya gampang lgsg ku-upload aja. gila sih, kelupaan gara2 asal copy / asal deploy mbenerinnya 1 minggu...
