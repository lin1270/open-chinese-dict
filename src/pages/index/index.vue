<template>
  <div id="app" @click="showDictMenu = false;showMainMenu=false">
      <div class="top" v-if="canShowTitle">
        <div class="commonBtn pre-dict" @click="onNextDic(-1)"></div>
        <div class="commonBtn next-dict" @click="onNextDic(1)"></div>
        <div class="menu-dict">
          <div class="title" @click.stop="onShowDictMenuBtnClicked">{{currDic ? currDic.cfg_.name : ''}}</div>
          <div class="commonBtn menu-down" @click.stop="onShowDictMenuBtnClicked"></div>
        </div>
        <div class="input-wrapper">
          <form style="flex: 1;" action="javascript:return true;">
            <input ref="searchRef" type="search" placeholder="請輸入漢字/數字搜尋" v-model="toSearchTxt" @keyup.enter="onSearch">
          </form>
          <div class="commonBtn searchBtn" @click="onSearch"></div>
        </div>
      </div>
      <div class="mid" ref="midRef" :style="canShowTitle ? '' : 'margin-top:0'">
        <div class="root">
          <div v-if="items.length" class="next" @click="onNext(-1)">上一頁</div>
          <div v-for="(item,index) in items" :key="index">
            <center>
              <img class="img" :width="width * zoomValue" :src="item.result">
            </center>
          </div>
          <div v-if="items.length" class="next" @click="onNext(1)">下一頁</div>
        </div>
      </div>

      <div class="dict-list" v-if="showDictMenu">
        <div class="item" v-for="(item,index) in dics" :key="index" @click="onDictMenuItemClicked(item)">{{item.cfg_.name}}</div>
      </div>

      <div v-if="canShowZoom" class="zoom-wrapper" :style="canShowTitle ? '' : 'top:10px'">
        <div class="commonBtn zoomOut" @click="onZoom(-0.2)"></div>
        <div class="commonBtn zoomIn" @click="onZoom(+0.2)"></div>
      </div>
  </div>
</template>

<script>

import dicMgr from '../../lib/dicMgr'
import dicCommon from '../../lib/dic-common'

const preStrToRemove = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/：；~!@#$%^&*()+=|\\}]{[:.,（）-;<>?\"\'…。：“” ｜；《》、　";


export default {
  name: 'Index',
  data () {
    return {
      result: '',
      currDic: null,
      dics: [],
      toSearchTxt: '',
      showDictMenu: false,
      width: 600,
      items: [],
      zoomValue: 1,
      canShowTitle: true,
      canShowZoom: true,
    }
  },

  methods: {
    getCurrDics() {
      return dicMgr.getDics()
    },

    getCurrDic() {
      return dicMgr.getCurrDic()
    },

    onNextDic(step) {
      dicMgr.getNextDic(step)
      this.updateUI()
    },

    updateUI() {
      const tempDics = this.getCurrDics()
      this.dics = []
      tempDics.forEach((item)=>{
        this.dics.push(...item)
      })
      this.currDic = this.getCurrDic()
      this.updateZoom()
      this.onSearch()
    },

    isPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },

    onSearch(userInput = true) {
      if (!this.toSearchTxt) return

      if (this.currDic) {
        let wordToSearch = String(this.toSearchTxt)
        if (!this.currDic.isWeb_) {
          let temp2 = wordToSearch;
          if (!Number(temp2)) {
            while (temp2.length > 0) {
              let ch = temp2.substring(0, 1)
              if (preStrToRemove.indexOf(ch) === -1)
                break;
              
              temp2 = temp2.substring(1)
            }
          }
          
          wordToSearch = temp2.trim();

          if (wordToSearch.length > 20) {
            wordToSearch = wordToSearch.substring(0, 20)
          }
        }

        if (!wordToSearch) return

        if (!this.isPC() && this.$refs.searchRef) this.$refs.searchRef.blur()

        this.currDic.find(wordToSearch, (result)=>{
          if (result.error !== dicCommon.SUCCESS) {
            this.showFindError(result.error)
            return
          }

          this.items = [result]
          this.$refs.midRef.scrollTop = 0
          this.$forceUpdate()
        })
      }
    },

    showFindError(e) {
      let txt = ''
      switch(e) {
        case dicCommon.ERROR: txt= '異常！'; break;
        case dicCommon.NOT_FOUND: txt = '未搜尋到結果'; break;
        case dicCommon.LOADING: txt = '正在加載...'; break;
        case dicCommon.BEGIN: txt = '已到達第1頁'; break;
        case dicCommon.END: txt = '已越過最後一頁'; break;
      }
      this.Toast(txt)
    },

    Toast(msg,duration){
      duration=isNaN(duration)?2000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="width:300px; background:rgba(0,0,0,0.8); opacity:1; height:60px; color:#fff; line-height:60px; text-align:center; border-radius:5px; position:fixed; top:40%; left:calc(50% - 150px); z-index:999999; font-weight:bold;";
        document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    },

    onDictMenuItemClicked(item) {
      dicMgr.setCurrDic(item)
      this.updateUI()
    },

    onMainMenuItemClicked(item) {
      item.fun()
    },

    onShowDictMenuBtnClicked() {
      this.showDictMenu = !this.showDictMenu
      this.showMainMenu = false
    },

    getUrlParam(key) {
        return (
            decodeURIComponent(
                (new RegExp("[?|&]" + key + "=" + "([^&;]+?)(&|#|;|$)").exec(
                    window.location.href
                ) || [, ""])[1].replace(/\+/g, "%20")
            ) || null
        );
    },
    onNext(step) {
      if (!this.items.length) return
      let index = -1
      if (step > 0) {
          index = Number(this.items[this.items.length - 1].page) + 1
      } else {
          index = Number(this.items[0].page) - 1
      }

      this.currDic.find(index, (result)=>{
          if (result.error !== dicCommon.SUCCESS) {
              this.showFindError(result.error)
              return
          }

          if (step > 0) {
              this.items.push(result)
          }
          else {
              this.items.unshift(result)
          }
      })
    },

    onZoom(step) {
      this.zoomValue += step
      if (this.zoomValue < 0.5) this.zoomValue = 0.5
      if (this.zoomValue > 3) this.zoomValue = 3
      window.localStorage.setItem(this.getZoomKey(), String(this.zoomValue))
    },

    getZoomKey() {
      if (!this.currDic) return ''
      return `dictZoomCfg_${this.currDic.cfg_.id}`
    },

    updateZoom() {
      const zoomCfg = window.localStorage.getItem(this.getZoomKey())
      if (zoomCfg) {
        let intZoom = Number(zoomCfg)
        if (intZoom < 0.5) intZoom = 0.5
        if (intZoom > 3) intZoom = 3
        this.zoomValue = intZoom
      } else {
        this.zoomValue = 1
      }
    }
  },
  mounted() {
    if (this.getUrlParam('notitle') === '1') {
      this.canShowTitle = false
    }

    if (this.getUrlParam('nozoom') === '1') {
      this.canShowZoom = false
    }

    dicMgr.init((ok)=>{
      if (ok) {
        const paramDict = this.getUrlParam('dict')
        if (paramDict) {
          const dictInfo = dicMgr.getDicById(paramDict)
          if (dictInfo) {
            dicMgr.setCurrDic(dictInfo)
          }
        }

        const paramWord = this.getUrlParam('word')
        if (paramWord) {
          this.toSearchTxt = paramWord
        }

        this.updateUI()
      }
    })
  },
};
</script>

