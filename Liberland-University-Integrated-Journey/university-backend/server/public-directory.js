const publicPages=['/','/index.html?catalogue=certificates','/index.html?page=research','/index.html?page=about','/honorary-recognition.html'];
const business=new Set(['hr-analytics','marketing-analytics','social-media','financial-analytics','financial-modelling-using-excel','business-analytics','business','leadership']);
const technology=new Set(['databases','data-engineering','cyber']);
const research=new Set(['governance','research']);

function escapeMarkup(value){
 return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function certificateUrl(slug){
 return '/index.html?programme='+encodeURIComponent(slug);
}

export function certificateDirectory(courses){
 const groups=new Map([
  ['Data analytics & business intelligence',[]],
  ['Artificial intelligence',[]],
  ['Business & leadership',[]],
  ['Technology & data engineering',[]],
  ['Governance & research',[]]
 ]);
 for(const course of courses){
  const group=business.has(course.slug)?'Business & leadership':
   technology.has(course.slug)?'Technology & data engineering':
   research.has(course.slug)?'Governance & research':
   /^(?:AI\b|Artificial Intelligence\b|Agentic AI\b)|^(?:Text Mining & NLP)$/.test(course.title)?'Artificial intelligence':
   'Data analytics & business intelligence';
  groups.get(group).push(course);
 }
 const sections=[...groups].filter(([,entries])=>entries.length).map(([group,entries])=>
  '<div><h3>'+escapeMarkup(group)+'</h3><ul>'+entries.map(course=>
   '<li><a href="'+certificateUrl(course.slug)+'">'+escapeMarkup(course.title)+'</a></li>').join('')+'</ul></div>'
 ).join('');
 return '<details class="campus-footer__certificates"><summary>Browse all '+courses.length+' certificates</summary><div class="campus-footer__subjects">'+sections+'</div></details>';
}

export function publicSitemap(origin,courses){
 const urls=[...publicPages,...courses.map(course=>certificateUrl(course.slug))];
 return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
  urls.map(url=>'  <url><loc>'+escapeMarkup(new URL(url,origin).href)+'</loc></url>').join('\n')+'\n</urlset>\n';
}
