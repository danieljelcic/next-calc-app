'use client'

import { useState } from "react";
import clsx from "clsx";

interface ButtonProps {
    displayValue: string;
    isOpButton: boolean;
    setCurrentValue: ( prevValue: string ) => any;
    width: 1 | 2;
}

function Button ({displayValue, isOpButton, setCurrentValue, width}: ButtonProps) {
    return (
        <button className={clsx(
                {
                    "w-1/4 h-full": width === 1,
                    "w-1/2 h-full": width === 2
                }, 
                {
                    "bg-slate-300 hover:bg-slate-400 text-black": !isOpButton,
                    "bg-orange-500 hover:bg-orange-600 text-white": isOpButton,
                },
                "text-lg",
                "outline-black",
                "transition-all"
            )}
            onClick={() => { setCurrentValue(displayValue) }}
        >
            {displayValue}
        </button>
    )
}

const buttonOrder = [["AC", "+/-", "%", "/"], ["7", "8", "9", "x"], ["4", "5", "6", "-"], ["1", "2", "3", "+"], ["0", ".", "="]];
const opButtons = new Set(["/", "x", "-", "+"]);

const getOp = (opString: string) => {
    switch (opString) {
        case "/":
            return (a: number, b: number) => a / b;
        case "x":
            return (a: number, b: number) => a * b;
        case "-":
            return (a: number, b: number) => a - b;
        case "+":
            return (a: number, b: number) => a + b;
        default:
            return (a: number, _: number) => a
    }
}

export default function Home() {

    // buttons

    // 1-9: append digit to current value
    // .: append FP to cv if FP isn't in cv
    // 0: append to cv if cv != 0
    // AC: resets cv, tv, op
    // +/-, % : alter cv
    // /, x, -, +: save cv to temp, set curr op, reset cv
    // =: sets cv to op(tv, cv), resets tv and op

    const [currentValue, setCurrentValue] = useState("0")
    const [tempValue, setTempValue] = useState("0")
    const [currOp, setCurrOp] = useState<string>();
    const [isFloating, setIsFloating] = useState(false);

    const addDigitOrFP = (digitOrFP: string) => {
        switch (digitOrFP) {
            case "0":
                if (currentValue !== "0") {
                    setCurrentValue((prevValue) => `${prevValue}${digitOrFP}`)
                }
                break;
            case ".":
                if (!isFloating) {
                    setCurrentValue((prevValue) => `${prevValue}${digitOrFP}`)
                    setIsFloating((prev) => true)
                }
                break;
        
            default:
                if (currentValue === "0") {
                    setCurrentValue((_) => digitOrFP)
                } else {
                    setCurrentValue((prevValue) => `${prevValue}${digitOrFP}`)
                }
                break;
        }
    }

    const clearAll = () => {
        setCurrentValue("0");
        setIsFloating(false);
        setTempValue("0");
        setCurrOp(undefined);
    }

    const negate = () => {
        setCurrentValue((prev) => `${-(parseFloat(prev))}`)
    }

    const percent = () => {
        setCurrentValue((prev) => `${(parseFloat(prev) / 100)}`)
    }

    const setOp = (op: string) => {
        setTempValue(currentValue)
        setCurrOp(op); // set to function
        setCurrentValue("0");
    }

    const performOp = () => {
        if (currOp) {
            const op = getOp(currOp)
            const tempNum = parseFloat(tempValue);
            const currNum = parseFloat(currentValue);
            const result = op(tempNum, currNum);

            clearAll()
            setCurrentValue(`${result}`);
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="w-full bg-slate-500 text-white justify-end px-10 py-7">
                <p className="w-full text-right text-2xl">
                    {currentValue}
                </p>
            </div>
            {
                buttonOrder.map((buttonRow, i) => {
                    return (
                        <div className="w-full h-1/5 flex flex-row" key={`button-row-${i}`}>
                            {
                                buttonRow.map((buttonValue, j) => {

                                    let setValue;
                                    if (buttonValue === "AC") {
                                        setValue = clearAll
                                    } else if (opButtons.has(buttonValue)) {
                                        setValue = setOp;
                                    } else if (buttonValue === "=") {
                                        setValue = performOp
                                    } else if (buttonValue === "+/-") {
                                        setValue = negate
                                    } else if (buttonValue === "%") {
                                        setValue = percent
                                    } else {
                                        setValue = addDigitOrFP
                                    }

                                    return <Button 
                                        key={`button-${i}-${j}`}
                                        displayValue={buttonValue}
                                        isOpButton={j === (buttonRow.length - 1)}
                                        setCurrentValue={setValue}
                                        width={buttonValue === "0" ? 2 : 1} />
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    );
}
