

export function parseSearchUrl(url) {
    const { searchParams } = new URL(decodeURIComponent(url));
    if (!Object.fromEntries) Object.fromEntries = fromEntries;
    const parseSearchParam = Object.fromEntries(searchParams.entries());
    return parseSearchParam;
}

export function removeParamsByRegExp(regExp) {
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);

        Array.from(searchParams.keys()).forEach(key => {
            if (regExp.test(key)) {
                searchParams.delete(key);
            }
        });

        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.replaceState(null, '', newRelativePathQuery);
    } else {
        console.warn('URLSearchParams in window is not found');
    }
}

export function pushParams(params) {
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        for (let key in params) {
            searchParams.set(key, params[key]);
        }
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.replaceState(null, '', newRelativePathQuery);
    } else {
        console.warn('URLSearchParams in window is not found');
    }
}

export function pushSingleParam(key, value) {
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.replaceState(null, '', newRelativePathQuery);
    } else {
        console.warn('URLSearchParams in window is not found');
    }
}

export function getUrlParam(key) {
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(key);
    } else {
        console.warn('URLSearchParams in window is not found');
        return null;
    }
}

export function removeUrlParam(key) {
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.delete(key);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.replaceState(null, '', newRelativePathQuery);
    } else {
        console.warn('URLSearchParams in window is not found');
    }
}