import {describe,it,expect} from 'vitest';
import {parseHTML} from 'linkedom';
import fs from 'node:fs';
import vm from 'node:vm';
const home=fs.readFileSync('src/pages/index.astro','utf8');
const layout=fs.readFileSync('src/layouts/Base.astro','utf8');
const css=fs.readFileSync('src/styles/editorial-v2.css','utf8');
const js=fs.readFileSync('src/scripts/site.js','utf8').replace('export function toast','function toast');

describe('Cafemática 2.0: editorial and preservation',()=>{
  it('preserves the mandatory hero and the three editorial subjects',()=>{
    expect(home).toContain('Aprender pode ser tão agradável quanto uma');
    expect(home).toContain('conversa com café');
    for(const subject of ['Matemática','LaTeX','Tecnologia'])expect(home).toContain(subject);
    expect(home).toContain('data-math-studio');
  });
  it('preserves GA4 consent and existing SEO infrastructure',()=>{
    expect(layout).toContain('data-analytics-id={analyticsId||undefined}');
    expect(layout).toContain('google-site-verification');
    expect(layout).toContain('rel="canonical"');
    expect(js).toContain("cafematica_privacy_v2");
    expect(js).toContain('if(!gaEnabled||!getPreferences().analytics');
  });
  it('includes mobile and reduced-motion styles',()=>{
    expect(css).toContain('max-width:520px');
    expect(css).toContain('prefers-reduced-motion:reduce');
    expect(css).toContain('.knowledge-grid');
  });
  it('updates the line when the user changes the slope',()=>{
    const {window,document}=parseHTML('<html><body><div data-math-studio><input id="slope-control" value="2"/><path data-graph-line></path><span data-slope-label></span><span data-slope-value></span></div></body></html>');
    const control=document.querySelector('#slope-control');
    control.value='2';
    vm.runInNewContext(js,{window,document,localStorage:{getItem:()=>null},setTimeout,clearTimeout,Date});
    expect(document.querySelector('[data-slope-label]').textContent).toBe('2');
    const before=document.querySelector('[data-graph-line]').getAttribute('d');
    control.value='-1';
    control.dispatchEvent(new window.Event('input'));
    expect(document.querySelector('[data-slope-value]').textContent).toBe('-1');
    expect(document.querySelector('[data-graph-line]').getAttribute('d')).not.toBe(before);
  });
});
