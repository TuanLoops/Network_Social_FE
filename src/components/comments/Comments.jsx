import "./comments.scss";
import Comment from "../comment/Comment";
import { useSelector } from "react-redux";
import { TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { v4 as uuidv4 } from "uuid";
import { getImageURL, uploadImage } from "../../firebase";
import PreviewImg from "../previewimg/PreviewImg";
import CircularProgress from "@mui/material/CircularProgress";
import {createComment, getAllComments} from "../../redux/service/commentService.jsx";

const Comments = ({ postId }) => {
  const currentUser = useSelector(({ user }) => user.currentUser);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [imageList, setImageList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputId = uuidv4();

  useEffect(() => {
    // Get comments from API
    // setComments(commentsFromAPI)
    const fetch = async () => {
      let data= await getAllComments(postId)
      setComments(data)
    }
    fetch()
  }, []);

  const handleComment = () => {
    if (body) {
      const comment= {
        body: body,
        image: imageList[0]
      }
      try {
      const comment1 =  createComment(postId,comment)
          comments.push(comment1)
          setComments(comments)
      }catch (e) {
        console.log(e)
      }

    }
  };

  const handleFileChange = async (e) => {
    for (const file of e.target.files) {
      if (file.type.includes("image")) {
        setIsUploading(true);
        const randomName = uuidv4();
        await uploadImage(randomName, file);
        const imageURL = await getImageURL(randomName);
        setImageList([{ imageLink: imageURL }]);
        setIsUploading(false);
      }
    }
  };

  const handleFileRemove = () => {
    setImageList([]);
  };

  return (
    <div className="comments">
      <hr />
      <div className="write">
        <div className="avatar">
          <img src={currentUser.avatarImage} alt="" />
        </div>
        <div className="write-comment-container">
          <div className="write-comment-wrapper">
            <TextareaAutosize
              spellCheck="false"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="input-field"
              placeholder="Write a comment..."
            />
            <label htmlFor={fileInputId} className="attach-image">
              <ImageIcon />
              <input id={fileInputId} type="file" onChange={handleFileChange} />
            </label>
          </div>
          <PreviewImg imageList={imageList} remove={handleFileRemove} />
        </div>
        <div className="button-wrapper">
          <button
            disabled={!body.length || isUploading}
            onClick={handleComment}
          >
            {isUploading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
