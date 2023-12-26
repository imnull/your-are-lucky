import { useState } from 'react'
import InputNames from '~/components/input-names'
import Rolling from '~/components/rolling'

export default () => {
    const [names, setNames] = useState<string[]>([])
    return <>
        <h1>你真幸运</h1>
        <InputNames onChanged={setNames} />
        <Rolling names={names} />
    </>
}