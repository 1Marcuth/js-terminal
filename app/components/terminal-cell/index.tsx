import { FC, ReactElement } from "react"

import styles from "./style.module.scss"

interface IProps {
    children: ReactElement | ReactElement[] | string | any
}

const TerminalCell: FC<IProps> = ({ children }) => {
    return (
        <td className={`${styles["terminal-cell"]} flex w-full flex justify-start items-center gap-2 text-xs`}>
            {children}
        </td>
    )
}

export default TerminalCell