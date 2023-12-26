import { useEffect, useState } from 'react'
import './index.scss'


const drawNames = (names: string[], bingos: string[], canvas: HTMLCanvasElement, options: {
    textOffset?: number;
} = {}) => {

    const {
        textOffset = 0.95,
    } = options

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const radius = ctx.canvas.width / 2
    const ns = [...names]
    const angle = Math.PI * 2 / ns.length
    ctx.save()
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.font = '14px Arial'
    ctx.translate(radius, radius)
    ns.forEach((name, idx) => {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius * 2, -0.5 * angle, 0.5 * angle, false)
        ctx.closePath()
        if (bingos.includes(name)) {
            ctx.fillStyle = '#ff0'
            ctx.fill()

            ctx.fillStyle = '#000'
            ctx.fillText(name, radius * textOffset, 0)
        } else {
            if (idx % 2 < 1) {
                ctx.fillStyle = '#fff'
            } else {
                ctx.fillStyle = '#eee'
            }
            ctx.fill()

            ctx.fillStyle = '#000'
            ctx.fillText(name, radius * textOffset, 0)
        }

        ctx.rotate(angle)
    })
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.restore()
}

const RADIUS = 720


export default (props: {
    names: string[]
}) => {
    const { names } = props
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [ns, setNs] = useState<string[]>([])
    const [bingos, setBingos] = useState<string[]>([])
    const [bingoShow, setBingoShow] = useState<string[]>([])
    const [deg, setDeg] = useState(0)
    const [increase, setIncrease] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [canRoll, setCanRoll] = useState(true)
    const [rolling, setRolling] = useState(false)

    useEffect(() => {
        const ns = [...names]
        if (names.length % 2 === 1) {
            ns.push('-')
        }
        setNs(ns)
    }, [names])

    useEffect(() => {
        if (!canvas) {
            return
        }
        drawNames(ns, bingoShow, canvas)

    }, [ns, canvas, bingoShow])

    useEffect(() => {
        if (!increase) {
            setZoom(1)
        } else {
            const h = setTimeout(() => {
                clearTimeout(h)
                // setDeg(deg + 10 * Math.random())
                // const ns = [...names].sort(() => Math.random() - 0.5)
                // setNs([...ns, ...ns])
                const z = Math.min(1.5, zoom + 0.01)
                setZoom(z)
            }, 50)
        }
        

    }, [zoom, increase])

    return <div className="rolling-circle-container">
        {/* <div className="rolling-circle">{
            names.length > 0 ? names.map((name, index) => <div className="name-item" style={{
                transform: `translateY(-50%) rotate(${360/names.length * index}deg)`,
                transformOrigin: '50% 50%',
                top: '50%',
            }}>{name}</div>) : null
        }</div> */}
        <div className={`rolling-box`} style={{ width: RADIUS, height: RADIUS, transform: `rotate(${deg}deg)` }} onAnimationEnd={e => {
            setRolling(false)
            setCanRoll(true)
            setBingoShow([...bingos])
        }}>
            <canvas className={` ${rolling ? 'rolling' : ''}`} width={RADIUS} height={RADIUS} ref={setCanvas} />
        </div>
        <div className="rolling-btn-box" style={{ width: RADIUS, height: RADIUS }}>
            <div className='reset' onClick={() => {
                setBingos([])
                setBingoShow([])
            }}>Reset</div>
            <div className='marker'></div>
            <div style={{
                transform: `scale(${zoom},${zoom})`
            }} className={`rolling-button ${canRoll && names.length > bingos.length ? '' : 'disabled'}`} onMouseDown={() => {
                if(rolling) {
                    return
                }
                if (canRoll) {
                    setIncrease(true)
                }
            }} onMouseUp={() => {

                if(rolling) {
                    return
                }

                setIncrease(false)

                const baseNames = names.filter(n => !bingos.includes(n))
                const name = [...baseNames].sort(() => Math.random() - 0.5).shift() || ''
                // console.log({ name, baseNames, names })
                if (!name) {
                    return
                }
                const bs = [...bingos, name]
                setBingos(bs)

                const idx = names.indexOf(name)
                const count = names.length % 2 == 1 ? names.length + 1 : names.length
                const deg = (idx / count) * -360
                // console.log({ name, idx, count, deg, baseNames, bs, names })

                setRolling(true)
                setCanRoll(false)
                setDeg(deg)

            }}>{canRoll ? names.length > bingos.length ? '蓄力' : '已无人可摇' : '等待仪式结束'}</div>
        </div>
        <div className='bingo-list'>
            <div className='title'>中奖人员：</div>
            <ul>{
                bingoShow.length > 0 ? bingoShow.map((name, idx) => <li key={idx}>{name}</li>) : <li className='none'>无</li>
            }</ul>
        </div>
        
    </div>
}