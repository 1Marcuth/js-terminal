import { FC } from "react"

import styles from "./style.module.scss"

interface IProps {
    prefix: string
}

const TerminalPrefix: FC<IProps> = ({ prefix }) => {
    return (
        <span className={`${styles["terminal-prefix"]} select-none`}>
            {prefix}
        </span>
    )
}

export default TerminalPrefix