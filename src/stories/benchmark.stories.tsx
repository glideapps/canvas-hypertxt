import React from "react";
import canvasTxt from "canvas-txt";
import { split, clearCache } from "../index";

import "./main.css";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "Benchmark",
};

function makeString(input: number, length: number): string {
    const r = `${input}: this is a very long string which contains newlines\n and is quite long enough to need to be wrapped multiple times. Now, this is a story all about how My life got flipped-turned upside down And I'd like to take a minute Just sit right there I'll tell you how I became the prince of a town called Bel-Air In West Philadelphia born and raised On the playground was where I spent most of my days Chillin' out, maxin', relaxin', all cool And all shootin' some b-ball outside of the school When a couple of guys who were up to no good Started making trouble in my neighborhood I got in one little fight and my mom got scared She said, "You're movin' with your auntie and uncle in Bel-Air" I begged and pleaded with her day after day But she packed my suitcase and sent me on my way She gave me a kiss and then she gave me my ticket I put my Walkman on and said, "I might as well kick it" First class, yo this is bad Drinking orange juice out of a champagne glass Is this what the people of Bel-Air living like? Hmm, this might be alright But wait, I hear they're prissy, bourgeois, all that Is this the type of place that they just send this cool cat? I don't think so I'll see when I get there I hope they're prepared for the prince of Bel-Air Well, the plane landed and when I came out There was a dude who looked like a cop standing there with my name out I ain't trying to get arrested yet, I just got here I sprang with the quickness like lightning, disappeared I whistled for a cab and when it came near The license plate said, "Fresh" and it had dice in the mirror If anything I could say that this cab was rare But I thought "Nah, forget it, yo, holmes to Bel Air" I pulled up to the house about seven or eight And I yelled to the cabbie, "Yo holmes, smell ya later" I looked at my kingdom I was finally there To sit on my throne as the prince of Bel-Air`;

    return r.substring(0, length);
}

const iterations = 5000;

export const Benchmark = () => {
    const txtRef = React.useRef<HTMLCanvasElement>(null);
    const hyperRef = React.useRef<HTMLCanvasElement>(null);

    const [txtResult, setTxtResult] = React.useState<number>();
    const [hyperResult, setHyperResult] = React.useState<number>();
    const [allowHyper, setAllowHyper] = React.useState(false);
    const [length, setLength] = React.useState(1000);

    const onBenchmark = React.useCallback(async () => {
        setTxtResult(undefined);
        setHyperResult(undefined);
        const txtCanvas = txtRef.current;
        const hyperCanvas = hyperRef.current;

        if (txtCanvas === null || hyperCanvas === null) return;

        const txtCtx = txtCanvas.getContext("2d", {
            alpha: false,
        });

        const hyperCtx = hyperCanvas.getContext("2d", {
            alpha: false,
        });

        if (txtCtx === null || hyperCtx === null) return;

        let total = 0;
        canvasTxt.font = "sans-serif";
        canvasTxt.fontSize = 20;
        canvasTxt.align = "center";
        canvasTxt.vAlign = "top";

        txtCtx.fillStyle = "#eee";
        txtCtx.fillRect(0, 0, 500, 500);
        hyperCtx.fillStyle = "#eee";
        hyperCtx.fillRect(0, 0, 500, 500);

        for (let i = 0; i < iterations; i++) {
            txtCtx.fillStyle = "#eee";
            txtCtx.fillRect(0, 0, 500, 500);

            txtCtx.fillStyle = "black";
            const start = performance.now();
            canvasTxt.drawText(txtCtx, makeString(i, length), 25, 25, 450, 475);
            const end = performance.now();
            total += end - start;

            // just to make sure things update
            if (i % 100 === 0) {
                await new Promise(r => window.requestAnimationFrame(r));
            }
        }
        setTxtResult(total);

        // keep things fair
        clearCache();
        total = 0;

        hyperCtx.font = "20px sans-serif";
        hyperCtx.textBaseline = "top";
        hyperCtx.textAlign = "center";
        for (let i = 0; i < iterations; i++) {
            hyperCtx.fillStyle = "#eee";
            hyperCtx.fillRect(0, 0, 500, 500);

            hyperCtx.fillStyle = "black";
            const start = performance.now();
            const lines = split(hyperCtx, makeString(i, length), "marker", 450, allowHyper);

            let y = 25;
            for (const l of lines) {
                hyperCtx.fillText(l, 250, y);
                y += 20;

                if (y > 500) break;
            }

            const end = performance.now();
            total += end - start;

            // just to make sure things update
            if (i % 100 === 0) {
                await new Promise(r => window.requestAnimationFrame(r));
            }
        }
        setHyperResult(total);
    }, [allowHyper, length]);

    return (
        <div className="stack">
            <div className="bar">
                <button onClick={onBenchmark}>Benchmark</button>
                <span>Enable HyperWrapping: </span>
                <input type={"checkbox"} checked={allowHyper} onChange={e => setAllowHyper(e.currentTarget.checked)} />
            </div>
            Length:{" "}
            <input
                min={20}
                max={2000}
                step={20}
                type={"range"}
                value={length}
                onChange={e => setLength(e.currentTarget.valueAsNumber)}
            />
            {" " + length}
            <div className="benchmark-container">
                <canvas width={500} height={500} ref={txtRef} />
                <canvas width={500} height={500} ref={hyperRef} />
            </div>
            {txtResult && (
                <div>
                    canvas-txt time: <b>{Math.round(txtResult / 10) / 100}s</b>
                </div>
            )}
            {hyperResult && (
                <div>
                    canvas-hypertxt time: <b>{Math.round(hyperResult / 10) / 100}s</b>
                </div>
            )}
        </div>
    );
};
