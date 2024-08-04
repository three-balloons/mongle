import style from '@/pages/home/profile/profile.module.css';

export const Profile = () => {
    const mock = {
        name: '나야나',
        email: 'example@example.com',
        provider: '카카오',
    };
    return (
        <div className={style.default}>
            <h1>프로필 설정</h1>
            <div className={style.profileContainer}>
                <div className={style.profile}>
                    <div>사용자명</div>
                    <div>{mock.name}</div>
                </div>
                <div className={style.profile}>
                    <div>이메일</div>
                    <div>{mock.email}</div>
                </div>
                <div className={style.profile}>
                    <div>로그인 방식</div>
                    <div>{mock.provider}</div>
                </div>
                <div className={style.line} />
                <div className={style.profile}>
                    <div>로그아웃</div>
                </div>
                <div className={style.withdraw}>계정삭제</div>
            </div>
        </div>
    );
};
