const checkRedirect = async (url) => {
    let f = await fetch(url)

    return f.status;
}

const redirect = (subpath) => {
    window.location.assign(window.location.origin + subpath)
}

const redirectIf = async (subpath, urlToCheck) => {
    let status = await checkRedirect(urlToCheck);
    
    if (status == 200) {
        redirect(subpath);
        return true;
    }

    return false;
}