function post(url, param, callback=()=>{}){
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json;charset=ISO-8859-2');
    http.onreadystatechange = function(){callback(http)};
    http.send(param);
}

var searchEna = true;

function clr(suc){
    document.getElementById("videos").innerHTML = "";
    document.getElementById("search").value = "";
    document.getElementById("cancel").setAttribute("hidden", true);

    if(suc){
        document.getElementById("success").removeAttribute("hidden");
        searchEna = false;
        setTimeout(()=>{
            searchEna = true;
            document.getElementById("success").setAttribute("hidden", true);
            document.getElementById("promo").removeAttribute("hidden");
            document.getElementById("apilogo").style.animationName = "logo_from";
            document.getElementById("promo").style.animationName = "promo_from";
        }, 2500);
    }
    else{
        document.getElementById("promo").removeAttribute("hidden");
        document.getElementById("apilogo").style.animationName = "logo_from";
        document.getElementById("promo").style.animationName = "promo_from";
    }
}

function search(){
    if(searchEna && document.getElementById("search").value != ''){
        document.getElementById("loading").removeAttribute("hidden");
        document.getElementById("cancel").setAttribute("hidden", true);
        
        document.getElementById("videos").innerHTML = "";
        document.getElementById("apilogo").style.animationName = "logo_to";
        document.getElementById("promo").style.animationName = "promo_to";

        post("/api/search", JSON.stringify({q:document.getElementById("search").value}), (http) => {
            if(http.readyState == 4 && http.status == 200) {
                document.getElementById("promo").setAttribute("hidden", true);
                var data = JSON.parse(http.response).data;
                for(var i = 0; i < data.length; i++){
                    var e = document.createElement("img");
                    var t = document.createElement("p");
                    var v = document.createElement("div");
                    var d = document.getElementById("videos");
                    e.src = "https://img.youtube.com/vi/" + data[i][0] + "/mqdefault.jpg";
                    e.className = "vidimg";
                    t.innerText = data[i][1];
                    v.className = "video";
                    v.setAttribute("onclick", "select('" + data[i][0] + "')");
                    v.appendChild(e);
                    v.appendChild(t);
                    d.appendChild(v);
                }
                document.getElementById("cancel").removeAttribute("hidden");
            }
            else{
                clr(false);
            }
            document.getElementById("loading").setAttribute("hidden", true);
        });
    }
}

function select(id){
    console.log("https://youtu.be/" + id);
    post("/api/download", JSON.stringify({url:"https://youtu.be/" + id}));
    
    clr(true);
}

addEventListener("keypress", (e) => {
    if(e.key == "Enter"){
        search();
    }
})