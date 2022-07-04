import React from "react";
import canvasTxt from "canvas-txt";
import canvasMultilineText from "canvas-multiline-text";
import { split, clearCache } from "../index";
import Breaker from "linebreak";

import "./main.css";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "Benchmark",
};

function makeString(input: number, length: number): string {
    const r = `${input}: Now, this is a story all about how My life got flipped-turned upside down And I'd like to take a minute Just sit right there I'll tell you how I became the prince of a town called Bel-Air In West Philadelphia born and raised On the playground was where I spent most of my days Chillin' out, maxin', relaxin', all cool And all shootin' some b-ball outside of the school When a couple of guys who were up to no good Started making trouble in my neighborhood I got in one little fight and my mom got scared She said, "You're movin' with your auntie and uncle in Bel-Air" I begged and pleaded with her day after day But she packed my suitcase and sent me on my way She gave me a kiss and then she gave me my ticket I put my Walkman on and said, "I might as well kick it" First class, yo this is bad Drinking orange juice out of a champagne glass Is this what the people of Bel-Air living like? Hmm, this might be alright But wait, I hear they're prissy, bourgeois, all that Is this the type of place that they just send this cool cat? I don't think so I'll see when I get there I hope they're prepared for the prince of Bel-Air Well, the plane landed and when I came out There was a dude who looked like a cop standing there with my name out I ain't trying to get arrested yet, I just got here I sprang with the quickness like lightning, disappeared I whistled for a cab and when it came near The license plate said, "Fresh" and it had dice in the mirror If anything I could say that this cab was rare But I thought "Nah, forget it, yo, holmes to Bel Air" I pulled up to the house about seven or eight And I yelled to the cabbie, "Yo holmes, smell ya later" I looked at my kingdom I was finally there To sit on my throne as the prince of Bel-Air`;

    return r.substring(0, length);
}

const correctnessString =
    "This string should have a natural wrap due to this s-entence being a bit too long. Now we will do some new lines.\n\n- First\n- Second\n\nAndnowwewillseehowwell-thishandleswhenthereareno-spacesandthealgorithm-mustfigureoutwhattodo.\n\n政鮮山案表三搬手神一公輩越船断。歳五京政子球納給亡世人陳邸真面観。合内勢美一舞検科続最治持紙。全巡民学働毎満緊用学勢都味補造枝換先。新任海三格季隣抗権住応化止部属話。中党致窓未止用質会図期現。原者減過玉歴試特講向谷浩野案載文東。寿引害近銅大出怒水病噴績座番摂渡。率当来注情場問引社愛配成少読。力機道経動郎遂際検覧前認方";

const iterations = 5000;

