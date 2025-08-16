import React, { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import { Link, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';
import LessonVideo from './LessonVideo';

export const EditLesson = ({ placeholder }) => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({});
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [lesson, setLessons] = useState([]);

    const params = useParams();
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [checked, setChecked] = useState();

    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: placeholder || 'Start typings...'
    }),
        [placeholder]
    );

    const onSubmit = (data) => {
        setLoading(true);
        data.description = content;

        fetch(`${apiUrl}/lessons/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status == 200) {
                    toast.success(result.message);
                } else {
                    console.log("Something Went wrong!");
                }
            });
    }

    useEffect(() => {
        fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setChapters(result.data);
                } else {
                    console.log("Something Went wrong!");
                }
            });



        fetch(`${apiUrl}/lessons/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setLessons(result.data);
                    reset({
                        lesson: result.data.title,
                        chapter_id: result.data.chapter_id,
                        status: result.data.status,
                        duration: result.data.duration
                    })
                    setContent(result.data.description);
                    setChecked(result.data.is_free_preview == 'yes' ? true : false);
                } else {
                    console.log("Something Went wrong!");
                }
            });
    }, []);

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>Edit Lesson</h2>
                                    <Link className='btn btn-primary' to={`/account/courses/edit/${params.courseId}`}>Back</Link>
                                </div>
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>
                            <div className='col-lg-9'>
                                <div className='row'>
                                    {/* Course data */}
                                    <div className='col-md-8'>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className='card border shadow-lg'>
                                                <div className='card-body p-4'>
                                                    <h4 className='h5 border-bottom pb-3 mb-3'>Basic Information</h4>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Title</label>
                                                        <input
                                                            {
                                                            ...register('lesson', {
                                                                required: "The lesson feild id required!"
                                                            })
                                                            }
                                                            className={`form-control ${errors.lesson && 'is-invalid'}`}
                                                            type='text'
                                                            placeholder='Title' />
                                                        {
                                                            errors.lesson && <p className='invalid-feedback' >{errors.lesson.message}</p>
                                                        }
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Chapter</label>
                                                        <select
                                                            {
                                                            ...register('chapter_id', {
                                                                required: "The chapter feild id required!"
                                                            })
                                                            }
                                                            className={`form-select ${errors.lesson && 'is-invalid'}`}
                                                        >
                                                            <option>Select Chapter</option>
                                                            {
                                                                chapters && chapters.map((e, index) => {
                                                                    return (
                                                                        <option key={index} value={e.id}>{e.title}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        {
                                                            errors.chapter_id && <p className='invalid-feedback' >{errors.chapter_id.message}</p>
                                                        }
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Duration(Mins)</label>
                                                        <input
                                                            {
                                                            ...register('duration', {
                                                                required: "The duration feild id required!"
                                                            })
                                                            }
                                                            type='number'
                                                            className={`form-control ${errors.lesson && 'is-invalid'}`}
                                                        />
                                                        {
                                                            errors.duration && <p className='invalid-feedback' >{errors.duration.message}</p>
                                                        }
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Description</label>
                                                        <JoditEditor
                                                            ref={editor}
                                                            value={content}
                                                            config={config}
                                                            tabIndex={1} // tabIndex of textarea
                                                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                                            onChange={newContent => { }}
                                                        />
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Status</label>
                                                        <select
                                                            {
                                                            ...register('status', {
                                                                required: "The status feild id required!"
                                                            })
                                                            }
                                                            className='form-select'>
                                                            <option value={1}>Active</option>
                                                            <option value={0}>Block</option>
                                                        </select>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <input
                                                            {
                                                            ...register('free_preview')
                                                            }
                                                            checked={checked}
                                                            onChange={(e) => setChecked(e.target.checked)}
                                                            type='checkbox' id='free' className='form-check-input' placeholder='Title' />
                                                        <label className='form-label ms-2' htmlFor="free">Free Lesson</label>
                                                    </div>

                                                    <button className='btn btn-primary mt-2'>Update</button>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                    <div className='col-md-4'>
                                        <LessonVideo lesson={lesson} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}
