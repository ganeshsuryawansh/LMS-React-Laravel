import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { apiUrl } from '../common/Config';
import Course from './Course'

const FeaturedCourses = () => {

    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        fetch(`${apiUrl}/featured-courses`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setCourses(result.data);
                    // console.log(result);
                } else {
                    console.log("Something Went Wrong!")
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <section className='section-3 my-5'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Featured Courses</h2>
                    <p>Discover courses designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className="row gy-4">

                    {
                        courses && courses.map((course) => {
                            return (
                                <Course
                                    key={course.id}
                                    course={course}
                                    customClasses="col-lg-3 col-md-6"
                                />
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses