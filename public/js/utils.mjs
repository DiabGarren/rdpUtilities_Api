export function getParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product = urlParams.get(param);
    return product;
}

export async function getUserData(userId) {
    const res = await fetch(`http://localhost:1830/users/${userId}`);
    const data = await res.json();
    return data;
}