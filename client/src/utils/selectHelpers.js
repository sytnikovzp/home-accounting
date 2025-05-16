const groupByFirstLetter = (items, labelKey, valueKey) =>
  items.reduce((acc, item) => {
    const firstLetter = item[labelKey][0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({
      label: item[labelKey],
      value: item[valueKey],
    });
    return acc;
  }, {});

const formatItems = (items, valueKey, labelKey) =>
  items.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));

export { formatItems, groupByFirstLetter };
