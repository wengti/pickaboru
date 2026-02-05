import "./css/loading.css"

export default function Loading({isUserChild = false, isAuthLevel=false}){
    return(
        <div className={'loading-div ' + (isUserChild ? "isUserChild" : " ") + (isAuthLevel ? "isAuthLevel" : " ")}>
            <img src='/images/loading.gif'/>
        </div>
    )
}