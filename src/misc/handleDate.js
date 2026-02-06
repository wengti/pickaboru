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

export default function noop(){

}