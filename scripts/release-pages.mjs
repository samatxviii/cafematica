// Optional export for hosts that publish the repository root. Default deployment uses dist/.
import fs from 'node:fs';
import path from 'node:path';
const manifest='.generated-pages.json';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(path.join(dir,f.name)):[path.join(dir,f.name)]);
if(!fs.existsSync('dist/index.html'))throw Error('Execute npm run build antes.');
const protectedFiles=new Set(['CNAME','og-cafematica.png']);
const files=walk('dist').map(f=>path.relative('dist',f)).filter(f=>!protectedFiles.has(f));
for(const file of fs.existsSync(manifest)?JSON.parse(fs.readFileSync(manifest,'utf8')):[]){if(file.includes('..')||path.isAbsolute(file))throw Error('Manifesto inválido');if(!files.includes(file))fs.rmSync(file,{force:true});}
for(const file of files){fs.mkdirSync(path.dirname(file),{recursive:true});fs.copyFileSync(path.join('dist',file),file);}
fs.writeFileSync(manifest,JSON.stringify(files,null,2)+'\n');console.log('Exportação estática atualizada na raiz.');
