export const checkRedirect = async (url) => {
    let f = await fetch(url)

    return f.status;
}

export const redirect = (subpath) => {
    window.location.assign(window.location.origin + subpath)
}

export const redirectIf = (subpath, urlToCheck) => {
    if (checkRedirect(urlToCheck)) {
        redirect(subpath);
        return true;
    }

    return false;
}