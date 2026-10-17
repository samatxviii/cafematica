/**
 * Ação de entrada do Pages CMS: move somente Markdown sob content/posts
 * entre a raiz e as três pastas permitidas. O slug no frontmatter nunca muda;
 * src/pages/blog/[slug].astro usa este slug, não o local físico do arquivo.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export function planArticleMove(payload,root=process.cwd()){
  if(!payload||payload.source!=='pages-cms'||payload.action?.name!=='move-post-folder'){
    throw new Error('A solicitação não veio da ação autorizada do Pages CMS.');
  }
  if(payload.repository?.owner!=='samatxviii'||payload.repository?.repo!=='cafematica'||payload.repository?.ref!=='main'){
    throw new Error('Somente a branch main do repositório Cafemática pode mover artigos.');
  }
  const ctx=payload.context;
  if(ctx?.type!=='entry'||ctx.name!=='posts'){
    throw new Error('A ação precisa partir de um artigo aberto no editor.');
  }
  const currentPath=String(ctx.path||'');
  const folder=String(payload.inputs?.folder||'');
  if(!/^(?:raiz|matematica|latex|tecnologia)$/.test(folder)){
    throw new Error('Pasta de destino não autorizada.');
  }
  // Não interpretamos caminhos fornecidos por terceiros como caminhos arbitrários.
  if(!/^content\/posts\/(?:(?:matematica|latex|tecnologia)\/)?[a-z0-9-]+\.md$/.test(currentPath)){
    throw new Error('Caminho do artigo inválido ou fora das pastas permitidas.');
  }
  const fileName=path.posix.basename(currentPath);
  const relativeDestination=path.posix.join('content/posts',...(folder==='raiz'?[]:[folder]),fileName);
  const source=path.resolve(root,currentPath);
  const destination=path.resolve(root,relativeDestination);
  if(!fs.existsSync(source)||!fs.statSync(source).isFile()){
    throw new Error('O artigo não está mais no local original. Atualize o Pages CMS.');
  }
  if(source!==destination&&fs.existsSync(destination)){
    throw new Error('Já existe um arquivo com este nome na pasta de destino.');
  }
  const {data}=matter(fs.readFileSync(source,'utf8'));
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug||''))){
    throw new Error('Slug inválido. Cancelado para preservar o link do artigo.');
  }
  return {source,destination,slug:data.slug,currentPath,relativeDestination,noChange:source===destination};
}

export function moveArticle(payload,root=process.cwd()){
  const plan=planArticleMove(payload,root);
  if(plan.noChange)return {...plan,moved:false};
  fs.mkdirSync(path.dirname(plan.destination),{recursive:true});
  fs.renameSync(plan.source,plan.destination);
  return {...plan,moved:true};
}

if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
  const input=process.env.PAGES_CMS_ACTION_PAYLOAD;
  if(!input)throw new Error('PAGES_CMS_ACTION_PAYLOAD está ausente.');
  const result=moveArticle(JSON.parse(input));
  console.log(result.moved
    ? 'Artigo movido: '+result.currentPath+' -> '+result.relativeDestination+'; URL pública preservada: /blog/'+result.slug+'/'
    : 'Artigo já está na pasta escolhida: '+result.relativeDestination);
}
