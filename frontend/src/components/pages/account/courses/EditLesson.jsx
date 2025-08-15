import React, { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import { useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';

export const EditLesson = ({ placeholder }) => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({});
    const [chapters, setChapters] = useState();
    const params = useParams();

    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: placeholder || 'Start typings...'
    }),
        [placeholder]
    );

    const onSubmit = () => {

    }

    useEffect(() => {
        fetch(`${apiUrl}/chapters?course_id=${params.id}`, {
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
                                </div>
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>
                            <div className='col-lg-9'>
                                <div className='row'>
                                    {/* Course data */}
                                    <div className='col-md-7'>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className='card border shadow-lg'>
                                                <div className='card-body p-4'>
                                                    <h4 className='h5 border-bottom pb-3 mb-3'>Basic Information</h4>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Title</label>
                                                        <input type='text' className='form-control' placeholder='Title' />
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Chapter</label>
                                                        <select className='form-select'>
                                                            <option>Select Chapter</option>
                                                            {
                                                                chapters && chapters.map((e, index) => {
                                                                    return (
                                                                        <option key={index} value={e.id}>{e.title}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
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
                                                        <select className='form-select'>
                                                            <option value={1}>Active</option>
                                                            <option value={0}>Block</option>
                                                        </select>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <input type='checkbox' id='free' value={1} className='form-check-input' placeholder='Title' />
                                                        <label className='form-label ms-2' for="free">Free Lesson</label>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
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
