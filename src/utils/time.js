import moment from 'moment'

// convert utc time to localtime
function utcToLocal(utcDt, format = 'YYYY-MM-DD  HH:mm:ss') {
  return moment.utc(utcDt).local().format(format)
}

// get duration from startTime to endTime, return like 3 days, 2 hours, one year ..
function duration(startTime, endTime) {
  const start = moment(startTime)
  const end = moment(endTime)
  const duration = moment.duration(start.diff(end, 'seconds'), 'seconds')
  if (duration.days() !== 0) {
    return duration.humanize()
  }
  return Math.abs(duration.asHours().toFixed(1)) + ' hours'
}

function formatDuration(time) {
  const duration = moment.duration(time)
  if (duration.days() !== 0) {
    return duration.humanize()
  }
  return Math.abs(duration.asHours().toFixed(1)) + ' hours'
}

function secondFormat(time) {
  const m = moment.duration(time, 'seconds')
  const seconds = m.seconds() >= 10 ? m.seconds() : '0' + m.seconds()
  const hours = Math.floor(m.asHours()) >= 10 ? Math.floor(m.asHours()) : '0' + Math.floor(m.asHours())
  const minutes = m.minutes() >= 10 ? m.minutes() : '0' + m.minutes()
  return hours + ':' + minutes + ':' + seconds
}

function durationMs(startTime, endTime) { // 计算时间段的时间戳
  const start = moment(startTime)
  const end = moment(endTime)
  return end.diff(start, 'seconds')
}
export default {
  utcToLocal: utcToLocal,
  duration: duration,
  secondFormat: secondFormat,
  durationMs: durationMs,
  formatDuration: formatDuration
}
