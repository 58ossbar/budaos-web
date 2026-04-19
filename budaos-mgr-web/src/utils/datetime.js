/**
 * 时间日期相关操作
 */


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format (datetime) {
  return formatWithSeperator(datetime, "/", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator (datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    const timeFormat = year + dateSeprator + month + dateSeprator + day + " " + hh + timeSeprator + mm + timeSeprator + ss;
    return timeFormat;
  }
}

/**
 * 获取指定日期，且返回格式为 yyyy-MM-dd
 * @param dateTime
 */
export function getYearMonthDay(dateTime) {
  if (!dateTime) {
    dateTime = new Date()
  }
  const dateMat = new Date(dateTime)
  const year = dateMat.getFullYear();
  let month = dateMat.getMonth() + 1;
  let day = dateMat.getDate();
  month = Number(month) < 10 ? '0' + month : month
  day = Number(day) < 10 ? '0' + day : day
  return year + '-' + month + '-' + day
}
