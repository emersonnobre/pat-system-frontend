export function orderBy(array, key, order = 'asc') {
  return array.slice().sort((a, b) => {
    const aValue = getNestedPropertyValue(a, key);
    const bValue = getNestedPropertyValue(b, key);

    // Função auxiliar para lidar com propriedades aninhadas
    function getNestedPropertyValue(obj, path) {
      return path.split('.').reduce((o, k) => (o || {})[k], obj);
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * (order === 'asc' ? 1 : -1);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return (aValue.getTime() - bValue.getTime()) * (order === 'asc' ? 1 : -1);
    } else {
      return (aValue - bValue) * (order === 'asc' ? 1 : -1);
    }
  });
}