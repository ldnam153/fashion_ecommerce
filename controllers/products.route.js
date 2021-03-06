const express = require("express");
const categoryModel = require("../models/category.model");
const productsModel = require("../models/products.model");
const { paginate } = require("./../config/default.json");
const moment = require('moment');
const router = express.Router();
//Xem ds tất cả sản phẩm
router.get("/", async function (req, res) {
  let cate1Id = +req.params.id;
  var sort = req.query.sort || "asc"
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productsModel.countAllProducts(cate1Id);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
      sort
    });
  }

  const offset = (page - 1) * paginate.limit;

  let allProducts = await productsModel.allProduct(offset, sort);
  let allCategories = await productsModel.allCategoriesWithQuantity();
  console.log(allProducts)
  if (allProducts !== null)
    for (let i = 0; i < allProducts.length; i++) {
      let img = await productsModel.getImages(allProducts[i].maso);
      allProducts[i].avatar = img[0].link;
    }
  var increase ;
  var descrease;

  res.render("../views/vwProducts/allProduct.hbs", {
    layout: "main.hbs",
    products: allProducts,
    empty: !allProducts,
    onlyOne: nPages < 1,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    page_numbers,
    allCategories,
    currentPage: page,
    increase: sort === "asc" ,
    descrease: sort === "desc" ,
    sort
  });
});
//Xem chi tiet sanpham
router.get('/:id', async function (req, res, next) {
  console.log(req.params)
    const id = +req.params.id;
    const product = await productsModel.single(id)
    if (+product.giotinhsudung === 0)
      product.giotinhsudung = "Nam"
    else if (+product.giotinhsudung === 1)
      product.giotinhsudung = "Nữ"
    else
      product.giotinhsudung = "Unisex"
    
    const images = await productsModel.getImages(id)
    const shop = await productsModel.getShopFromIdProduct(id)
    for(var i = 0; i < images.length; i++){
        images[i].isActive = false;
    }
    images[0].isActive = true;
    const avatar = images[0]
    var relativeProduct = await productsModel.getRelativeProduct(id)
    var comment = await productsModel.getComment(id)
    for(var i = 0; i < comment.length; i++){
      comment[i].ngaythang = moment(comment[i].ngaythang).format('DD-MM-YYYY')
    }
    var luotmua = await productsModel.getLuotMua(id)
    const star = productsModel.convertRating(product.diemdanhgia)
    product.giaban = productsModel.formatPrice(product.giaban)
    const isNewest = await productsModel.isNewest(id)
    const isBestSeller = await productsModel.isBestSeller(id)
    res.render("vwProducts/detailProduct",
    {
        avatar,
        images,
        product,
        relativeProduct,
        comment,
        luotmua,
        star,
        shop,
        isNewest,
        isBestSeller
        
    })
});
//Xem ds sản phẩm theo danh mục 1
router.get("/byCat1/:id", async function (req, res) {
  let cate1Id = +req.params.id;
  var sort = req.query.sort || "asc"
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productsModel.countAllByCate1(cate1Id);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
      sort
    });
  }

  const offset = (page - 1) * paginate.limit;

  let allProductsFromCate1 = await productsModel.getAllProductsByCate1Id(
    cate1Id,
    offset,
    sort
  );
  let cate1Name = await categoryModel.getCateName1ById(cate1Id);
  let allCategories = await productsModel.allCategoriesWithQuantity();

  if (allProductsFromCate1 !== null)
    for (let i = 0; i < allProductsFromCate1.length; i++) {
      let img = await productsModel.getImages(allProductsFromCate1[i].maso);
      allProductsFromCate1[i].avatar = img[0].link;
    }
    
  res.render("../views/vwProducts/byCat1.hbs", {
    layout: "main.hbs",
    products: allProductsFromCate1,
    empty: !allProductsFromCate1,
    onlyOne: nPages < 1,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    page_numbers,
    cate1Name,
    cate1Id,
    allCategories,
    currentPage: page,
    increase: sort === "asc" ,
    descrease: sort === "desc" ,
    sort,
  });
});
//Xem ds sản phẩm theo danh mục 2
router.get("/byCat2/:id", async function (req, res) {
  let cate2Id = +req.params.id;
  let cate1Id = await categoryModel.getCate1IdFromCate2Id(cate2Id);
  var sort = req.query.sort || "asc"
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productsModel.countAllByCate2(cate2Id);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
      sort
    });
  }

  const offset = (page - 1) * paginate.limit;

  let allProductsFromCate2 = await productsModel.getAllProductsByCate2Id(
    cate2Id,
    offset,
    sort
  );
  let cate1Name = await categoryModel.getCateName1ById(cate1Id);
  let cate2Name = await categoryModel.getCateName2ById(cate2Id);
  let allCategories = await productsModel.allCategoriesWithQuantity();

  if (allProductsFromCate2 !== null)
    for (let i = 0; i < allProductsFromCate2.length; i++) {
      let img = await productsModel.getImages(+allProductsFromCate2[i].maso);
      allProductsFromCate2[i].avatar = img[0].link;
    }

  res.render("../views/vwProducts/byCat2.hbs", {
    layout: "main.hbs",
    products: allProductsFromCate2,
    empty: !allProductsFromCate2,
    onlyOne: nPages < 1,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    page_numbers,
    cate1Name,
    cate2Name,
    cate1Id,
    cate2Id,
    allCategories,
    currentPage: page,
    increase: sort === "asc" ,
    descrease: sort === "desc" ,
    sort
  });
});

