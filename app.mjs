import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import child_process from 'child_process';

function shell(cmd){
    return child_process.execSync(cmd).toString('utf-8');
}

var port = 80;
var app = express();

app.use(
    bodyParser.json(),
    cors({
        origin: '*'
    }),
    express.static('www')
);

console.log("yt-dlp\\yt-dlp update...");
shell("yt-dlp\\yt-dlp.exe -U");

app.post('/api/search', (req, res) => {
    var search = req.body.q?.replace(/[^A-Za-z0-9 ]/g, '');
    if(search){
        var videos = shell(`yt-dlp\\yt-dlp.exe --encoding utf-8 ytsearch12:"${search}" --skip-download --print "%(id)s%(title)s" --flat-playlist`).split("\n").slice(0, -1);
        var result = [];
        for(var i = 0; i < videos.length; i++){
            result.push([videos[i].slice(0, 11), videos[i].slice(11)]);
        }

        console.log(`Kereses: ${search}`);

        res.status(200);
        res.send(JSON.stringify({
            "status":"ok",
            "data":result
        }));
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "status":"Invalid request string.",
            "data":null
        }));
    }
});

app.post('/api/download', (req, res) => {
    var url = req.body.url;
    if(url){
        child_process.exec(`yt-dlp\\yt-dlp.exe -x --audio-format wav --output zene/%(title)s.%(ext)s ${url}`, (e)=>{
            console.log(`Letoltes kesz: ${url}`);
        });

        console.log(`Letoltes: ${url}`);

        res.status(200);
        res.send(JSON.stringify({
            "status":"ok"
        }));
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "status":"Invalid url."
        }));
    }
});

app.listen(port, () => {
    console.log(`Webserver running on port ${port}`);
});