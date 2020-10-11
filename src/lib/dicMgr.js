import Dict from './dict'

var g_dics = []
var g_isLoaded = false
var g_currItem = null


const CURR_CFG_KEY = "currDictCfgKey_"

var dicMgr = {
    init(cb) {
        $.ajax({
            url: 'http://www.maiyuren.com/static/open-chinese-dict-static/menu.json?time=' + new Date().getTime(), 
            type: 'GET',
            dataType: 'json',
            success: (result)=>{
                g_dics = []
                result.forEach((item)=>{
                    const group = []
                    item.forEach((dicItem)=>{
                        const dict = new Dict(dicItem)
                        group.push(dict)
                    })
                    
                    g_dics.push(group)
                })
                g_isLoaded = true
                if (cb) cb(true)
            },
            error: (e) => {
                if (cb) cb(false)
            }
        })
    },

    getDics() { return g_dics },

    getCurrDic() {
        if (g_currItem) return g_currItem
        if (!g_isLoaded) return null
        const lastId = window.localStorage.getItem(CURR_CFG_KEY)
        if (!lastId) {
            g_currItem = g_dics[0][0]
        } else {
            g_currItem = this.getDicById(lastId)
        }
        
        return g_currItem;
    },
    getDicById(id) {
        for(let i = 0; i < g_dics.length; ++i) {
            let dicGroup = g_dics[i]
            for(let j = 0; j < dicGroup.length; ++j) {
                let dic = dicGroup[j]
                if (dic.cfg_.id === id) {
                    return dic
                }
            }
        }

        return null
    },
    setCurrDic(dic) {
        if (!dic) return
        g_currItem = dic
        window.localStorage.setItem(CURR_CFG_KEY, dic.cfg_.id)
    },
    setCurrDicById(id) {
        this.setCurrDic(
            this.getDicById(id)
        )
    },
    getNextDic(step) {
        if (!g_isLoaded) return null
        const currItem = this.getCurrDic()
        let i = 0

        let tempDics = []
        g_dics.forEach((item)=>{
            item.forEach((dict)=>{
                tempDics.push(dict)
            })
        })
        for(; i < tempDics.length; ++i) {
            if (tempDics[i] == currItem) {
                break;
            }
        }

        i += step
        i %= tempDics.length;
        if (i < 0) i = tempDics.length - 1

        g_currItem = tempDics[i]
        return g_currItem
    },
}

export default dicMgr;