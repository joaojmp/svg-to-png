import { FC, useState } from "react";

import { FaTimes } from "react-icons/fa";

import Layout from "../layout/Layout";

const Compress: FC = () => {
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
    const [fileType, setFileType] = useState<"png" | "jpg" | "webp">("webp");
    const [quality, setQuality] = useState<number>(0.7);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleFiles = async (files: FileList | File[]) => {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            const compressedImages = await Promise.all(imageFiles.map(compressImage));
            const newImages = compressedImages.map((preview, index) => ({
                file: imageFiles[index],
                preview
            }));
            setImages(prevImages => [...prevImages, ...newImages]);
        } else {
            alert('Apenas arquivos de imagem são aceitos.');
        }
    };

    const handleRemoveImage = (index: number) => setImages(prevImages => prevImages.filter((_, i) => i !== index));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleFiles(files);
        }
    };

    const saveImages = async () => {
        if (images.length === 0) {
            alert('Selecione pelo menos uma imagem antes de continuar.');
            return;
        }

        for (const image of images) {
            await saveImage(image);
        }
        setImages([]);
    };

    const saveImage = async (image: { file: File; preview: string }) => {
        const img = new Image();
        img.src = image.preview;

        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Falha ao obter o contexto do canvas.'));
                    return;
                }
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                canvas.toBlob(blob => {
                    if (blob) {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        const fileName = image.file.name;

                        if (fileType === 'jpg') {
                            canvas.toBlob(jpgBlob => {
                                if (jpgBlob) {
                                    link.download = `${fileName.substring(0, fileName.lastIndexOf('.'))}.jpg`;
                                    link.href = URL.createObjectURL(jpgBlob);
                                    link.click();
                                    resolve();
                                } else {
                                    reject(new Error('Failed to convert image to blob.'));
                                }
                            }, 'image/jpeg', quality * 0.9);
                        } else {
                            link.download = `${fileName.substring(0, fileName.lastIndexOf('.'))}.${fileType}`;
                            link.click();
                            resolve();
                        }
                    } else {
                        reject(new Error('Failed to convert image to blob.'));
                    }
                }, `image/${fileType}`, quality);
            };
            img.onerror = () => {
                reject(new Error('Falha ao carregar imagem.'));
            };
        });
    };

    const compressImage = async (file: File): Promise<string> => {
        const img = new Image();
        const reader = new FileReader();

        return new Promise<string>((resolve, reject) => {
            reader.onload = (event) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Falha ao obter o contexto do canvas.'));
                        return;
                    }
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const preview = canvas.toDataURL(`image/${fileType}`, quality);
                    resolve(preview);
                };
                img.src = event.target?.result as string;
            };
            reader.onerror = () => {
                reject(new Error('Falha ao ler o arquivo de imagem.'));
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <Layout>
            <section className="container flex flex-col items-center justify-center my-8">
                <h1 className="font-bold text-3xl mb-10">Comprimir e salvar imagens em {fileType.toUpperCase()}</h1>
                <div onDrop={handleDrop} onDragOver={handleDragOver} className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 min-h-52 relative">
                    {images.length > 0 && (
                        <div className="grid grid-cols-5 gap-4 relative z-10">
                            {images.map((image, index) => (
                                <div key={index} className="bg-white border-2 border-black rounded-lg pt-7 pb-2 px-3 relative">
                                    <img src={image.preview} alt={`Imagem ${index}`} className="w-full h-auto" />
                                    <button onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 transition-all text-red-500 hover:text-red-900" title="Remover">
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" id="fileInput" multiple />
                    <label htmlFor="fileInput" className="absolute w-full h-full flex items-center justify-center text-lg font-medium">
                        {images.length === 0 ? 'Arraste e solte as imagens aqui ou clique para selecionar' : ''}
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
                    <div className="flex flex-col mb-5">
                        <label htmlFor="quality" className="font-medium text-sm mb-2">Qualidade das imagens:</label>
                        <input type="range" min="0" max="1" step="0.01" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
                        <span className="text-sm mt-2">{Math.round(quality * 100)}%</span>
                    </div>
                    <button className="border border-black rounded-md px-5 py-2 font-bold text-white bg-black hover:text-black hover:bg-white transition-all" onClick={saveImages}>
                        Salvar Imagens em {fileType.toUpperCase()}
                    </button>
                </div>
            </section>
        </Layout>
    );
};

export default Compress;
