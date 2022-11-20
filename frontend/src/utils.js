import {useOutletContext} from "react-router-dom";

export const OutletProvider = ({ children }) => {
    const contextProps = useOutletContext()

    return typeof children === 'function' ? children(contextProps) : children;
}

export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export default {OutletProvider, delay};