const slugify = (value) => {
  if (!value) {
    return 'team';
  }

  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/(^-|-$)+/g, '')
    .replace(/-{2,}/g, '-');
};

export default slugify;
