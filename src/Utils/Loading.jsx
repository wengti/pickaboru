import "./css/loading.css"

export default function Loading({isUserChild = false}){
    return(
        <div className={'loading-div ' + (isUserChild ? "isUserChild" : "")}>
            <img src='/images/loading.gif'/>
        </div>
    )
}