export function getDateAtMidnight(date) {
    let dateAtMidnight = new Date()
    if (date) {
        dateAtMidnight = new Date(date)
    }

    dateAtMidnight.setHours(0, 0, 0, 0)
    return dateAtMidnight
}


export function parseDateRangeAtMidnight(dateRangeStr) {
    let [start, end] = dateRangeStr
        .replace(/[\[\]\(\)]/g, '')
        .split(',')
        .map(date => date.trim());

    let exclusiveEndDate = new Date(end)
    exclusiveEndDate.setDate(exclusiveEndDate.getDate() - 1)

    return [getDateAtMidnight(start), getDateAtMidnight(exclusiveEndDate)]
}

export function getDateRangeForSupabase([startDate, endDate]) {

    // start date needs to +8hrs because because difference between malaysia time and iso is 8hrs
    // without this, start date will be converted as ytd
    const startDateStr = new Date(new Date(startDate).setHours(8)).toISOString().split('T')[0]
    const endDateStr = new Date(endDate).toISOString().split('T')[0]

    return `[${startDateStr}, ${endDateStr}]`

}

export function getDuration([startDate, endDate]) {
    return ((getDateAtMidnight(endDate) - getDateAtMidnight(startDate)) / (1000 * 60 * 60 * 24) + 1)
}

export function getMonthFromNumber(number) {
    let correctedNumber = number
    if (number < 0){
        correctedNumber = 12 + number
    }

    const months = {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'Jul',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec'
    }
    return (months[correctedNumber])
}

export default function noop() {

}