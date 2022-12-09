import {useOutletContext} from "react-router-dom";

export const OutletProvider = ({ children }) => {
    const contextProps = useOutletContext()

    return typeof children === 'function' ? children(contextProps) : children;
}

export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// https://www.geeksforgeeks.org/how-to-clear-all-cookies-using-javascript/
export function deleteCookies() {
    const allCookies = document.cookie.split(';');

    // The "expire" attribute of every cookie is
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (let i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires="
            + new Date(0).toUTCString();

}

// https://stackoverflow.com/a/25346429
export function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

export default {OutletProvider, delay};