import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import { MdDeleteForever, MdDragIndicator } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import UpdateRequirment from './UpdateRequirment';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageRequirment = () => {
    const [loading, setLoading] = useState(false);
    const [requirments, setRequirments] = useState([]);
    const [requirmentData, setrequirmentData] = useState();
    const params = useParams();
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

    // Modal States.
    const [showRequirment, setShowRequirment] = useState(false);
    const handleClose = () => setShowRequirment(false);
    const handleShow = (requirment) => {
        setShowRequirment(true);
        setrequirmentData(requirment);
    }

    const onSubmit = async (data) => {
        const formData = { ...data, course_id: params.id }

        setLoading(true);
        await fetch(`${apiUrl}/requirments`, {
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
                    const newRequirments = [...requirments, result.data];
                    setRequirments(newRequirments);
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

    const fetchRequirments = async () => {
        setLoading(true);
        await fetch(`${apiUrl}/requirments?course_id=${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setLoading(false);
                    setRequirments(result.data);
                } else {
                    const errors = result.errors;
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field[0]] })
                    })
                }
            });
    }

    useEffect(() => {
        fetchRequirments();
    }, []);

    const deleteRequirment = async (id) => {
        if (confirm("Are You sure you want to delete?")) {
            await fetch(`${apiUrl}/requirments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        const newRequirments = requirments.filter(requirment => requirment.id != id);
                        setRequirments(newRequirments);
                        toast.success(result.message);
                    } else {
                        const errors = result.errors;
                        Object.keys(errors).forEach(field => {
                            setError(field, { message: errors[field[0]] })
                        })
                    }
                });
        }
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(requirments);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setRequirments(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updatedRequirments) => {
        await fetch(`${apiUrl}/sort-requirments`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ requirments: updatedRequirments })
        }).then(res => res.json())
            .then(result => {
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

    return (
        <>
            <div className='card shadow-lg border-0 my-3' >
                <div className='card-body p-4'>
                    <div className='d-flex' >
                        <h4 className='h5 mb-3'>Requirment</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3' >
                            <input
                                {
                                ...register("requirment", {
                                    required: "The requirment feild id required!."
                                })
                                }
                                type='text'
                                className={`form-control ${errors.requirment && 'is-invalid'} `}
                                placeholder='Requirment'
                            />
                            {errors.requirment && <p className='invalid-feedback' >{errors.requirment.message}</p>}
                        </div>

                        <button className='btn btn-primary' disabled={loading} >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>


                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        requirments && requirments.map((requirment, index) => (
                                            <Draggable key={requirment.id} draggableId={`${requirment.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border bg-white shadow-lg rounded">
                                                        <div className='card-body p-2 d-flex'>
                                                            <div>
                                                                <MdDragIndicator />
                                                            </div>
                                                            <div className='d-flex justify-content-between w-100'>
                                                                <div className='ps-2'>
                                                                    {requirment.text}
                                                                </div>
                                                                <div className='d-flex'>
                                                                    <a onClick={() => handleShow(requirment)} className='text-primary me-1'>
                                                                        <FaEdit />
                                                                    </a>

                                                                    <a onClick={() => deleteRequirment(requirment.id)} className='text-danger'>
                                                                        <MdDeleteForever />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>
            </div>
            <UpdateRequirment
                showRequirment={showRequirment}
                requirments={requirments}
                setRequirments={setRequirments}
                requirmentData={requirmentData}
                handleClose={handleClose}
            />
        </>
    )
}

export default ManageRequirment