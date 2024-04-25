import { useState } from "react";

import { FaX } from "react-icons/fa6";

import Layout from "../layout/Layout";

const Webp = () => {
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
    const [fileType, setFileType] = useState<"png" | "jpg" | "webp">("webp");

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFiles = (files: FileList | File[]) => {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            const newImages = imageFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages(prevImages => [...prevImages, ...newImages]);
        } else {
            alert('Please drop or select only image files.');
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleFiles(files);
        }
    };

    const saveImages = async () => {
        if (images.length === 0) {
            alert('Selecione ao menos uma imagem para continuar.');
            return;
        }

        let count = 0;

        for (const image of images) {
            count++;

            await new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = image.preview;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0, img.width, img.height);
                    canvas.toBlob(blob => {
                        if (blob) {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            const fileName = image.file.name;
                            link.download = `${fileName.substring(0, fileName.lastIndexOf('.'))}.${fileType}`;
                            link.click();
                            resolve();
                        } else {
                            reject(new Error('Failed to convert image to blob.'));
                        }
                    }, `image/${fileType}`);
                };
                img.onerror = () => {
                    reject(new Error('Failed to load image.'));
                };
            });
        }

        if (count === images.length) {
            setImages([]);
        }
    };


    return (
        <Layout>
            <section className="container flex flex-col items-center justify-center my-8">
                <h1 className="font-bold text-3xl mb-10">Converter imagens para .{fileType}</h1>
                <div onDrop={handleDrop} onDragOver={handleDragOver} className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 min-h-52 relative">
                    {images.length > 0 && (
                        <div className="grid grid-cols-5 gap-4 relative z-10">
                            {images.map((image, index) => (
                                <div key={index} className="bg-white border-2 border-black rounded-lg pt-7 pb-2 px-3 relative">
                                    <img src={image.preview} alt={`Dropped ${index}`} className="w-full h-auto" />
                                    <button onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 transition-all text-red-500 hover:text-red-900" title="Remover">
                                        <FaX />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" id="fileInput" multiple />
                    <label htmlFor="fileInput" className="absolute w-full h-full flex items-center justify-center text-lg font-medium">
                        {images.length === 0 ? 'Arraste e solte as imagens aqui' : ''}
                    </label>
                </div>
                <div className="text-center mt-10">
                    <div className="flex flex-col mb-3">
                        <label htmlFor="type" className="font-medium text-sm mb-2">Tipo do arquivo:</label>
                        <select id="type" className="rounded-md p-2 mb-4" onChange={(e) => setFileType(e.target.value as "png" | "jpg" | "webp")}>
                            <option value="webp">WEBP</option>
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                        </select>
                    </div>
                    <button className="border border-black rounded-md px-5 py-2 font-bold text-white bg-black hover:text-black hover:bg-white transition-all" onClick={saveImages}>
                        Salvar imagens .{fileType}
                    </button>
                </div>
            </section>
        </Layout >
    );
};

export default Webp;
