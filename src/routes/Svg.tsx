import { useEffect, useState } from "react";

import Layout from "../layout/Layout";

const Svg = () => {
    const [fileType, setFileType] = useState<"png" | "jpg" | "webp">("png");
    const [svgText, setSvgText] = useState("");
    const [sizes, setSizes] = useState({
        width: 16,
        height: 16,
    });

    const handleSvgChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSvgText(event.target.value);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSizes({
            ...sizes,
            [event.target.id]: parseInt(event.target.value),
        });
    };

    const saveSvgAsImage = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        const previewSvg = document.getElementById("preview-svg");
        const svg = previewSvg?.querySelector("svg");

        if (ctx && svg) {
            const data = new XMLSerializer().serializeToString(svg);
            const img = new Image();

            img.onload = () => {
                ctx.drawImage(img, 0, 0, sizes.width, sizes.height);
                let imageBlob;

                switch (fileType) {
                    case "png":
                        imageBlob = canvas.toDataURL("image/png");
                        break;
                    case "jpg":
                        imageBlob = canvas.toDataURL("image/jpeg");
                        break;
                    case "webp":
                        imageBlob = canvas.toDataURL("image/webp");
                        break;
                }

                const downloadLink = document.createElement("a");
                downloadLink.href = imageBlob;
                downloadLink.download = `image.${fileType}`;
                downloadLink.click();
            };

            img.src = "data:image/svg+xml;base64," + btoa(data);

            setSvgText("");
        }
    };


    useEffect(() => {
        const previewSvg = document.getElementById("preview-svg");

        if (previewSvg) {
            previewSvg.innerHTML = svgText;

            const canvas = document.getElementById("canvas") as HTMLCanvasElement;

            if (canvas) {
                canvas.width = sizes.width;
                canvas.height = sizes.height;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    const previewSvg = document.getElementById("preview-svg");

                    if (previewSvg) {
                        const svg = previewSvg.querySelector("svg");

                        if (svg) {
                            const data = new XMLSerializer().serializeToString(svg);
                            const img = new Image();
                            img.src = "data:image/svg+xml;base64," + btoa(data);
                            img.onload = () => {
                                ctx.drawImage(img, 0, 0, sizes.width, sizes.height);
                            };
                        }
                    }
                }
            }
        }
    }, [svgText, sizes]);

    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        if (canvas) {
            canvas.width = sizes.width;
            canvas.height = sizes.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                const previewSvg = document.getElementById("preview-svg");

                if (previewSvg) {
                    const svg = previewSvg.querySelector("svg");

                    if (svg) {
                        const data = new XMLSerializer().serializeToString(svg);
                        const img = new Image();
                        img.src = "data:image/svg+xml;base64," + btoa(data);
                        img.onload = () => {
                            ctx.drawImage(img, 0, 0, sizes.width, sizes.height);
                        };
                    }
                }
            }
        }
    }, [sizes]);

    return (
        <Layout>
            <section className="container flex flex-col items-center justify-center my-8">
                <h1 className="font-bold text-3xl mb-4">
                    SVG para {fileType.toUpperCase()}
                </h1>

                <div className="grid">
                    <label htmlFor="svg" className="font-medium text-sm mb-1">SVG code:</label>
                    <textarea id="svg" rows={6} cols={50} className="rounded-md p-2 mb-4" value={svgText} onChange={handleSvgChange} />
                </div>

                {svgText && (
                    <div className="mb-4 text-center">
                        <span className="block font-medium text-sm mb-1">Preview:</span>
                        <div id="preview-svg" className="flex items-center justify-center"></div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                    <div className="grid">
                        <label htmlFor="width" className="font-medium text-sm mb-1">Width:</label>
                        <input type="number" id="width" className="rounded-md p-2" value={sizes.width} onChange={handleSizeChange} onClick={(e) => e.currentTarget.select()} />
                    </div>
                    <div className="grid">
                        <label htmlFor="height" className="font-medium text-sm mb-1">Height:</label>
                        <input type="number" id="height" className="rounded-md p-2" value={sizes.height} onChange={handleSizeChange} onClick={(e) => e.currentTarget.select()} />
                    </div>
                </div>

                {svgText && (
                    <div className="mt-10">
                        <canvas id="canvas" className="border rounded-md p-2"></canvas>
                    </div>
                )}

                <div className="flex flex-col mt-4">
                    <label htmlFor="type" className="font-medium text-sm mb-2">Tipo do arquivo:</label>
                    <select id="type" className="rounded-md p-2 mb-4" onChange={(e) => setFileType(e.target.value as "png" | "jpg" | "webp")}>
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="webp">WEBP</option>
                    </select>
                </div>

                <button type="button" className="border border-black rounded-md mt-10 px-5 py-2 mb-10 font-bold text-white bg-black hover:text-black hover:bg-white transition-all" onClick={saveSvgAsImage}>
                    Salvar SVG para {fileType.toUpperCase()}
                </button>
            </section>
        </Layout>
    )
};

export default Svg;