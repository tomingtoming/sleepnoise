import express from 'express'
import logger from "morgan";
import fs from 'fs';
import child_process from 'child_process'

const PIDFILE = '/var/run/sleepnoise.pid'
// const WAVFILE = '/home/pi/muon_10sec.wav'
const WAVFILE = '/home/pi/audiocheck.net_pink_192k_-3dBFS.wav'

const app = express()
app.use(logger("combined"));

// 静的ファイル
app.use(express.static('static'))

// ルーティング
const router = express.Router()
router.get('/play', (req: express.Request, res: express.Response) => {
    console.log('START', req.method, req.url)
    if (fs.existsSync(PIDFILE)) {
        console.log(PIDFILE, 'exists => Ok')
        res.status(200) // Ok
    } else {
        console.log(PIDFILE, 'exists => Not found')
        res.status(404) // Not found
    }
    res.end()
    console.log('END  ', req.method, req.url)
})
router.post('/play', (req: express.Request, res: express.Response) => {
    console.log('START', req.method, req.url)
    if (fs.existsSync(PIDFILE)) {
        console.log(PIDFILE, 'exists => Conflict')
        res.status(409) // Conflict
    } else {
        console.log(PIDFILE, 'not exists')
        const process = child_process.spawn('play', [WAVFILE, 'repeat', '999999999'])
        console.log('spawn process:', process.pid)
        fs.writeFileSync(PIDFILE, process.pid.toString())
        console.log('write pid to', PIDFILE)
        res.status(201) // Created
    }
    res.end()
    console.log('END  ', req.method, req.url)
})
router.delete('/play', (req: express.Request, res: express.Response) => {
    console.log('START', req.method, req.url)
    if (fs.existsSync(PIDFILE)) {
        console.log('read pid from', PIDFILE)
        const pid = parseInt(fs.readFileSync(PIDFILE).toString())
        console.log('delete file:', PIDFILE)
        fs.unlinkSync(PIDFILE)
        console.log('kill process:', pid)
        process.kill(pid, 'SIGKILL')
        res.status(204) // No content
    } else {
        console.log(PIDFILE, 'exists => Not found')
        res.status(404) // Not found
    }
    res.end()
    console.log('END  ', req.method, req.url)
})
app.use(router)

// 3000番ポートでAPIサーバ起動
app.listen(3000, () => { console.log('app listening on port 3000!') })
