import React, { useEffect, useState } from 'react'
import { apiUrl } from '../common/Config';
import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        fetch(`${apiUrl}/fetch-categories`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setCategories(result.data);
                    // console.log(result);
                } else {
                    console.log("Something Went Wrong!")
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchCategories()
    }, []);

    return (
        <section className='section-2'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Explore Categories</h2>
                    <p>Discover categories designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className='row gy-3'>
                    {
                        categories && categories.map((cat) => {
                            return (
                                <div key={cat.id} className='col-6 col-md-6 col-lg-3' >
                                    <div className='card shadow border-0'>
                                        <div className='card-body'><Link >{cat.name}</Link></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories;