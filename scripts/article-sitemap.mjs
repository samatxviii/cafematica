/**
 * Acrescenta <lastmod> apenas aos artigos. O sinal deve refletir uma revisão
 * significativa informada no CMS, sem atualizar todas as páginas artificialmente.
 */
export function addArticleLastmod(xml, posts, siteUrl) {
  const dates = new Map(posts.map(post => [
    new URL('/blog/' + post.slug + '/', siteUrl).href,
    post.updated && post.updated >= post.date ? post.updated : post.date
  ]));
  return xml.replace(/<url>[\s\S]*?<\/url>/g, entry => {
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1]?.replace(/&amp;/g, '&');
    const lastmod = dates.get(location);
    if (!lastmod) return entry;
    if (/<lastmod>[^<]*<\/lastmod>/.test(entry)) {
      return entry.replace(/<lastmod>[^<]*<\/lastmod>/, '<lastmod>' + lastmod + '</lastmod>');
    }
    return entry.replace('</url>', '<lastmod>' + lastmod + '</lastmod></url>');
  });
}