export const Benchmark = () => {
    const txtRef = React.useRef<HTMLCanvasElement>(null);
    const hyperRef = React.useRef<HTMLCanvasElement>(null);
    const multiRef = React.useRef<HTMLCanvasElement>(null);

    const [txtResult, setTxtResult] = React.useState<number>();
    const [hyperResult, setHyperResult] = React.useState<number>();
    const [multiResult, setMultiResult] = React.useState<number>();
    const [allowHyper, setAllowHyper] = React.useState(false);
    const [length, setLength] = React.useState(400);

    const onBenchmark = React.useCallback(async () => {
        setTxtResult(undefined);
        setHyperResult(undefined);
        setMultiResult(undefined);
        const txtCanvas = txtRef.current;
        const hyperCanvas = hyperRef.current;
        const multiCanvas = multiRef.current;

        if (txtCanvas === null || hyperCanvas === null || multiCanvas === null) return;

        const txtCtx = txtCanvas.getContext("2d", {
            alpha: false,
        });

        const hyperCtx = hyperCanvas.getContext("2d", {
            alpha: false,
        });

        const multiCtx = multiCanvas.getContext("2d", {
            alpha: false,
        });

        if (txtCtx === null || hyperCtx === null || multiCtx === null) return;

        let total = 0;
        canvasTxt.font = "sans-serif";
        canvasTxt.fontSize = 20;
        canvasTxt.align = "center";
        canvasTxt.vAlign = "top";

        txtCtx.fillStyle = "#eee";
        txtCtx.fillRect(0, 0, 500, 500);
        hyperCtx.fillStyle = "#eee";
        hyperCtx.fillRect(0, 0, 500, 500);
        multiCtx.fillStyle = "#eee";
        multiCtx.fillRect(0, 0, 500, 500);

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

        total = 0;
        multiCtx.textAlign = "center";
        for (let i = 0; i < iterations; i++) {
            multiCtx.fillStyle = "#eee";
            multiCtx.fillRect(0, 0, 500, 500);

            multiCtx.fillStyle = "black";
            const start = performance.now();
            canvasMultilineText(multiCtx, makeString(i, length), {
                font: "sans-serif",
                lineHeight: 1,
                minFontSize: 20,
                maxFontSize: 20,
                rect: {
                    x: 25 + 450 / 2,
                    y: 25,
                    width: 450,
                    height: 475,
                },
            });
            const end = performance.now();
            total += end - start;

            // just to make sure things update
            if (i % 100 === 0) {
                await new Promise(r => window.requestAnimationFrame(r));
            }
        }
        setMultiResult(total);

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
                <div>
                    Canvas-Txt
                    <canvas width={500} height={500} ref={txtRef} />
                </div>
                <div>
                    canvas-multiline-text
                    <canvas width={500} height={500} ref={multiRef} />
                </div>
                <div>
                    Canvas-HyperTxt
                    <canvas width={500} height={500} ref={hyperRef} />
                </div>
            </div>
            {txtResult && (
                <div>
                    canvas-txt time: <b>{Math.round(txtResult / 10) / 100}s</b>
                </div>
            )}
            {multiResult && (
                <div>
                    canvas-multiline-text time: <b>{Math.round(multiResult / 10) / 100}s</b>
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

export const Correctness = () => {
    const txtRef = React.useRef<HTMLCanvasElement>(null);
    const hyperRef = React.useRef<HTMLCanvasElement>(null);
    const multiRef = React.useRef<HTMLCanvasElement>(null);

    const onDraw = React.useCallback(async () => {
        const txtCanvas = txtRef.current;
        const hyperCanvas = hyperRef.current;
        const multiCanvas = multiRef.current;

        if (txtCanvas === null || hyperCanvas === null || multiCanvas === null) return;

        const txtCtx = txtCanvas.getContext("2d", {
            alpha: false,
        });

        const hyperCtx = hyperCanvas.getContext("2d", {
            alpha: false,
        });

        const multiCtx = multiCanvas.getContext("2d", {
            alpha: false,
        });

        if (txtCtx === null || hyperCtx === null || multiCtx === null) return;

        canvasTxt.font = "sans-serif";
        canvasTxt.fontSize = 20;
        canvasTxt.align = "center";
        canvasTxt.vAlign = "top";

        txtCtx.fillStyle = "#eee";
        txtCtx.fillRect(0, 0, 500, 500);
        hyperCtx.fillStyle = "#eee";
        hyperCtx.fillRect(0, 0, 500, 500);
        multiCtx.fillStyle = "#eee";
        multiCtx.fillRect(0, 0, 500, 500);

        txtCtx.fillStyle = "#eee";
        txtCtx.fillRect(0, 0, 500, 500);

        txtCtx.fillStyle = "black";
        canvasTxt.drawText(txtCtx, correctnessString, 25, 25, 450, 475);

        multiCtx.textAlign = "center";
        multiCtx.fillStyle = "#eee";
        multiCtx.fillRect(0, 0, 500, 500);

        multiCtx.fillStyle = "black";
        canvasMultilineText(multiCtx, correctnessString, {
            font: "sans-serif",
            lineHeight: 1,
            minFontSize: 20,
            maxFontSize: 20,
            rect: {
                x: 25 + 450 / 2,
                y: 25,
                width: 450,
                height: 475,
            },
        });

        hyperCtx.font = "20px sans-serif";
        hyperCtx.textBaseline = "top";
        hyperCtx.textAlign = "center";
        hyperCtx.fillStyle = "#eee";
        hyperCtx.fillRect(0, 0, 500, 500);

        hyperCtx.fillStyle = "black";
        const lines = split(hyperCtx, correctnessString, "marker", 450, false, s => {
            const r: number[] = [];

            const b = new Breaker(s);
            console.log("Breaking", b);
            let br = b.nextBreak();
            while (br !== null) {
                r.push(br.position);
                console.log(br.position);
                br = b.nextBreak();
            }

            return r;
        });

        let y = 25;
        for (const l of lines) {
            hyperCtx.fillText(l, 250, y);
            y += 20;

            if (y > 500) break;
        }
    }, []);

    React.useEffect(() => void onDraw(), [onDraw]);

    return (
        <div className="stack">
            <div className="benchmark-container">
                <div>
                    Canvas-Txt
                    <canvas width={500} height={500} ref={txtRef} />
                </div>
                <div>
                    canvas-multiline-text
                    <canvas width={500} height={500} ref={multiRef} />
                </div>
                <div>
                    Canvas-HyperTxt
                    <canvas width={500} height={500} ref={hyperRef} />
                </div>
            </div>
        </div>
    );
};
