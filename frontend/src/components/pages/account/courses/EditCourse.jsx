import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { apiUrl, token } from '../../../common/Config'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ManageOutcome from './ManageOutcome'
import ManageRequirment from './ManageRequirment'

const EditCourse = () => {

    const params = useParams();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
        defaultValues: async () => {
            await fetch(`${apiUrl}/courses/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        reset({
                            title: result.data.title,
                            category: result.data.category_id,
                            level: result.data.level_id,
                            language: result.data.language_id,
                            sell_price: result.data.price,
                            cross_price: result.data.cross_price,
                            description: result.data.description,
                        })
                    } else {
                        console.log("Something Went Wrong");
                    }
                });
        }
    });

    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);

    const onSubmit = async (data) => {
        setLoading(true);
        await fetch(`${apiUrl}/courses/${params.id}`, {
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
                    const errors = result.errors;
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field[0]] })
                    })
                }
            });
    }

    const courseMetaData = async () => {
        await fetch(`${apiUrl}/courses/metaData`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setCategories(result.category);
                    setLanguages(result.language);
                    setLevels(result.levels);
                } else {
                    console.log("Something Went Wrong");
                }
            });
    }

    useEffect(() => {
        courseMetaData();
    }, [])

    return (

        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
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
                                                    <label className='form-label' htmlFor='Title'>Title</label>
                                                    <input type='text'
                                                        {
                                                        ...register('title', {
                                                            required: "The title feild is required."
                                                        })
                                                        }
                                                        className={`form-control ${errors.title && "is-invalid"} `}
                                                        placeholder='Title' />
                                                    {
                                                        errors.title && <p className='invalid-feedback' >{errors.title.message}</p>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor='Category'>Category</label>
                                                    <select
                                                        id='category'
                                                        className={`form-select ${errors.category && "is-invalid"} `}
                                                        {...register('category', { required: 'Category is required' })}
                                                    >
                                                        <option value="">Select a Category</option>
                                                        {
                                                            categories && categories.map(cate => (
                                                                <option key={cate.id} value={cate.id}>{cate.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {errors.category && <p className='invalid-feedback'>{errors.category.message}</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor='Level'>Level</label>
                                                    <select
                                                        className={`form-select ${errors.level && "is-invalid"} `}
                                                        {...register('level', { required: 'Level is required' })}

                                                        id='level'>
                                                        <option value="">Select a Level</option>
                                                        {
                                                            levels && levels.map(level => (
                                                                <option key={level.id} value={level.id}>{level.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {errors.level && <p className='invalid-feedback'>{errors.level.message}</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor='Language'>Language</label>
                                                    <select
                                                        className={`form-select ${errors.language && "is-invalid"} `}
                                                        {...register('language', { required: 'Language is required' })}

                                                        id='language'>
                                                        <option value="">Select a Language</option>
                                                        {
                                                            languages && languages.map(lang => (
                                                                <option key={lang.id} value={lang.id}>{lang.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {errors.language && <p className='invalid-feedback'>{errors.language.message}</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor='description'>Description</label>
                                                    <textarea
                                                        className={`form-control ${errors.description && "is-invalid"} `}
                                                        {...register('description')}
                                                        rows={5}
                                                        id='description'
                                                        placeholder='Description'>
                                                    </textarea>
                                                    {errors.description && <p className='invalid-feedback'>{errors.description.message}</p>}
                                                </div>

                                                <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor='sell-price'>Sell Price</label>
                                                    <input type='text'
                                                        {
                                                        ...register('sell_price', {
                                                            required: "The Sell Price feild is required."
                                                        })
                                                        }
                                                        className={`form-control ${errors.sell_price && "is-invalid"} `}
                                                        placeholder='Sell Price'
                                                        id='sell-price' />
                                                    {
                                                        errors.sell_price && <p className='invalid-feedback' >{errors.sell_price.message}</p>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor='cross-price'>Cross Price</label>
                                                    <input type='text'
                                                        {
                                                        ...register('cross_price')
                                                        }
                                                        className={`form-control ${errors.cross_price && "is-invalid"} `}
                                                        placeholder='Cross Price'
                                                        id='cross-price' />
                                                    {
                                                        errors.cross_price && <p className='invalid-feedback' >{errors.cross_price.message}</p>
                                                    }
                                                </div>

                                                <button className='btn btn-primary' disabled={loading} >
                                                    {loading == false ? 'Update' : 'Please wait...'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Outcomes */}
                                <div className='col-md-5'>
                                    <ManageOutcome />
                                    <ManageRequirment />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default EditCourse