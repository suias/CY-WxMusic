// pages/search-detail/search-detail.js
import { searchMusic } from "../../service/api_music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 2057696725,
    keywords: "spiral",
    MusicList:{}
  },

  async SearchMusic(keywords) {
    const res = await searchMusic(keywords);
    console.log("SearchMusic", res.result.songs);
    this.setData({
      MusicList: res.result.songs,
    });
  },

  async onClickToMusic(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/music-player/music-player?id=${id}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //console.log("options", options);
    if(options.keywords!=""){
      this.setData({
        keywords:options.keywords
      });
    }
    this.SearchMusic(this.data.keywords);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})