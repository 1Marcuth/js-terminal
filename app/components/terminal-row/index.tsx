import { FC, ReactElement } from "react"

import styles from "./style.module.scss"

interface IProps {
    children: ReactElement | ReactElement[]
}

const TerminalRow: FC<IProps> = ({ children }) => {
    return (
        <tr className={`${styles["terminal-row"]} w-full flex flex-col`}>
            {children}
        </tr>
    )
}

export default TerminalRow