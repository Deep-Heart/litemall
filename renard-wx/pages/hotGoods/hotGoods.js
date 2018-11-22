var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    bannerInfo: {
      'imgUrl': '',
      'name': ''
    },
    categoryFilter: false,
    filterCategory: [],
    goodsList: [],
    categoryId: 0,
    currentSortType: 'default',
    currentSort: 'add_time',
    currentSortOrder: 'desc',
    page: 1,
    size: 100
  },
  getBanner: function() {
    let that = this;
    util.request(api.GoodsHot).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          bannerInfo: res.data.bannerInfo,
        });
      }
    });
  },
  getCategoryList: function() {
    var that = this;

    util.request(api.GoodsFilter, {
        isHot: 1
      })
      .then(function(res) {
        if (res.errno === 0) {
          that.setData({
            filterCategory: res.data.filterCategoryList,
          });
        }
      });
  },
  getGoodsList: function() {
    var that = this;

    util.request(api.GoodsList, {
        isHot: true,
        page: that.data.page,
        size: that.data.size,
        order: that.data.currentSortOrder,
        sort: that.data.currentSort,
        categoryId: that.data.categoryId
      })
      .then(function(res) {
        if (res.errno === 0) {
          that.setData({
            goodsList: res.data.goodsList,
            filterCategory: res.data.filterCategoryList
          });
        }
      });

  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getBanner();
    this.getGoodsList();
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  openSortFilter: function(event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          categoryFilter: !this.data.categoryFilter,
          currentSortType: 'category',
          currentSort: 'add_time',
          currentSortOrder: 'desc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          currentSortType: 'price',
          currentSort: 'retail_price',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          currentSortType: 'default',
          currentSort: 'add_time',
          currentSortOrder: 'desc',
          categoryFilter: false,
          categoryId: 0,
        });
        this.getGoodsList();
    }
  },
  selectCategory: function(event) {
    let currentIndex = event.target.dataset.categoryIndex;
    this.setData({
      'categoryFilter': false,
      'categoryId': this.data.filterCategory[currentIndex].id
    });
    this.getGoodsList();
  }
})