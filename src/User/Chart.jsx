import "./css/chart.css"
import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { getMonthFromNumber, parseDateRangeAtMidnight } from '../misc/handleDate';
import { useCurrentUser } from '../Auth/CurrentUserProvider';
import { NavLink } from 'react-router';


export default function Chart({ ordersData, title }) {

    // useCurrentUser
    const { currentUser } = useCurrentUser()

    // data
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    let monthsData = []

    // last 5 months and current Months
    for (let i = 0; i < 6; i++) {
        const pastMonth = currentMonth - (5 - i)
        const pastYear = pastMonth >= 0 ? currentYear : (currentYear - 1)
        monthsData.push({ month: pastMonth, year: pastYear, salesValues: 0, ordersValues: 0 })
    }


    // Loop through the order data from database
    // 1. get their month and year data
    // 2. if their month and year mathces the monthsData, the values data is added
    ordersData.forEach((order) => {
        const [startDate, endDate] = parseDateRangeAtMidnight(order.date_range)
        const startDateYear = startDate.getFullYear()
        const startDateMonth = startDate.getMonth()

        // handle current year
        if (startDateYear === currentYear) {

            // iterate over row of months data that are in the current year
            for (let data of (monthsData.filter(({ year }) => year === currentYear))) {

                // If the months are matching (same year, same month)
                if (startDateMonth === data.month) {

                    // Add to the data (depending on whether sales or orders)
                    if (order.buyer_id === currentUser?.id) data.ordersValues += order.values
                    else if (order.seller_id === currentUser?.id) data.salesValues += order.values
                }
            }
        }

        // handle last year
        else if (startDateYear === currentYear - 1) {

            // iterate over row of months data that are in the last year
            for (let data of (monthsData.filter(({ year }) => year === currentYear - 1))) {

                // If the months are mathcing (same year, same month)
                if (startDateMonth === (12 + data.month)) {

                    // Add to the data (depending on whether sales or orders)
                    if (order.buyer_id === currentUser?.id) data.ordersValues += order.values
                    else if (order.seller_id === currentUser?.id) data.salesValues += order.values
                }
            }
        }
    })

    // Style
    const localeText = {
        loading: 'Data should be available soon',
        noData: 'No record is found'
    }

    const fontStyle = {
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'Inter'
    }

    const xAxis = [
        {
            data: monthsData.map((data) => { return getMonthFromNumber(data.month) }),
            barGapRatio: 0.05,
            categoryGapRatio: 0.15,
            disableTicks: true,
            tickLabelStyle: {
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'Inter'
            }
        }
    ]

    const yAxis = [
        {
            disableTicks: true,
            tickLabelStyle: fontStyle,
            labelStyle: fontStyle,
            label: 'MYR',
            valueFormatter: (value) => {
                if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;  // 1.5M
                }
                if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`;  // 1K, 2K, etc
                }
                return value.toString();  // Below 1000, show as is
            }
        }
    ]

    const currencyFormatter = new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
    }).format;

    const series = [
        {
            data: monthsData.map((data) => data.salesValues),
            color: '#399e5a',
            valueFormatter: currencyFormatter,
            label: 'Sales Made',
            labelStyle: fontStyle,
            barLabel: (v) => { if (v.value > 0) return `${v.value.toFixed(2)}` },
            barLabelPlacement: 'inside'
        },
        {
            data: monthsData.map((data) => data.ordersValues),
            color: '#7e3f8f',
            valueFormatter: currencyFormatter,
            label: 'Orders Made',
            labelStyle: fontStyle,
            barLabel: (v) => { if (v.value > 0) return `${v.value.toFixed(2)}` },
            barLabelPlacement: 'inside'
        }
    ]

    const sx = {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(px, 0px)',
        },
        [`.${legendClasses.mark}`]: {
            height: 30,
            width: 20,
        },
        // CSS class
        ['.MuiChartsLegend-series']: {
            gap: '5px',
            fontSize: '12px',
            fontWeight: '600'
        },
    }

    // formatting bar labels
    const slotProps = {
        barLabel: {
            style: {
                fill: 'black',
                fontSize: 12,
                fontWeight: 600
            },
        }
    }


    // returned elements
    return (
        <div className='chart-area'>
            <span className='chart-title'>{title}</span>
            <BarChart
                loading={ordersData === undefined}
                localeText={localeText}
                xAxis={xAxis}
                yAxis={yAxis}
                series={series}
                height={260}
                margin={{ bottom: 10, left: 10}}
                borderRadius={5}
                sx={sx}
                slotProps={slotProps}
            />
            <div className='chart-summary'>
                <NavLink to="./sales" className='chart-box'>
                    <span className='chart-summary-title'>SALES in last 6 months</span>
                    <span className='chart-summary-text sales'>MYR {monthsData.reduce((accumulator, data) => { return accumulator + data.salesValues }, 0).toFixed(2)}</span>
                </NavLink>
                <NavLink to="./orders" className='chart-box'>
                    <span className='chart-summary-title'>ORDERS in last 6 months</span>
                    <span className='chart-summary-text orders'>MYR {monthsData.reduce((accumulator, data) => { return accumulator + data.ordersValues }, 0).toFixed(2)}</span>
                </NavLink>
            </div>
        </div>
    )
}