const stores = [
  { _id: 1, name: 'mpowerpromo.com' },
  { _id: 2, name: 'amazon.com' }
];

const categories = [
  { name: 'Aparel', _id: 1, stores: [1] },
  { name: 'Bag', _id: 2, stores: [1, 2] }
];

const facetGroup = [
  { _id: 1, name: 'Brand' },
  { _id: 2, name: 'Color' }
];

const fasets = [
  { _id: 1, name: 'nike', facetGroup: 1 },
  { _id: 2, name: 'Black', facetGroup: 2 }
];

const products = [
  {
    productId: 'T-shrirt',
    categories: [1, 2],
    facets: [1, 2],
    _id: 1
  },
  {
    productId: 'school bag',
    facets: [2],
    categories: [1],
    _id: 2
  }
];

// ---------------constants--------------- //

// stores
const AMAZON = 'amazon.com';
const MPOWERPROMO = 'mpowerpromo.com';
// categories
const BAG = 'Bag';
const APAREL = 'Aparel';
// fasets
const NIKE = 'nike';
const BLACK = 'Black';
// facetGroup
const BRAND = 'Brand';
const COLOR = 'Color';

// ---------------servises--------------- //

//  find store
const findStore = (storeName) => {
  const store = stores.find(({ name }) => name === storeName);
  return store ? store : ['No store'];
};

// find faset group id
const fasetGroupId = (facetGroupName) => facetGroup.find(({ name }) => name === facetGroupName)._id;

//  find faset
const findFaset = ({ fasetName, facetGroupName }) => {
  const faset = fasets.find(
    fasetName
      ? ({ name }) => name === fasetName
      : ({ facetGroup }) => facetGroup === fasetGroupId(facetGroupName)
  );
  return faset ? faset : ['No faset'];
};

// filter categories
const filterCategories = ({ store, categoryName }) => {
  let filtredCategories = [];
  if (categoryName) {
    filtredCategories = categories.filter(({ name }) => name.includes(categoryName));
  }
  if (store) {
    filtredCategories = categories.filter(({ stores }) => stores.includes(store._id));
  }
  return filtredCategories ? filtredCategories : ['No category'];
};

// filter product list
const filterProductList = ({ filtredCategories, faset }) => {
  let productsList = [];
  for (let i = 0; i < filtredCategories.length; i += 1) {
    productsList.push(
      ...products.filter(({ categories, facets }) =>
        !faset
          ? categories.includes(filtredCategories[i]._id)
          : categories.includes(filtredCategories[i]._id) && facets.includes(faset._id)
      )
    );
  }
  productsList = productsList.filter((el, i, arr) => arr.indexOf(el) === i);

  return productsList;
};

// render results
const renderResults = (fn) => fn.map((el) => (el.productId ? ` ${el.productId}` : el));

// ---------------result--------------- //

//create a function which return:

//1. List of all Bag products for mpowerpromo.com
const getProdactsList = (storeName, categoryName) => {
  const store = findStore(storeName);
  const filtredCategories = filterCategories({ store, categoryName });

  return filterProductList({ filtredCategories });
};

//2. List of all products for amazon.com
const getAllProdactsList = (storeName) => {
  const store = findStore(storeName);
  const filtredCategories = filterCategories({ store });

  return filterProductList({ filtredCategories });
};

//3. List of all Aparel nike products for amazon.com
const getAllFacetProdactsList = (storeName, categoryName, fasetName) => {
  const store = findStore(storeName);
  const faset = findFaset({ fasetName });
  const filtredCategories = filterCategories({ store, categoryName });
  return filterProductList({ filtredCategories, faset });
};

//4. List of all Color products for amazon.com
const getAllFacetGropeProdactsList = (storeName, facetGroupName) => {
  const store = findStore(storeName);
  const faset = findFaset({ facetGroupName });
  const filtredCategories = filterCategories({ store });

  return filterProductList({ filtredCategories, faset });
};

//Require to render in html view instead `Your results here`, prefer to use native js features, you are welcome to use libraries if its easy for you

const outputEl = document.querySelector('#content');

outputEl.innerHTML =
  `<p>1. List of all ${BAG} products for ${MPOWERPROMO}</p>` +
  renderResults(getProdactsList(MPOWERPROMO, BAG)) +
  `<p>2. List of all products for ${AMAZON}</p>` +
  renderResults(getAllProdactsList(AMAZON)) +
  `<p>3. List of all ${APAREL} ${NIKE} products for ${AMAZON}</p>` +
  renderResults(getAllFacetProdactsList(AMAZON, APAREL, NIKE)) +
  `<p>4. List of all ${COLOR} products for ${AMAZON}</p>` +
  renderResults(getAllFacetGropeProdactsList(AMAZON, COLOR));
