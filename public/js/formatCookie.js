export const setCookie=(name, value, minutes)=> {
    var now = new Date();
    var expirationTime = new Date(now.getTime() + minutes * 60000); // 1 minute = 60000 milliseconds
    var expires = "expires=" + expirationTime.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


export const deleteCookie=(cookieName) =>{
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
