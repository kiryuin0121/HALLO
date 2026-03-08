export const fetchCategories = async () => {
  // console.log("fetchCategories has called."); //ok
  const res = await fetch("/api/avatar/categories");
  const data = await res.json();
  const { categories } = data;
  // console.log("categories(fetchCategories):",categories);
  return categories;
};

export const fetchDefaultParts = async (defaultPartsId: string) => {
  // console.log("fetchDefaultParts has called."); //ok
  const res = await fetch(`/api/avatar/parts/${defaultPartsId}`);
  const data = await res.json();
  // console.log(data);
  const { parts:defaultParts } = data;
  // console.log("defaultParts(fetchDefaultParts):",defaultParts);//ok
  return defaultParts;
};
