import {ArrowLeftCircleIcon} from "@heroicons/react/24/outline";
import {useNavigate} from "react-router-dom";

const BackArrow = () => {
    const navigate = useNavigate();

    const handleNavigateBack = () => {
        navigate(-1);
    }


    return (
        <>
            <ArrowLeftCircleIcon className="h-16" onClick={handleNavigateBack}/>
        </>
    )
}
export default BackArrow
