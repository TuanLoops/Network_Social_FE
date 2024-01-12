import { useState } from "react";
import "./newPost.scss";
import TextareaAutosize from "react-textarea-autosize";
import PostButton from "./postbutton/PostButton";
import PreviewImg from "../previewimg/PreviewImg";
import { getImageURL, uploadImage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addStatus, showStatus } from "../../redux/service/statusService.jsx";
import { useSelector } from "react-redux";

function NewPost() {
  const dispatch = useDispatch();
  const currentUser = useSelector(({ user }) => user.currentUser);
  const [body, setBody] = useState("");
  const [imageList, setImageList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const images = [];
    for (const file of e.target.files) {
      if (file.type.includes("image")) {
        const randomName = uuidv4();
        setIsUploading(true);
        await uploadImage(randomName, file);
        const imageURL = await getImageURL(randomName);
        images.push({ imageLink: imageURL });
        setIsUploading(false);
      }
    }
    setImageList([...imageList, ...images]);
  };

  const handlePaste = async (e) => {
    const images = [];
    let items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const blob = item.getAsFile();
        const randomName = uuidv4();
        setIsUploading(true);
        await uploadImage(randomName, blob);
        const imageURL = await getImageURL(randomName);
        images.push({ imageLink: imageURL });
        setIsUploading(false);
      }
    }
    setImageList([...imageList, ...images]);
  };

  const handleFileRemove = (index) => {
    setImageList(([...imageList]) => {
      imageList.splice(index, 1);
      return imageList;
    });
  };

  const handlePost = async () => {
    await dispatch(addStatus({ body, imageList })).unwrap();
    await dispatch(showStatus()).unwrap();
    setBody("");
    setImageList([]);
  };

  return (
    <div className="new-post">
      <div className="wrapper">
        <div className="title">
          <h4>Make a new post</h4>
        </div>
        <div className="first-row">
          <div className={`avatar-container ${body ? "hide" : ""}`}>
            <img src={currentUser?.avatarImage} alt="" />
          </div>
          <div className={`text-box ${body ? "stretch" : ""}`}>
            <TextareaAutosize
              className="write-new-post"
              placeholder={`What's on your mind`}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
              onPaste={handlePaste}
            />
          </div>
        </div>
        <PreviewImg imageList={imageList} remove={handleFileRemove} />
        <div className="second-row">
          <div className="item">
            <span>Live video</span>
            <img
              draggable="false"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png"
             alt=""/>
          </div>

          <label htmlFor="file" className="item">
            <span>Pick photo</span>
            <img
              draggable="false"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png"
             alt=""/>
            <input
              accept="image/*"
              id="file"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </label>
          <PostButton
            className="item"
            onClick={handlePost}
            loading={isUploading}
            disabled={!body}
          />
        </div>
      </div>
    </div>
  );
}

export default NewPost;
