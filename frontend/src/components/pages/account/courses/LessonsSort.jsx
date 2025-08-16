import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from 'react';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';


const LessonsSort = ({ showLessonSortModel, handleCloseLessonSortModel, lessonsData }) => {

    const [lessons, setLessons] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(lessons);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setLessons(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateLessons) => {
        await fetch(`${apiUrl}/sort-lessons`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ lessons: updateLessons })
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    toast.success(result.message);
                } else {
                    console.log('Something Went wrong!');
                }
            });
    }

    useEffect(() => {
        if (lessonsData) {
            setLessons(lessonsData)
        }
    }, [lessonsData]);


    return (
        <>
            <Modal show={showLessonSortModel} onHide={handleCloseLessonSortModel}>
                <Modal.Header closeButton>
                    <Modal.Title>Sort Lessons</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        lessonsData && lessonsData.map((item, index) => (
                                            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LessonsSort