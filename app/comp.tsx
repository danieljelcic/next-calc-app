'use client'

import { MouseEventHandler } from "react";

interface Props {
    prop: any;
    funProp: MouseEventHandler<any>;
}

export function MyComp ({ prop, funProp }: Props) {
    return (
        <div className="text-lg flex flex-col items-center mt-6">
            <p>
                This is my component.
            </p>
            <p>
                {`Parent says: ${prop}`}
            </p>
            <div>
                <button
                    onClick={funProp}
                    className="bg-slate-500 p-3 text-white"
                >
                    Ping parent
                </button>
            </div>
        </div>
    )
}