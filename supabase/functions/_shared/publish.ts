export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validatePost(post: any) {
 if (!post || !slugPattern.test(post.slug) || post.slug.length < 3 || post.slug.length > 90) throw new Error('Endereço inválido.');
 if (!['matematica','latex','tecnologia'].includes(post.category)) throw new Error('Categoria inválida.');
 if (typeof post.title !== 'string' || post.title.length < 5 || post.title.length > 160) throw new Error('Título inválido.');
 if (typeof post.description !== 'string' || post.description.length < 30 || post.description.length > 300) throw new Error('Resumo inválido.');
 if (typeof post.body !== 'string' || post.body.trim().length < 300 || post.body.length > 100000) throw new Error('O texto precisa ter entre 300 e 100.000 caracteres.');
 if (post.youtube && !/^[A-Za-z0-9_-]{11}$/.test(post.youtube)) throw new Error('ID do vídeo inválido.');
}
export function postMarkdown(post: any, date: string) {
 validatePost(post);
 const fields = {slug:post.slug,title:post.title,description:post.description,category:post.category,date:(post.published_at||date).slice(0,10),updated:date.slice(0,10),published:true,youtube:post.youtube||'',cmsId:post.id,cmsVersion:post.version};
 return `---\n${Object.entries(fields).map(([key,value])=>`${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${post.body.trim()}\n`;
}