//Search sản phẩm
router.get("/search/keyword", async function (req, res) {
  console.log(req.query)
  var keyword = req.query.search || "";
  var sort = req.query.sort || "asc"
  var page = req.query.page || 1;
  
  var total = await productsModel.countSearchRelevant(keyword);
  total = total.length
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
      sort,
      search_term: keyword
    });
  }

  let allCategories = await productsModel.allCategoriesWithQuantity();

  const offset = (page - 1) * paginate.limit;
  var list = await productsModel.searchRelevant(offset, keyword, sort);

  if (list !== null)
    for (let i=0; i<list.length; i++) {
        let img = await productsModel.getImages(+list[i].maso);
        list[i].avatar = img[0].link;
      }

  res.render("../views/vwProducts/search_results.hbs", {
    products: list,
    page_numbers,
    empty: !list.length,
    n_result: total,
    search_term: keyword,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    onlyOne: nPages <= 1,
    allCategories,
    currentPage: page,
    increase: sort === "asc" ,
    descrease: sort === "desc" ,
    sort
  });
});

router.get("/search/common", async function (req, res) {
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let search_term = req.session.search_term;

  const total = await productsModel.countAllProducts();
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  let allCategories = await productsModel.allCategoriesWithQuantity();

  const offset = (page - 1) * paginate.limit;
  var list = await productsModel.allProductWithOffset(offset);

  if (list !== null)
    for (let i=0; i<list.length; i++) {
        let img = await productsModel.getImages(+list[i].maso);
        list[i].avatar = img[0].link;
      }

  res.render("../views/vwProducts/search_results.hbs", {
    products: list,
    page_numbers,
    empty: !list.length,
    n_result: total,
    search_term,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    onlyOne: nPages <= 1,
    allCategories,
  });
});

router.get("/search/search-result-most-relevant", async function (req, res) {
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let search_term = req.session.search_term;

  const total = await productsModel.countSearchRelevant(search_term);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  let allCategories = await productsModel.allCategoriesWithQuantity();

  const offset = (page - 1) * paginate.limit;
  var list = await productsModel.searchRelevant(offset, search_term);

  if (list !== null)
    for (let i=0; i<list.length; i++) {
        let img = await productsModel.getImages(+list[i].maso);
        list[i].avatar = img[0].link;
      }

  res.render("../views/vwProducts/search_results.hbs", {
    products: list,
    page_numbers,
    empty: !list.length,
    n_result: total,
    search_term,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    onlyOne: nPages <= 1,
    allCategories,
  });
});

module.exports = router;
