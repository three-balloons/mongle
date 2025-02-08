import { useCallback, useEffect, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

import { PdfTest } from '@/components/PdfTest';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

console.log(GlobalWorkerOptions, 'log');
type PDFViewerProps = {
    pdfPath: string;
};

const PDFViewer = ({ pdfPath }: PDFViewerProps) => {
    const [pages, setPages] = useState<JSX.Element[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1);

    const onLoadSuccess = () => {
        console.log(`pdf 로딩 성공`);
        setError(false);
    };

    const onLoadFail = (e: Error) => {
        console.log(`pdf 로딩 실패! ${e}`);
        setError(true);
    };

    const renderPDF = useCallback(
        async (pdfPath: string) => {
            try {
                const loadingTask = getDocument(pdfPath);
                const doc = await loadingTask.promise;

                const totalPage = doc.numPages;
                setTotal(totalPage);

                if (totalPage === 0) {
                    throw new Error(`전체 페이지가 0`);
                }

                const pageArr = Array.from(Array(totalPage + 1).keys()).slice(1);
                const allPages = pageArr.slice(0, 1).map((i) => <PdfTest doc={doc} page={i} key={i} scale={scale} />);
                setPages(allPages);

                onLoadSuccess();
            } catch (e) {
                onLoadFail(e as Error);
            }
        },
        [scale],
    );

    useEffect(() => {
        renderPDF(pdfPath);
    }, [pdfPath, scale]);

    return (
        <>
            <div> total: {total}</div>
            <button onClick={() => setScale(scale + 0.5)}>+</button>
            <button onClick={() => setScale(scale - 0.5)}>-</button>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'scroll',
                }}
                id="canvas-scroll"
            >
                {pages}
                {error && <div style={{ height: '100%', margin: '5px auto' }}>pdf 로딩에 실패했습니다.</div>}
            </div>
        </>
    );
};

export default PDFViewer;
