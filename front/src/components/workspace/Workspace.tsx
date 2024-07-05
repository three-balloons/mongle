import './workspace.css';
import { useCanvas } from '../../hooks/useCanvas';

type WorkspaceProps = { width: number; height: number };

export const Workspace = ({ width, height }: WorkspaceProps) => {
  const canvasController = useCanvas();

  return (
    <>
      <canvas ref={canvasController.canvasRef} className="workspaceContent" width={width} height={height}></canvas>
    </>
  );
};
