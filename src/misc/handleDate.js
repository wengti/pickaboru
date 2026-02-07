export function getDateAtMidnight(date) {
    let dateAtMidnight = new Date()
    if (date) {
        dateAtMidnight = new Date(date)
    }

    dateAtMidnight.setHours(0, 0, 0, 0)
    return dateAtMidnight
}


export function parseDateRangeAtMidnight(dateRangeStr){
    let [start, end] = dateRangeStr
        .replace(/[\[\]\(\)]/g, '')
        .split(',')
        .map(date => date.trim());

    let exclusiveEndDate = new Date(end)
    exclusiveEndDate.setDate(exclusiveEndDate.getDate() - 1)
    
    return [getDateAtMidnight(start), getDateAtMidnight(exclusiveEndDate)]
}

export function getDateRangeForSupabase([startDate, endDate]){

    // start date needs to +8hrs because because difference between malaysia time and iso is 8hrs
    // without this, start date will be converted as ytd
    const startDateStr = new Date(new Date(startDate).setHours(8)).toISOString().split('T')[0]  
    const endDateStr = new Date(endDate).toISOString().split('T')[0]

    console.log("endDate: ", startDate)
    console.log("ToISOString: ", new Date(endDate).toISOString())
    return `[${startDateStr}, ${endDateStr}]`

}

export function getDuration([startDate, endDate]){
    return ((getDateAtMidnight(endDate) - getDateAtMidnight(startDate)) / (1000 * 60 * 60 * 24) + 1)
}

export default function noop(){

}