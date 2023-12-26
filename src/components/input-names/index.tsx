import { useEffect, useState } from "react"

import './index.scss'

const LOCALSTORAGE_NAMES_KEY = 'names'

export default (props: {
    onChanged?: (names: string[]) => void;
    canChange?: boolean;
}) => {

    const { onChanged, canChange = true } = props

    const [names, setNames] = useState(localStorage.getItem(LOCALSTORAGE_NAMES_KEY) || '')
    const [nameList, setNameList] = useState<string[]>([])

    useEffect(() => {
        typeof onChanged === 'function' && onChanged(nameList)
    }, [nameList])

    useEffect(() => {
        const _names = (names || '').trim()
        if (!_names) {
            setNameList([])
        } else {
            const nameList = _names.split(/[\r\n]+/)
            setNameList(nameList)
        }
    }, [names])

    return <div className="input-names">
        <div className="desc">请在左侧输入框输入抽签人名字，一行一个。</div>
        <div className="input-area">
            <textarea disabled={!canChange} onInput={e => {
                const val = ((e.target as any).value as string) || ''
                localStorage.setItem(LOCALSTORAGE_NAMES_KEY, val)
                setNames(val)
            }} value={names} />
            {/* <ul className="input-list">{
                nameList.map(name => <li style={{
                    transform: `rotate(0deg)`
                }}>{name}</li>)
            }</ul> */}
        </div>
        <div className="desc bottom">共{nameList.length}人</div>
    </div>
}