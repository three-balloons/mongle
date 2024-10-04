import Modal from '@/headless/modal/Modal';
import style from '@/components/tutorial/tutorial-modal.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as NextIcon } from '@/assets/icon/button-right.svg';
import { ReactComponent as PreviousIcon } from '@/assets/icon/button-left.svg';
import { useTutorial } from '@/components/tutorial/useTutorial';

type TutorialModalProps = {
    className?: string;
};

export const Tutorial = ({ className }: TutorialModalProps) => {
    const { isTuturialStart, isTuturialEnd, showNextTutorial, showCurrentTutorial, showPriviousTutorial } =
        useTutorial();
    // const [tutorialText, setTutorialText] = useState(showCurrentTutorial());
    return (
        <Modal className={cn(className)} initialOpen={true} disableClose={true}>
            <Modal.Overlay className={style.overlay} />
            <Modal.Content className={style.content}>
                {isTuturialStart ? (
                    <div className={style.icon} />
                ) : (
                    <PreviousIcon className={style.icon} onClick={() => showPriviousTutorial()} />
                )}
                <div className={style.description}>
                    <div className={style.descriptionText}>{showCurrentTutorial()}</div>
                    {isTuturialEnd && <Modal.Closer className={style.closer}>시작하기</Modal.Closer>}
                </div>
                {isTuturialEnd ? (
                    <div className={style.icon} />
                ) : (
                    <NextIcon className={style.icon} onClick={() => showNextTutorial()} />
                )}
            </Modal.Content>
        </Modal>
    );
};
