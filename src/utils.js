import {useOutletContext} from "react-router-dom";

const OutletProvider = ({ children }) => {
    const contextProps = useOutletContext()

    return typeof children === 'function' ? children(contextProps) : children;
}

export default OutletProvider;