import { FC } from "react"

import Terminal from "./components/terminal"
import styles from "./style.module.scss"

const Home: FC = () => {
    return (
        <div className={`${styles["home-page"]} bg-gradient-to-r from-gray-900 to-gray-950 w-screen h-screen`}>
            <h1 className="text-center text-2xl py-4">JS-TERMINAL</h1>
            <div className="terminal-wrapper flex justify-center items-center">
                <Terminal/>
            </div>
        </div>
    )
}

export default Home