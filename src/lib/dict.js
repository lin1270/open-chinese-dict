
import dicCommon from './dic-common'

class Dict {
    constructor(cfg) {
        this.cfg_ = cfg
        this.isLoaded_ = false
        this.isLoading_ = false
        this.lines_ = {}
    }

    load(cb) {
        if (this.isLoaded_ || this.isLoading_) {
            if (cb) cb(false)
            return
        }

        $.ajax(
            {
                url: this.cfg_.dict,
                type: 'GET',
                dataType: 'text',
                success: (data)=>{
                    this.isLoading_ = false
                    if (data) {
                        const lines = data.split('\n')
                        for(let i = 0; i < lines.length; ++i) {
                            this.lines_[`${i+1}`] = lines[i].split(' ')
                        }

                        this.isLoaded_ = true
                        if (cb) cb(true)
                    }
                },
                error: ()=>{
                    this.isLoading_ = false
                    if (cb) cb(false)
                }
            }
        )
    }

    find(word, cb) {
        if (!this.isLoaded_) {
            this.load((ok)=>{
                if (!ok) {
                    cb ({
                        error: dicCommon.LOADING,
                        result: null,
                    })
                    return
                }

                this.findCore(word, cb)
            })
        } else {
            this.findCore(word, cb)
        }
    }

    findCore(word, cb) {
        const numWord = Number(word)
        const isNum = !!numWord || numWord === 0

        if (isNum) {
            if (numWord > this.cfg_.totalPage) {
                cb({
                    error: dicCommon.END,
                    result: null,
                })
                return
            }
            if (numWord <= 0) {
                cb({
                    error: dicCommon.BEGIN,
                    result: null,
                })
                return
            }

            let url = this.getUrlByLineNum(numWord)
            cb({
                error: dicCommon.SUCCESS,
                page: numWord,
                result: url
            })
            return
        }

        let hasFound = false
        for (let lineNum in this.lines_) {
            const line = this.lines_[lineNum]
            const foundLine = line.find((item)=>{
                return word.startsWith(item)
            })
            if (foundLine) {
                let url = this.getUrlByLineNum(lineNum)
                cb({
                    error: dicCommon.SUCCESS,
                    page: lineNum,
                    result: url,
                })
                hasFound = true
                break
            }
        }

        if (!hasFound) {
            cb({
                error: dicCommon.NOT_FOUND,
                result: null,
            })
        }
    }

    getUrlByLineNum(num) {
        let url = this.cfg_.img
        if (!url.endsWith('/')) url += '/'
        url += String(num) + '.' + this.cfg_.imgType
        return url
    }
}

export default Dict