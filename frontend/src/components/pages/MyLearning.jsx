import React, { useEffect, useState } from 'react'
import UserSidebar from '../common/UserSidebar'
import CourseEnrolled from '../common/CourseEnrolled'
import Layout from '../common/Layout'
import { apiUrl, token } from '../common/Config'
import toast from 'react-hot-toast'
import Loading from '../common/Loading'

const MyLearning = () => {

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrollments = async () => {
        setLoading(true);
        await fetch(`${apiUrl}/enrollments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    setEnrollments(result.data);
                    setLoading(false);
                } else {
                    console.error('Error deleting course:', result.message);
                }
            })

    }

    useEffect(() => {
        fetchEnrollments();
    }, []);

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container'>
                        <div className='row'>
                            <div className='d-flex justify-content-between  mt-5 mb-3'>
                                <h2 className='h4 mb-0 pb-0'>My Learning</h2>
                                {/* <a href="#" className='btn btn-primary'>Create</a> */}
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>
                            <div className='col-lg-9'>

                                {
                                    loading && loading == true && <Loading />
                                }

                                {
                                    loading == false && <div className='row gy-4'>
                                        {
                                            enrollments && enrollments.map((enrollment, index) => {
                                                return (
                                                    <CourseEnrolled
                                                        enrollment={enrollment}
                                                        key={index}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}

export default MyLearning