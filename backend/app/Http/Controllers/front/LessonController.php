<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class LessonController extends Controller
{
    // This method will save lesson.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter_id' => 'required',
            'lesson' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson Added Successfully!'
        ], 200);
    }

    // This method will Update lesson.
    public function update($id, Request $request)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'errors' => 'Lesson Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter_id' => 'required',
            'lesson' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->is_free_preview = ($request->free_preview == false) ? 'no' : 'yes';
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson Updated Successfully!'
        ], 200);
    }

    // This method will delete lesson.
    public function destroy($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 401,
                'message' => 'Lesson not found!'
            ], 401);
        }

        $lesson->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson Delete Successfully.!'
        ], 200);
    }
}
