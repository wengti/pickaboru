import { GoStar, GoStarFill } from "react-icons/go";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";

export default function starDisplay(condition){

    const starArr = []
    for(let i=0; i<5; i++){
        if(i<condition) starArr.push(<GoStarFill key={i}/>)
        else starArr.push(<GoStar key={i}/>)
    }

    return starArr
}

export function heartDisplay(rating){

    const starArr = []
    for(let i=0; i<5; i++){
        if(i<rating) starArr.push(<IoMdHeart key={i}/>)
        else starArr.push(<IoIosHeartEmpty key={i}/>)
    }

    return starArr
}