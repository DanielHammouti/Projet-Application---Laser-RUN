let verifauthuser = localStorage.getItem("userId");

if (verifauthuser !== "L4iXbUG6eKPdn14mO8ObMqKM8jp1") {
    console.log("Vous n'avez pas les droits d'accès à cette page");
    window.location.href = "https://172.16.100.3/src/html/index.html";
}