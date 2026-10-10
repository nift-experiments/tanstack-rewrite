"""Strict isolated-component raster comparison; not a full-page parity gate."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops

root = Path(__file__).resolve().parents[1]
images = root.parent / 'tanstack-rewrite-baseline/article-pixels'
results = []
for width in (1440, 390):
    for theme in ('dark', 'light'):
        prefix = f'{width}-{theme}'
        reference = images / f'{prefix}-reference.png'
        candidate = images / f'{prefix}-candidate.png'
        a = Image.open(reference).convert('RGB')
        b = Image.open(candidate).convert('RGB')
        assert a.size == b.size, (prefix, a.size, b.size)
        assert ImageChops.difference(a, b).getbbox() is None, prefix
        results.append({
            'width': width, 'theme': theme, 'image_size': a.size,
            'exact_pixels_equal': True,
            'reference_sha256': hashlib.sha256(reference.read_bytes()).hexdigest(),
            'candidate_sha256': hashlib.sha256(candidate.read_bytes()).hexdigest(),
        })
receipt = {
    'scope': 'Query overview article fragment only; actual upstream DOM cloned into the same isolated geometry/styles to exclude overlapping sticky shell controls. Candidate renders independently from maintained Markdown. No full-shell, CSS-build or whole-page acceptance.',
    'threshold': 'Exact RGB dimensions/pixels; no image tolerance',
    'results': results,
}
(root / 'evidence/r3/article-pixel-proof.json').write_text(json.dumps(receipt, indent=2) + '\n')
print('Four isolated article states match exact RGB pixels')
