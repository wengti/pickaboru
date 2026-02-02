import "../index.css"
import "./css/layout.css"

export default function Footer(){

    const year = new Date().getFullYear()

    return (
        <footer>
            &copy; {year} PICKABORU
        </footer>
    )
}