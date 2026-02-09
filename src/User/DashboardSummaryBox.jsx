import { NavLink } from 'react-router'
import "./css/dashboardsummarybox.css"

export default function DashboardSummaryBox({children, title}) {
    return (
        <div className='summary-box'>
            <span className="summary-box-title">{title}</span>
            <span className="summary-box-text">{children}</span>
        </div>
    )
}