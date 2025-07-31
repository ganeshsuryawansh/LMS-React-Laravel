import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';


const UpdateChapter = ({ chapterData, showChapter, handleClose, setChapters }) => {

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        await fetch(`${apiUrl}/chapters/${chapterData.id}`, {
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
                    setChapters({ type: "UPDATE_CHAPTER", payload: result.data })
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
        if (chapterData) {
            reset({
                chapter: chapterData.title
            })
        }
    }, [chapterData])

    return (
        <>
            <Modal show={showChapter} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Chapter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <input
                                {
                                ...register('chapter', {
                                    required: 'The chapter feild is required!'
                                })
                                }
                                type='text'
                                className={`form-control ${errors.chapter && 'is-invalid'} `}
                                placeholder='Chapter'
                            />
                            {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
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

export default UpdateChapter