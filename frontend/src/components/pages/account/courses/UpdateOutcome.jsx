import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

const UpdateOutcome = ({ outcomeData, setOutcomes, outcomes, handleClose, showOutcome }) => {

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
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
                    const updatedOutcomes = outcomes.map(outcome => outcome.id == result.data.id ? { ...outcome, text: result.data.text } : outcome)
                    setOutcomes(updatedOutcomes);

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
        if (outcomeData) {
            reset({
                outcome: outcomeData.text
            });
        }
    }, [outcomeData]);

    return (
        <>
            <Modal show={showOutcome} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Outcome</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label>Title</label>
                            <input
                                {
                                ...register('outcome', {
                                    required: 'The Outcome feild is required!'
                                })
                                }
                                type='text'
                                className={`form-control ${errors.outcome && 'is-invalid'} `}
                                placeholder='Outcome'
                            />
                            {errors.outcome && <p className='invalid-feedback'>{errors.outcome.message}</p>}
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

export default UpdateOutcome;