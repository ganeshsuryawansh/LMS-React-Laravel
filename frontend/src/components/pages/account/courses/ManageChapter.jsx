import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import Accordion from 'react-bootstrap/Accordion';
import UpdateChapter from './UpdateChapter';
import CreateLesson from './CreateLesson';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';


const ManageChapter = ({ course, params }) => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [loading, setLoading] = useState(false);
    const [chapterData, setChapterData] = useState();

    // Update Chapter Model.
    const [showChapter, setShowChapter] = useState(false);
    const handleClose = () => setShowChapter(false);
    const handleShow = (chapter) => {
        setShowChapter(true);
        setChapterData(chapter);
    }

    // Create Lesson Model.
    const [showLessonModel, setShowLessonModel] = useState(false);
    const handleCloseLessonModel = () => setShowLessonModel(false);

    const handleShowLessonModel = (chapter) => {
        setShowLessonModel(true);
    }

    const chapterReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;
            case "ADD_CHAPTER":
                return [...state, action.payload]
            case "UPDATE_CHAPTER":
                return state.map(chapter => {
                    if (chapter.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return chapter;
                    }
                })
            case "DELETE_CHAPTER":
                return state.filter(chapter => chapter.id != action.payload)
            default:
                return state;
        }
    }

    const [chapters, setChapters] = useReducer(chapterReducer, []);

    const onSubmit = async (data) => {
        const formData = { ...data, course_id: params.id }

        setLoading(true);
        await fetch(`${apiUrl}/chapters`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        }).then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status == 200) {
                    setChapters({ type: "ADD_CHAPTER", payload: result.data })

                    toast.success(result.message);
                    reset();
                } else {
                    const errors = result.errors;
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field[0]] })
                    })
                }
            });
    }

    const deleteChapter = async (id) => {

        if (confirm("Are you sure you want to delete!")) {
            await fetch(`${apiUrl}/chapters/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        setChapters({ type: "DELETE_CHAPTER", payload: id })
                        toast.success(result.message);
                        reset();
                    } else {
                        const errors = result.errors;
                        Object.keys(errors).forEach(field => {
                            setError(field, { message: errors[field[0]] })
                        })
                    }
                });
        }
    }

    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: "SET_CHAPTERS", payload: course.chapters })
        }
    }, [course]);

    return (
        <>
            <div className='card shadow-lg border-0 mt-4'>
                <div className='card-body p-4'>
                    <div className='d-flex'>
                        <div className='d-flex justify-content-between w-100'>
                            <h4 className='h5 mb-3'>Chapters</h4>

                            <Link onClick={() => handleShowLessonModel()} ><FaPlus size={12} /><strong>Add Lesson</strong></Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input
                                {
                                ...register("chapter", {
                                    required: "The chapter feild id required!."
                                })
                                }
                                type='text'
                                className={`form-control ${errors.chapter && 'is-invalid'} `}
                                placeholder='Chapter'
                            />
                            {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
                        </div>

                        <button className='btn btn-primary mb-4' disabled={loading} >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>

                    <Accordion defaultActiveKey="0">

                        {
                            chapters.map((chapter, index) => {
                                return (
                                    <Accordion.Item eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='d-flex'>
                                                <button onClick={() => deleteChapter(chapter.id)} className='btn btn-danger btn-sm ms-2'>Delete Chapter</button>
                                                <button onClick={() => handleShow(chapter)} className='btn btn-primary btn-sm ms-2'>Update Chapter</button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>
                </div>
            </div>

            <UpdateChapter
                chapterData={chapterData}
                showChapter={showChapter}
                handleClose={handleClose}
                setChapters={setChapters}
            />

            <CreateLesson
                showLessonModel={showLessonModel}
                handleCloseLessonModel={handleCloseLessonModel}
                course={course}
            />
        </>
    )
}

export default ManageChapter;