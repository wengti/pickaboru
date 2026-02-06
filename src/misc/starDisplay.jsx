import { GoStar, GoStarFill } from "react-icons/go";

export default function starDisplay(condition){

    const starArr = []
    for(let i=0; i<5; i++){
        if(i<condition) starArr.push(<GoStarFill key={i}/>)
        else starArr.push(<GoStar key={i}/>)
    }

    return starArr
}