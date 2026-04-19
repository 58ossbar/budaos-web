export function getDateInfo (y,m){
    let info = []
    // let   fdWeek = new Date(y,m-1,1).getDay() 以周日开头的代码
    let   fdWeek = new Date(y,m-1,0).getDay()/* 得到的日期是"m"月的前一个 月的最后一天 */
    let   ldWeek = new Date(y,m,0).getDay() /* 得到的日期是"m"月的后一个 月的第一天 */
    let   lastDay = new Date(y,m,0).getDate()
    let  lmDays =  new Date(y,m-1,0).getDate()
    let  lmYear = new Date(y,m-1,0).getFullYear()
    let   lmMonth = new Date(y,m-1,0).getMonth()+1
    let   nmYear = new Date(y,m+1,0).getFullYear()
    let  nmMonth = new Date(y,m+1,0).getMonth()+1
    // console.log(lmDays,lmDays + (0-fdWeek))
    for(var i = lmDays, len = lmDays + (0-fdWeek); i>len; i--){
        info.unshift({
            year: lmYear,
            month: lmMonth, /* 上个月 */
            day: i,
            ishowBag:false,
            week: new Date(y,m-2,i).getDay(),
            todayData:{},
            timeFile:(new Date(`${lmYear}-${lmMonth<10?'0'+lmMonth:lmMonth}-${i<10?'0'+i:i}`)).getTime()
        });
    }
    // console.log(lastDay)
    for(var i = 1; i<=lastDay; i++){
        info.push({
            year: y,
            month: m, /* 本月 */
            day: i,
            ishowBag:false,
            week: new Date(y,m-1,i).getDay(),
            todayData:{},
            timeFile:(new Date(`${y}-${m<10?'0'+m:m}-${i<10?'0'+i:i}`)).getTime()
        });
    }
    for(var i = 1,len = 42-info.length; i<=len; i++){
        info.push({
            year: nmYear,
            month: nmMonth, /* 下个月 */
            day: i,
            ishowBag:false,
            todayData:{},
            week: new Date(y,m,i).getDay(),
            timeFile:(new Date(`${nmYear}-${nmMonth<10?'0'+nmMonth:nmMonth}-${i<10?'0'+i:i}`)).getTime()
        });
    }
    return info;
  };
