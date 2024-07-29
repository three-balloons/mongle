import { WorkspaceSettingModal } from '@/components/workspaceSettingModal/WorkspaceSettingModal';
import { files } from '@/mock/files';
import style from '@/pages/files/free-view.module.css';
import objectStyle from '@/style/common/object.module.css';
import { cn } from '@/util/cn';
import { getThemeStyle } from '@/util/getThemeStyle';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FreeView = () => {
    const navigate = useNavigate();
    const fileList = files;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const [pos, setPos] = useState<Array<{ pos: Vector2D; velocity: Vector2D }>>([
        ...fileList.map(() => {
            return {
                pos: { x: Math.round(Math.random() * maxWidth - 90), y: Math.round(Math.random() * maxHeight - 90) },
                velocity: { x: Math.round(Math.random() * 4 - 2), y: Math.round(Math.random() * 4 - 2) },
            };
        }),
    ]);

    useEffect(() => {
        const getNextPos = () => {
            const newPos = pos.map(({ pos, velocity }) => {
                //Math.max(Math.min(pos.x + velocity.x, 90), 10)
                return {
                    pos: {
                        x: pos.x + velocity.x,
                        y: pos.y + velocity.y,
                    },
                    velocity: velocity,
                };
            });
            setPos([...newPos]);
        };
        setInterval(getNextPos, 100);
    }, [pos]);

    return (
        <div className={style.fileContainer}>
            {fileList.map((file, index) => (
                <div
                    key={index}
                    className={cn(objectStyle.bubble, getThemeStyle(file.theme), style.bubble)}
                    style={{ left: `${pos[index].pos.x}px`, top: `${pos[index].pos.y}px` }}
                    onClick={() => navigate(`/workspace/${file.id}`)}
                >
                    <WorkspaceSettingModal className={style.fileName} workSpaceName={file.name} />
                </div>
            ))}
        </div>
    );
};
