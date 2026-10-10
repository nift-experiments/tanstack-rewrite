"""Strict full-document rendering comparison under the recorded fixture scope."""
import hashlib,json
from pathlib import Path
from PIL import Image,ImageChops
root=Path(__file__).resolve().parents[1]
artifacts=root.parent/'tanstack-rewrite-baseline/documentation-layout-pixels'
rows=[]
for width in (1440,390):
 for theme in ('dark','light'):
  name=f'{width}-{theme}';reference=artifacts/(name+'-reference.png');candidate=artifacts/(name+'-candidate.png')
  a=Image.open(reference).convert('RGB');b=Image.open(candidate).convert('RGB')
  assert a.size==b.size,(name,a.size,b.size)
  assert ImageChops.difference(a,b).getbbox() is None,name
  rows.append(dict(width=width,theme=theme,image_size=a.size,exact_rgb_pixels_equal=True,reference_sha256=hashlib.sha256(reference.read_bytes()).hexdigest(),candidate_sha256=hashlib.sha256(candidate.read_bytes()).hexdigest()))
receipt=dict(scope='Full Query overview: retained Navbar/docs layout/title/TOC/feedback chrome/sidebar/partner rail/recent posts/footer and independent Nift article; matched fresh upstream placement seed; third-party fonts unavailable in both, matching frozen reference font scope. No complete corpus, production-font, metadata or service acceptance.',threshold='Exact RGB dimensions and pixels; no raster tolerance or masked regions',states=rows,initial_defect_corrected='Missing footer produced a real page-height difference; retain exact upstream footer')
(root/'evidence/r3/documentation-layout-pixel-proof.json').write_text(json.dumps(receipt,indent=2)+'\n')
print('Four full documentation layout states match exact RGB pixels')
