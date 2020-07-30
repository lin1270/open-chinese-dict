<template>
  <div id="app">
    <div class="txt-result" v-html="result"></div>
  </div>
</template>

<script>

import dicMgr from '../../lib/dicMgr'

const preStrToRemove = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/：；~!@#$%^&*()+=|\\}]{[:.,（）-;<>?\"\'…。：“” ｜；《》、　";

export default {
  name: 'Index',
  data () {
    return {
      result: '',
      currDic: null,
      toSearchTxt: '',
      isInApp: false,
    }
  },

  methods: {
    getCurrDics() {
      return dicMgr.getDics(this.getCurrentDicType() || '0')
    },

    getCurrDic() {
      return dicMgr.getCurrDic(this.getCurrentDicType())
    },

    getCurrentDicType() {
      return dicMgr.getDicType()
    },

    setDicType(type) {
      dicMgr.setDicType(type)
      this.updateUI()
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

        this.currDic.find(wordToSearch, (result)=>{
          this.result = ''
          if (result.info)
            this.result = result.info.content

          if (this.currDic.isWeb_) return

          if (!this.result) this.result = '未搜尋到結果。'

          this.result = formator.formate(this.result, this.currDic.isHtml_)
          this.dealwithSearchUpdate()
        })
      }
    },

    dealwithSearchUpdate() {
      this.$nextTick(()=>{
        if (!this.isInApp) {
          if (!this.currDic.isWeb_) {
            $(".txt-result").find("a").click((event)=>{
              event.stopPropagation()
              event.preventDefault();

              let href = event.currentTarget.href;
              if (!href) return
              if (href.indexOf('http://www.sutoswbu') === 0 ||
                  href.indexOf('http://www.sutoswji') === 0 ||
                  href.indexOf('http://www.sutokxbu') === 0 ||
                  href.indexOf('http://www.sutokxji') === 0) {
                this.Toast('暫不支援該類型跳轉哦~')
                return
              }

              href = href.replace(/y/g, '%')
              href = decodeURIComponent(href)
              let word = this.getMidStr(href, 'http://www.suto', '.com')
              
              
              this.toSearchTxt = word
              this.onSearch()
            })
          }
        }
        

        if (this.currDic.id_ == dicCommon.ids.CHENGYU_ID) {
          const defaultOpen = document.getElementById("defaultOpen");
          if (defaultOpen) defaultOpen.click();
        }

        $('.txt-result').scrollTop(0)
      })
    },

    getMidStr(str, begin, end) {
      if (!str || !begin || !end) return ''
      const beginPos = str.indexOf(begin, 0)
      if (beginPos < 0) return ''
      const endPos = str.indexOf(end, beginPos + begin.length)
      if (endPos < 0) return ''
      return str.substring(beginPos + begin.length, endPos)
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

    getUrlParam(key) {
        return (
            decodeURIComponent(
                (new RegExp("[?|&]" + key + "=" + "([^&;]+?)(&|#|;|$)").exec(
                    window.location.href
                ) || [, ""])[1].replace(/\+/g, "%20")
            ) || null
        );
    },

    updateUI() {
      this.currDic = this.getCurrDic()
      this.onSearch()
    },
  },
  mounted() {
    return
    
    const paramDict = this.getUrlParam('dict')
    if (paramDict) {
      const intDict = Number(paramDict)
      if (intDict) {
        const dictInfo = dicMgr.getDicById(intDict)
        if (dictInfo && dictInfo.dic) {
          const dicType = dictInfo.type || 0
          this.setDicType(dicType)
          dicMgr.setCurrDic(dicType, dictInfo.dic)
        }
      }
    }

    const paramWord = this.getUrlParam('word')
    if (paramWord) {
      this.toSearchTxt = paramWord
    }

    let level = this.getUrlParam('scale')
    if (level) {
      document.body.style.zoom = "" + level + "%"
      document.body.style.msTransformOrigin = "center top"
    }

    this.isInApp = this.getUrlParam('inapp') === '1'

    this.updateUI()
  },
};
</script>

<style lang="less">
// @font-face{
//   font-family: 'KaiXinSong';
//   src : url('//www.maiyuren.com/static/lib/font/kaixinxong.ttf');
// }

html body {
  font-family: 'American Typewriter', 'snas', 'Microsoft YaHei', 'Simsun', 'NSimSun', 'PMingLiU', 'KaiXinSong';
}

#app {
  position: relative;

  .txt-result {
    padding: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    overflow: auto;
  }
}

</style>
