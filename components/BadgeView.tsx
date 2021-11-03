import { useEffect, useRef, useState } from "react";

const ASEXUAL_COLOURS = [
    "#000000",
    "#a3a3a3",
    "#ffffff",
    "#800070",
];

const BI_COLOURS = [
    "#d60270",
    "#d60270",
    "#9b4f96",
    "#0038A8",
    "#0038A8",
];

const LESBIAN_COLOURS = [
    "#d62900",
    "#ff9b55",
    "#ffffff",
    "#d461a6",
    "#a50062",
];

const PAN_COLOURS = [
    "#ff1b8d",
    "#ffda00",
    "#1bb3ff",
];

const PRIDE_COLOURS = [
    "#ff0018",
    "#ffa52c",
    "#ffff41",
    "#008018",
    "#0000f9",
    "#86007d",
];

const NB_COLOURS = [
    '#fff430',
    '#ffffff',
    '#9c59d1',
    '#000000',
];

const TRANS_COLOURS = [
    '#55cdfc',
    '#f7a8b8',
    '#ffffff',
    '#f7a8b8',
    '#55cdfc',
];

export const FLAGS = {
    'asexual': {
        colours: ASEXUAL_COLOURS,
        name: 'Asexual',
    },
    'bisexual': {
        colours: BI_COLOURS,
        name: 'Bisexual',
    },
    'lesbian': {
        colours: LESBIAN_COLOURS,
        name: 'Lesbian',
    },
    'pansexual': {
        colours: PAN_COLOURS,
        name: 'Pansexual',
    },
    'pride': {
        colours: PRIDE_COLOURS,
        name: 'Pride',
    },
    'non-binary': {
        colours: NB_COLOURS,
        name: 'Non Binary',
    },
    'trans': {
        colours: TRANS_COLOURS,
        name: 'Trans',
    },
};

interface Flags {
    [key: string]: Flag,
}

export interface Flag {
    colours: string[],
    name: string,
}

export type FlagName = keyof typeof FLAGS;

interface Props {
    pronouns: string
    flag: FlagName
    textColour?: string
}

function roundRect(canvas: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    canvas.beginPath();
    canvas.moveTo(x + r, y);
    canvas.arcTo(x + w, y, x + w, y + h, r);
    canvas.arcTo(x + w, y + h, x, y + h, r);
    canvas.arcTo(x, y + h, x, y, r);
    canvas.arcTo(x, y, x + w, y, r);
    canvas.closePath();
    canvas.fill();
}

const BadgeView: React.FC<Props> = (props) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    useEffect(() => {
        const { colours: flagColours } = FLAGS[props.flag];

        function renderCanvasToURL(canvas: HTMLCanvasElement): Promise<string> {
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                });
            });
        }

        function renderToCanvas() {
            const context = canvas.current?.getContext('2d');
            if (!context) {
                console.error('we do not have a canvas to get a context!');
                return;
            }

            // Clear ready for new render
            context.clearRect(0, 0, 256, 96);

            // Build a gradient of the flag colours
            const grad = context.createLinearGradient(0, 0, 256, 96);
            for (let i = 0; i < flagColours.length; i++) {
                const col = flagColours[i];
                grad.addColorStop(i / (flagColours.length - 1), col);
            }

            // Render the background
            context.fillStyle = grad;
            roundRect(context, 0, 0, 256, 96, 16);

            context.font = '36px Poppins';
            context.textBaseline = 'middle';
            context.fillStyle = props.textColour ?? 'black';
            // Calculate the width so we can correctly centre the text
            const textWidth = context.measureText(props.pronouns).width;
            const textX = (256 - textWidth) / 2;
            context.fillText(props.pronouns, textX, (96 / 2));

            // Convert the canvas data to an object URL and set the download link value
            renderCanvasToURL(canvas.current!).then(setDownloadUrl);
        }

        renderToCanvas();
    }, [props.flag, props.textColour, props.pronouns]);

    return (
        <div className="pb-4">
            <canvas ref={canvas} width={256} height={96} className="border-2 rounded-3xl border-black dark:border-white" />

            <br />

            {downloadUrl && <a href={downloadUrl} download="pronouns-badge.png"
                className="p-1 m-2 border-2 border-black dark:border-white rounded bg-green-400 dark:bg-green-600">&#x25BC; Download</a>}
        </div>
    );
}

export default BadgeView;
