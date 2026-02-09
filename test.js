const today = new Date()
const curMonth = today.getMonth()
console.log(curMonth)

const pastDay = new Date("2025-12-24")
const pastMonth = pastDay.getMonth()
console.log(pastMonth)

console.log(curMonth - pastMonth)