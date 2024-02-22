"use client"

import { FC, ChangeEvent, useRef, useState, useEffect, createContext, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

import TerminalPrefix from "../terminal-prefix"
import TerminalOutput from "../terminal-output"
import TerminalInput from "../terminal-input"
import TerminalCell from "../terminal-cell"
import TerminalRow from "../terminal-row"

import styles from "./style.module.scss"


function stringifyValue(value: any): string {
    if (typeof value === "object") {
        let properties

        if (Array.isArray(value)) {
            properties = value.map(stringifyValue).join(", ")
        } else {
            properties = Object.keys(value).map(function(key) {
                return key + ": " + stringifyValue(value[key])
            }).join(", ")
        }

        return Array.isArray(value) ? "[" + properties + "]" : "{" + properties + "}"
    } else {
        return value ? value.toString() : "undefined"
    }
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
} & Window & typeof globalThis

const getWindow = (): ExtendedWindow => {
    // @ts-ignore
    const extendedWindow: ExtendedWindow = window

    extendedWindow.clear = () => {
        console.clear()
        return "The console has been cleaned."
    }

    return extendedWindow
}

const Terminal: FC = () => {
    const tableRef = useRef<HTMLTableElement>(null)
    const [ command, setCommand ] = useState<string>("")
    const [ history, setHistory ] = useState<TerminalHistory>([])
    const commandsContext = useContext(CommandsContext)

    const handleKeyEnterPressed = () => {
        const currentCommand = command.trim();
        if (currentCommand === "") return;

        let output: string

        if (currentCommand === "clear()") {
            setHistory([])
        }

        output = handleCommand(currentCommand, commandsContext)

        setHistory(prevHistory => [
            ...prevHistory,
            { id: uuidv4(), cells: [{ id: uuidv4(), command: currentCommand, output }] },
        ]);

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
            className={`${styles["terminal"]} bg-gray-800 flex w-screen border rounded border-gray-600 px-2 py-3 w-4/5 min-w-[400px] max-w-[1000px] h-[600px] scroll-auto`}
        >
            <tbody className="w-full table">
                {history.map(row => {
                    return (
                        <TerminalRow key={row.id}>
                            {row.cells.map(cell => {
                                return (
                                    <>
                                        <TerminalCell key={cell.id}>
                                            <TerminalPrefix prefix="$"/>
                                            {cell.command}
                                        </TerminalCell>
                                        <TerminalCell>
                                            <TerminalOutput>
                                                <i className="bi bi-arrow-return-right text-gray-600"/>
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
                    <TerminalCell>
                        <TerminalPrefix prefix="$"/>
                        <TerminalInput onInputChange={handleCommandChange}/>
                    </TerminalCell>
                </TerminalRow>
            </tbody>
        </table>
    )
}

export default Terminal