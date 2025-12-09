const checkRedirect = async (url) => {
    let f = await fetch(url)

    return f.status;
}

const redirect = (subpath) => {
    window.location.assign(window.location.origin + subpath)
}

const redirectIf = (subpath, urlToCheck) => {
    if (checkRedirect(urlToCheck) == 200) {
        redirect(subpath);
        return true;
    }

    return false;
}