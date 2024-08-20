import { FC } from "react";
import "./NavigatorSignin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
type NavigatorSigninProps = {
  children?: React.ReactNode;
  onSigninAgainClick?: () => void;
  onSigninMemberClick?: () => void;
};

const NavigatorSignin: FC<NavigatorSigninProps> = ({
  onSigninAgainClick,
  onSigninMemberClick,
}) => {
  return (
    <div className="flex flex-row justify-center bg-primary">
      <div className="flex w-screen max-w-screen-lg flex-col justify-between overflow-clip px-6 md:flex-row">
        <div className="bt-box overflow-hidden">
          <button
            onClick={onSigninAgainClick}
            className="bt-signin-ag truncate whitespace-nowrap hover:text-success"
          >
            <FontAwesomeIcon className="me-2" icon={faUnlockKeyhole} />
            เข้าสู่ระบบสำหรับเจ้าหน้าที่
          </button>
        </div>
        <div className="bt-box">
          <button
            onClick={onSigninMemberClick}
            className="bt-signin-member overflow-clip truncate whitespace-nowrap hover:text-success"
          >
            <FontAwesomeIcon className="me-2" icon={faUnlockKeyhole} />
            เข้าสู่ระบบ / ลงทะเบียนสำหรับผู้รับบริการ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigatorSignin;
