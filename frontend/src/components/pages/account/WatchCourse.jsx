import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { apiUrl, token } from '../../common/Config';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../common/Loading';

const WatchCourse = () => {
    const [course, setCourse] = useState();
    const [loading, setLoading] = useState(true);
    const params = useParams();

    const fetchCourse = async () => {
        setLoading(true);
        await fetch(`${apiUrl}/enroll/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    setCourse(result.data);
                    setLoading(false);
                } else {
                    console.error('Error deleting course:', result.message);
                }
            })

    }

    useEffect(() => {
        fetchCourse();
    }, []);

    return (
        <>
            <Layout>
                {
                    loading && loading == true && <Loading />
                }
                {
                    course && loading == false &&

                    <section className='section-5 my-5'>
                        <div className='container'>
                            <div className='row'>

                                <div className='col-md-8'>
                                    <div className='video'>
                                        <video width="100%" height="500" controls>
                                            <source src="movie.mp4" type="video/mp4" />
                                            <source src="movie.ogg" type="video/ogg" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    <div className='meta-content'>
                                        <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                                            <h3 className='pt-2'>Introduction</h3>
                                            <div>
                                                <a href="" className='btn btn-primary px-3'>
                                                    Mark as complete <IoMdCheckmarkCircleOutline size={20} />
                                                </a>
                                            </div>
                                        </div>
                                        <div>
                                            <p>In this chapter we will learn about html basics</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='card rounded-0'>
                                        <div className='card-body'>
                                            <div className='h6'>
                                                <strong>{course.title}</strong>
                                            </div>
                                            <div className='py-2'>
                                                <ProgressBar now={0} />
                                                <div className='pt-2'>
                                                    0% complete
                                                </div>
                                            </div>

                                            <Accordion defaultActiveKey="0" flush>
                                                {
                                                    course && course.chapters.map((chapter, index) => {
                                                        return (
                                                            <Accordion.Item eventKey={index} key={index}>
                                                                <Accordion.Header>{chapter.title}</Accordion.Header>
                                                                <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                                    <ul className='lessons mb-0'>
                                                                        {
                                                                            chapter.lessons && chapter.lessons.map((lesson, idx) => {
                                                                                return (
                                                                                    <li key={idx} className='pb-2'>
                                                                                        <Link href="">
                                                                                            <MdSlowMotionVideo size={20} /> {lesson.title}
                                                                                        </Link>
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ul>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        )
                                                    })
                                                }

                                            </Accordion>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                }
            </Layout>
        </>
    )
}

export default WatchCourse