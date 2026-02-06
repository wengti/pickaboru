import "./css/datepicker.css"
import 'react-calendar/dist/Calendar.css'
import Calendar from 'react-calendar'
import { useState } from 'react'
import { getDateAtMidnight, parseDateRangeAtMidnight } from '../misc/handleDate'

export default function DatePicker({dateState, paddleItem}) {

    // Props
    const {dateValue, setDateValue} = dateState
    
    // Variables
    const formattedStartDate = dateValue[0].toLocaleString('en-GB', {dateStyle: 'medium'}) // 6 Feb 2026
    const formattedEndDate = dateValue[1].toLocaleString('en-GB', {dateStyle: 'medium'}) // 6 Feb 2026

    // Derived from props
    const bookedDateArr = paddleItem?.orders


    // Function to disable tiles

    function disableTiles(date){

        const tileDate = getDateAtMidnight(date)
        const todayDate = getDateAtMidnight()

        if(tileDate <= todayDate ) return true

        for(let {date_range} of bookedDateArr){
            const [startDate, endDate] = parseDateRangeAtMidnight(date_range)
            if (tileDate >= startDate && tileDate <= endDate) return true
        }
    }

    return (
        <div className='calendar-div'>
            Rent from: 
            <div className='start-date'>
                <span>
                    {formattedStartDate}  - {formattedEndDate}
                </span>
                <Calendar
                    value={dateValue}
                    onChange={setDateValue}
                    selectRange={true}
                    tileDisabled={ ({activeStartDate, date, view}) => disableTiles(date)}
                    className="calendar"
                />
            </div>
        </div>
    )
}