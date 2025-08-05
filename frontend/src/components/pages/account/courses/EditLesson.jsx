import React, { useEffect } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';

export const EditLesson = () => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({});

    const onSubmit = () => {

    }

    useEffect(() => {
        fetch(`${apiUrl}/courses/metaData`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(result => {
                
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
                                                    <h4 className='h5 border-bottom pb-3 mb-3'>Course Details</h4>


                                                    <div className='mb-3'>
                                                        <label className='form-label' >Title</label>
                                                        <input type='text' className='form-control' placeholder='Title' />
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
