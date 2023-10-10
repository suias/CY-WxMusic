// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/api_player";
import { parseLyric } from "../../utils/parse-lyric";
const app = getApp();
const audioContext = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 歌曲id
    currentSong: {}, // 当前播放歌曲
    songLyric: {}, //歌词
    statusHeight: 0, // 状态栏高度
    currentPage: 0, //页面
    contentHeight: 500,//内容高度
    currentTime: 0, //当前歌曲播放的时间 
    durationTime: 0, //当前歌曲播放的总时间   
    sliderValue: 0, //当前歌曲滑块进度  
    isSliderChanging: false, //是否正在滑动
    isPlaying:true, //是否播放
    currentLyricText: "", //当前歌词
    currentLyricIndex: -1, //歌词下标
  },
  
  async fetchSongDetail(id) {
    const res = await getSongDetail(id);
    console.log("fetchSongDetail", res);
    this.setData({
      currentSong: res.songs[0],
    });
  },

  async fetchSongLyric(id) {
      await getSongLyric(id).then(res => {
      const lrcString =res.lrc.lyric
      const songLyric = parseLyric(lrcString)
      this.setData({songLyric})
      console.log("SongLyric", songLyric);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("options", options);
    // 1.获取歌曲id
    const id = options.id;
    this.setData({ id });
    this.fetchSongDetail(id);
    this.fetchSongLyric(id);
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    //audioContext.src = `(播放地址)`
    audioContext.autoplay = true
    // 设备信息
    this.setData({ 
      statusHeight: app.globalData.statusBarHeight,
      contentHeight: app.globalData.contentHeight
     });
     // 2.1根据id获取歌曲的详情和歌曲总时长
    getSongDetail(id).then(res =>{
      this.setData({
          currentSong :res.songs[0],
          durationTime:res.songs[0].dt
       })   
    })
    // 4.监听播放的进度 
    audioContext.onTimeUpdate(() => {
      if(!this.data.isSliderChanging){
        // 1.获取当前播放的时间
        this.setData({currentTime:audioContext.currentTime * 1000})
        //2修改滑块 sliderValue
        this.setData({sliderValue:this.data.currentTime / this.data.durationTime *100})
      }
      // 更新歌词的进度，匹配正确的歌词
      if(!this.data.songLyric.length) return;
      // 初始默认值是最后一句歌词
      let index = this.data.songLyric.length -1;
      for(let i =0; i<this.data.songLyric.length;i++){
        const info = this.data.songLyric[i];
        if(info.time > audioContext.currentTime * 1000){
          index = i-1;
          break;
        }
      }
      console.log(index,this.data.songLyric[index].text);
      if(index === this.data.currentLricIndex)  return;
      const currentLyricText = this.data.songLyric[index].text;
      this.setData({currentLyricText,currentLyricIndex:index});
     }) 

    audioContext.onWaiting(() => {
      audioContext.pause()
     })
    audioContext.onCanplay(() => {
      audioContext.play()
     })
  },
 // ==================== 事件监听 ==================== 
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },

  onPlayOrPauseTap(){
    console.log("on&off");
    if(!audioContext.paused){
      audioContext.pause()
      this.setData({isPlaying:false})
    }else{
      audioContext.play()
      this.setData({isPlaying:true})
    }
  },

  // onSliderChanging事件，滑动滑块松下的时候调用
  onSliderChanging(event){
    //1.获取滑块到的位置的valuer
    const value = event.detail.value
    //2.根据当前的值,计算出对应的事件
    const currentTime = value / 100 * this.data.durationTime
    this.setData({currentTime}) 
    //3.变量记录滑块当前正在滑动
    this.data.isSliderChanging = true
  },
  // onSliderChange事件
  onSliderChange(event) {
    // 1.获取点击滑块位置对应的值
    const value = event.detail.value;
    // 2.计算出要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime;
    // 3.设置播放器，播放计算的时间
    audioContext.seek(currentTime / 1000);
    this.setData({
      currentTime,isSliderChanging:false,sliderValue:value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
