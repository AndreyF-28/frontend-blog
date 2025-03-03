import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from "../../axios.js";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const AddPost = () => {
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const inputImgRef = useRef(null);
    const { id } = useParams();
    const isEditable = Boolean(id)

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append("image", file);
            const { data } = await axios.post("/uploads", formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            alert("Ошибка при загрузке файла!");
        }
    };

    const onClickRemoveImage = () => {
        if (window.confirm("Вы действительно хотите удалить файл ?")) {
            setImageUrl("");
        }
    };

    const onChange = useCallback((value) => {
        setText(value);
    }, []);

    if (!window.localStorage.getItem("token") && !isAuth) {
        return <Navigate to="/" />;
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const fields = {
                title,
                text,
                tags,
                imageUrl,
            };
            const { data } = isEditable 
            ? await axios.patch(`/posts/${id}`, fields)
            : await axios.post(`/posts`, fields);

            const _id = isEditable ? id : data._id;
            navigate(`/posts/${_id}`);
        } catch (err) {
            console.log(err);
            alert("Ошибка при создании поста!");
        }
    };
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (id) {
            axios
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                    setTags(data.tags.join(","));
                    setImageUrl(data.imageUrl);
                })
                .catch((err) => {
                    console.warn(err);
                    alert("Ошибка при получении статьи!");
                });
        }
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const options = useMemo(
        () => ({
            spellChecker: false,
            maxHeight: "400px",
            autofocus: true,
            placeholder: "Введите текст...",
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    );

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                variant="outlined"
                size="large"
                onClick={() => inputImgRef.current.click()}
            >
                Загрузить превью
            </Button>
            <input
                ref={inputImgRef}
                type="file"
                onChange={handleChangeFile}
                hidden
            />
            {imageUrl && (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                    >
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`http://localhost:4444${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}
            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Тэги"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={text}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditable ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
