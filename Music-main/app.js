// app.js
App({
  /**
   * 全局设备信息(设备宽度、高度等)
   */
  globalData: {
    screenWidth: 375, // 屏幕宽度
    screenHeight: 667, // 屏幕高度
    statusHeight: 20, // 状态栏高度
    contentHeight: 500 //内容高度
  },

  onLaunch() {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res)
        this.globalData.statusHeight = res.statusBarHeight;
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.screenHeight = res.screenHeight;
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44;
      },
    });
  },
});
