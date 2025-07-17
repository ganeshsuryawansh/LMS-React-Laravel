import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdDragIndicator } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


const ManageOutcome = () => {

    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const params = useParams();
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

    const onSubmit = async (data) => {
        const formData = { ...data, course_id: params.id }

        setLoading(true);
        await fetch(`${apiUrl}/outcomes`, {
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

    const fetchOutcomes = async () => {
        setLoading(true);
        await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(res => res.json())
            .then(result => {
                console.log(result);

                if (result.status == 200) {
                    setLoading(false);
                    setOutcomes(result.data);
                } else {
                    const errors = result.errors;
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field[0]] })
                    })
                }

            });
    }

    useEffect(() => {
        fetchOutcomes();
    }, [])

    return (
        <div className='card shadow-lg border-0' >
            <div className='card-body p-4'>
                <div className='d-flex' >
                    <h4 className='h5 mb-3' >Outcome</h4>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-3' >
                        <input
                            {
                            ...register("outcome", {
                                required: "The outcome feild id required!."
                            })
                            }
                            type='text'
                            className={`form-control ${errors.outcome && 'is-invalid'} `}
                            placeholder='Outcome'
                        />
                        {errors.outcome && <p className='invalid-feedback' >{errors.outcome.message}</p>}
                    </div>

                    <button className='btn btn-primary' disabled={loading} >
                        {loading == false ? 'Save' : 'Please wait...'}
                    </button>
                </form>


                {
                    outcomes && outcomes.map(outcome => {
                        return (
                            <div key={outcome.id} className='card my-3' >
                                <div className='card-body p-2 d-flex' >
                                    <div>
                                        <MdDragIndicator />
                                    </div>
                                    <div className='d-flex justify-content-between w-100' >
                                        <div className='ps-2' >
                                            dummy text
                                        </div>
                                        <div className='d-flex' >

                                            <a className='text-primary me-1' >
                                                <FaEdit />
                                            </a>
                                            <a className='text-danger' >
                                                <MdDeleteForever />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }


            </div>
        </div>
    )
}

export default ManageOutcome