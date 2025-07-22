import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

const UpdateRequirment = ({ showRequirment, requirments, setRequirments, requirmentData, handleClose }) => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        await fetch(`${apiUrl}/requirments/${requirmentData.id}`, {
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

                    console.log(result)

                    const updatedRequirments = requirments.map(requirments => requirments.id == result.data.id ? { ...requirments, text: result.data.text } : requirments)
                    setRequirments(updatedRequirments);

                    toast.success(result.message);
                } else {
                    const errors = result.errors;
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field[0]] })
                    })
                }
            });
    }

    useEffect(() => {
        if (requirmentData) {
            reset({
                requirment: requirmentData.text
            });
        }
    }, [requirmentData]);

    return (
        <>
            <Modal show={showRequirment} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Requirment!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label>Requirment</label>
                            <input
                                {
                                ...register('requirment', {
                                    required: 'The requirment feild is required!'
                                })
                                }
                                type='text'
                                className={`form-control ${errors.requirment && 'is-invalid'} `}
                                placeholder='Requirment'
                            />
                            {errors.requirment && <p className='invalid-feedback'>{errors.requirment.message}</p>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-primary' disabled={loading} >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default UpdateRequirment