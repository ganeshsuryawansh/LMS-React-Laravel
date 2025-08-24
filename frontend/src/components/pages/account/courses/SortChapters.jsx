import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from 'react';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

const SortChapters = ({ showChapterSortModel, handleCloseChapterSortModel, course, setChapters, chapters }) => {

    const [chapterData, setChapterData] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chapterData);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setChapterData(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (UpdateChapter) => {
        console.log(UpdateChapter)
        await fetch(`${apiUrl}/sort-chapters`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ chapters: UpdateChapter })
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setChapters({ type: "SET_CHAPTERS", payload: result.chapters });
                    toast.success(result.message);
                } else {
                    console.log('Something Went wrong!');
                }
            });
    }

    useEffect(() => {
        if (chapters) {
            setChapterData(chapters);
        }
    }, [chapters]);

    return (
        <>
            <Modal show={showChapterSortModel} onHide={handleCloseChapterSortModel}>
                <Modal.Header closeButton>
                    <Modal.Title>Sort Chapters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        chapterData && chapterData.map((item, index) => (
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

export default SortChapters