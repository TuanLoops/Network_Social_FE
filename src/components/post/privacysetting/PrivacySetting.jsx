import "./privacySetting.scss";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LockIcon from "@mui/icons-material/Lock";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { useRef, useState } from "react";

function PrivacySetting({ onClose, defaultChecked, postId }) {
  const [checked, setChecked] = useState(defaultChecked);
  const modalRef = useRef(null);
  const handleClose = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handleSave = () => {
    //TODO: save edit
  };

  return (
    <div className="privacy-modal" ref={modalRef} onClick={handleClose}>
      <div className="privacy-container">
        <div className="privacy-wrapper">
          <div className="modal-header">
            <span>Privacy setting</span>
          </div>
          <div className="modal-body">
            <div className="item" onClick={() => setChecked("PUBLIC")}>
              <div className="icon">
                <PublicOutlinedIcon />
              </div>
              <div className="text">
                <div className="title">Public</div>
                <div className="description">Everybody can see yor post</div>
              </div>
              <input
                onChange={() => setChecked("PUBLIC")}
                type="radio"
                checked={checked === "PUBLIC"}
              />
            </div>
            <div className="item" onClick={() => setChecked("FRIENDS")}>
              <div className="icon">
                <PeopleAltIcon />
              </div>
              <div className="text">
                <div className="title">Friends</div>
                <div className="description">
                  Your friends can see your post
                </div>
              </div>
              <input
                onChange={() => setChecked("FRIENDS")}
                type="radio"
                checked={checked === "FRIENDS"}
              />
            </div>
            <div className="item" onClick={() => setChecked("PRIVATE")}>
              <div className="icon">
                <LockIcon />
              </div>
              <div className="text">
                <div className="title">Only me</div>
                <div className="description">
                  No one can see your post but you
                </div>
              </div>
              <input
                onChange={() => setChecked("PRIVATE")}
                type="radio"
                checked={checked === "PRIVATE"}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel" onClick={() => onClose()}>
              <div>Cancel</div>
            </button>
            <button className="save" onClick={handleSave}>
              <div>Save</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PrivacySetting;