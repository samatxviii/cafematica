import fs from 'node:fs';
if(!fs.existsSync('dist/admin/index.html'))throw Error('Execute npm run build antes.');
fs.rmSync('admin-dist',{recursive:true,force:true});fs.mkdirSync('admin-dist/admin',{recursive:true});
for(const dir of ['_astro','assets'])fs.cpSync(`dist/${dir}`,`admin-dist/${dir}`,{recursive:true});
fs.copyFileSync('dist/admin/index.html','admin-dist/admin/index.html');
fs.copyFileSync('dist/admin/index.html','admin-dist/index.html');
fs.writeFileSync('admin-dist/robots.txt','User-agent: *\nDisallow: /\n');
fs.writeFileSync('admin-dist/_headers',`/*\n  X-Robots-Tag: noindex, nofollow\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' https: data:; connect-src 'self' https://*.supabase.co; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'\n`);
console.log('Painel exportado em admin-dist/. Hospede fora do GitHub Pages.');
