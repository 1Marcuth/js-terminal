import { FC } from "react"

import styles from "./style.module.scss"

interface IProps {
    children: any
}

const TerminalOutput: FC<IProps> = ({ children }) => {
    return (
        <span className={`${styles["terminal-output"]} flex gap-1 text-gray-400 text-xs`}>
            {children}
        </span>
    )
}

export default TerminalOutput