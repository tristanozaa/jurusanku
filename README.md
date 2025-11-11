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
4. kalau udah pakai api di deployment, kamu juga harus perhatiin di backend juga (supabase), bikin dulu edge functionnya supaya bisa berfungsi

## sedih

sedih woi, ini pake ai tanpa pemahaman webdev sama sekali itu lose-lose situation (ditambah pakai ai kroco itu bikin mati sih), kayaknya bakal sering deh kita dikasih solusi dimana solusi itu bukan yang paling efektif.

'kan aku nyuruh gemini buat ngeclose ketika diklik. tai loh ya, masak udah jelas tertera dicode kalau ada fungsi onclose, dia malah bikin fungsi baru handleonclick.