<style lang="less">

// @font-face{
//   font-family: 'KaiXinSong';
//   src : url('//www.maiyuren.com/static/lib/font/kaixinxong.ttf');
// }

@font-face {
  font-family: 'sudicIconfont';  /* project id 1564732 */
  src: url('//at.alicdn.com/t/font_1564732_blexi9vcgdg.eot');
  src: url('//at.alicdn.com/t/font_1564732_blexi9vcgdg.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1564732_blexi9vcgdg.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1564732_blexi9vcgdg.woff') format('woff'),
  url('//at.alicdn.com/t/font_1564732_blexi9vcgdg.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1564732_blexi9vcgdg.svg#sudicIconfont') format('svg');
}


html body {
  padding: 0;
  margin: 0;
  font-family: 'American Typewriter', 'snas', 'Microsoft YaHei', 'Simsun', 'NSimSun', 'PMingLiU', 'KaiXinSong';
}

@btnWidth: 32px;
@btnHeight: 32px;

.commonBtn {
  width: @btnWidth;
  height: @btnHeight;
  font-family: 'sudicIconfont';
  text-align: center;
  line-height: @btnHeight;
  font-size: 24px;
  cursor: pointer;
}

#app {
  position: relative;
    
    
    .top {
      position: fixed;
      top:0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      min-height: 48px;
      max-height: 48px;
      z-index: 1000;
      background-color: burlywood;
      padding: 0 8px;
      .menu-dict {
        padding-left: 20px;
        flex: 1;
        text-align: center;
        position: relative;
        height: 48px;
        
        display: flex;
        align-items: center;

        .title {
          line-height: 48px;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        
        .menu-down {
          font-size: 16px;
          height: 48px;
          width: 48px;
          line-height: 48px;
          cursor: pointer;
        }
      }

      .pre-dict {
        &::after {
          content: '\e675';
        }
      }

      .next-dict {
        &::after {
          content: '\e677';
        }
      }
    }

    .zoom-wrapper {
      position: fixed;
      right: 24px;
      top: 54px;
      display: flex;

      .zoomOut {
        margin-right: 20px;
        &::after {
          content: '\e63e';
        }
      }

      .zoomIn {
        &::after {
          content: '\e639';
        }
      }      
    }

    .mid {
      flex: 1;
      margin-top: 48px;

      .root {
        position: relative;
        padding: 0 10px;

        .img {
            margin: 10px 0;
            box-shadow: 0 0 10px #888888;
        }

        .next {
            cursor: pointer;
            text-align: center;
            font-size: 18px;
            padding: 10px;
            &:hover {
                color: red;
            }
        }
      }
    }

    .input-wrapper {
      width: 198px;
      border: 1px solid #ccc; 
      background: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      transition: all 1s;

      &:hover {
        border-color: orange;
      }

      &:focus {
        border-color: orange;
      }

      input::-webkit-calendar-picker-indicator{ display: none; -webkit-appearance: none; }
      input {
        border-radius: 6px;
        height: 29px;
        font-size: 14px;
        padding-left: 8px;
        outline-style: none ;
        border: none;
        margin-top: 1px;
        width: 100%;
        
        line-height: 29px;
        -webkit-appearance: none;
      }

      .searchBtn {
        width: 28px;
        height: 24px;
        font-size: 18px;
        line-height: 24px;
        &::after {
          content: '\e616'
        }
      }
    }

    .dict-list {
      position: fixed;
      top:52px;
      background: #ccc;
      width: 160px;
      text-align: center;
      box-shadow: 2px 2px 4px gray;
      left: 80px;
      border-radius: 8px;

      .item {
        line-height: 32px;
        &:hover {
          color: #2d8cf0;
          cursor: pointer;
        }
      }
  }
}

</style>
