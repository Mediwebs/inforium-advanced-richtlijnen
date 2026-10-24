// A distinct catalogue boundary, also applied when restoring saved items.
export const clientResources=rows=>rows.filter(r=>r.audience==='patient');
