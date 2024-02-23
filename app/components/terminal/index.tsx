"use client"

import { FC, ChangeEvent, useRef, useState, useEffect, createContext, useContext } from "react"
import * as clientHelper from "client-helper"
import { v4 as uuidv4 } from "uuid"

import TerminalPrefix from "../terminal-prefix"
import TerminalOutput from "../terminal-output"
import TerminalInput from "../terminal-input"
import TerminalCell from "../terminal-cell"
import TerminalRow from "../terminal-row"

import styles from "./style.module.scss"


function stringifyValue(value: any): string {
    return value ? value.toString() : "undefined"
}

const CommandsContext = createContext<any>({})

function handleCommand(command: string, commandsContext: typeof CommandsContext): string {
    let result: any

    try {
        result = (
            (() => {
                "use strict"
                return eval(command)
            }).bind(commandsContext)()
        )
    } catch (error: any) {
        result = `Error: ${error.message}`
    }

    return stringifyValue(result)
}

type TerminalCellState = {
    command: string
    output: string
    id: string
}

type TerminalRowState = {
    id: string
    cells: TerminalCellState[]
}

type TerminalHistory = TerminalRowState[]

type ExtendedWindow = {
    clear?: () => string
} & Window & typeof globalThis & {
    createAudio: typeof clientHelper.createAudio
    createImage: typeof clientHelper.createImage
    createVideo: typeof clientHelper.createVideo
    fileToDataUrl: typeof clientHelper.fileToDataUrl
    formatFileSize: typeof clientHelper.formatFileSize
    getFileExtension: typeof clientHelper.getFileExtension
    includeCss: typeof clientHelper.includeCss
    includeScript: typeof clientHelper.includeScript
    openAudio: typeof clientHelper.openAudio
    openFile: typeof clientHelper.openFile
    openImage: typeof clientHelper.openImage
    openVideo: typeof clientHelper.openVideo
    saveMedia: typeof clientHelper.saveMedia
    saveTextFile: typeof clientHelper.saveTextFile
}

const getWindow = (): ExtendedWindow => {
    // @ts-ignore
    const extendedWindow: ExtendedWindow = window

    extendedWindow.clear = () => {
        console.clear()
        return "The console has been cleaned."
    }

    extendedWindow.createAudio = clientHelper.createAudio
    extendedWindow.createImage = clientHelper.createImage
    extendedWindow.createVideo = clientHelper.createVideo
    extendedWindow.fileToDataUrl = clientHelper.fileToDataUrl
    extendedWindow.formatFileSize = clientHelper.formatFileSize
    extendedWindow.getFileExtension = clientHelper.getFileExtension
    extendedWindow.includeCss = clientHelper.includeCss
    extendedWindow.includeScript = clientHelper.includeScript
    extendedWindow.openAudio = clientHelper.openAudio
    extendedWindow.openFile = clientHelper.openFile
    extendedWindow.openImage = clientHelper.openImage
    extendedWindow.openVideo = clientHelper.openVideo
    extendedWindow.saveMedia = clientHelper.saveMedia
    extendedWindow.saveTextFile = clientHelper.saveTextFile

    return extendedWindow
}

const Terminal: FC = () => {
    const tableRef = useRef<HTMLTableElement>(null)
    const [ command, setCommand ] = useState<string>("")
    const [ history, setHistory ] = useState<TerminalHistory>([])
    const commandsContext = useContext(CommandsContext)

    const handleKeyEnterPressed = () => {
        const currentCommand = command.trim()

        let output: string

        if (currentCommand === "clear()" || currentCommand === "console.clear()") {
            setHistory([])
        }

        output = handleCommand(currentCommand, commandsContext)

        setHistory(prevHistory => [
            ...prevHistory,
            {
                id: uuidv4(),
                cells: [
                    {
                        id: uuidv4(),
                        command: currentCommand,
                        output: output
                    }
                ]
            }
        ])

        setCommand("")
    }

    const handleCommandChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newCommand = event.target.value
        setCommand(newCommand)
    }

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.code === "Enter") handleKeyEnterPressed()
    }

    useEffect(() => {
        var window = getWindow()
        const table = tableRef.current

        if (!table) return
        
        table.addEventListener("keydown", handleKeydown)

        return () => {
            table.removeEventListener("keydown", handleKeydown)
        }
    }, [tableRef, command])

    return (
        <table 
            ref={tableRef}
            className={`${styles["terminal"]} bg-gray-800 flex border rounded border-gray-600 px-2 py-3 w-4/5 min-w-[400px] max-w-[1000px] h-[600px] scroll-auto`}
        >
            <tbody className="w-full table">
                {history.map(row => {
                    return (
                        <TerminalRow key={row.id}>
                            {row.cells.map(cell => {
                                return (
                                    <>
                                        <TerminalCell key={`${cell.id}-a`}>
                                            <TerminalPrefix prefix="$" key={`${cell.id}-a-prefix`}/>
                                            {cell.command}
                                        </TerminalCell>
                                        <TerminalCell key={`${cell.id}-b`}>
                                            <TerminalOutput key={`${cell.id}-b-output`}>
                                                <i className={`bi bi-arrow-return-right text-gray-600 ${cell.id}-b-icon`}/>
                                                {cell.output}
                                            </TerminalOutput>
                                        </TerminalCell>
                                    </>
                                )
                            })}
                        </TerminalRow>
                    )
                })}
                <TerminalRow>
                    <TerminalCell key={"input-terminal-cell"}>
                        <TerminalPrefix prefix="$" key="input-terminal-cell-prefix"/>
                        <TerminalInput
                            key="input-terminal-cell-input"
                            onInputChange={handleCommandChange}
                            value={command}
                        />
                    </TerminalCell>
                </TerminalRow>
            </tbody>
        </table>
    )
}

export default Terminal