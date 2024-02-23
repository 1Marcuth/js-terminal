import { FC, ChangeEvent } from "react"

import styles from "./style.module.scss"

interface IProps {
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => any
    value: string
}

const TerminalInput: FC<IProps> = ({ onInputChange, value }) => {
    return (
        <div className={`${styles["terminal-input"]} flex w-full`}>
            <input
                type="text"
                onInput={onInputChange}
                value={value}
                className="w-full focus:outline-none bg-transparent"
            />
        </div>
    )
}

export default TerminalInput