
import { Star, StarFill } from 'react-bootstrap-icons';

const StarRating = ({size, numStars, isClickable, cb}: {size: number, numStars: number, isClickable: Boolean, cb: Function}) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        stars.push(
            i <= numStars ?
                <StarFill key={`${i}-key`} onClick={isClickable ? () => cb(i) : null} className={`text-yellow-300 ${isClickable ? "hover:bg-gray-200" : ""} mt-0.5`} size={size} />
                :
                <Star key={`${i}-key`} onClick={isClickable ? () => cb(i) : null} className={`text-yellow-300 ${isClickable ? "hover:bg-gray-200" : ""} mt-0.5`} size={size} />
        )
    }

    return (
        <div className={`flex ${isClickable ? "cursor-pointer" : ""}`}>
            {stars}
        </div>
    )

}

export default StarRating
