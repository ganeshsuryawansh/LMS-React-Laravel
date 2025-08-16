<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
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

    // This method will fetch lesson data.
    public function show($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson Not Found!'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson
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
            'lesson' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
                'res' => $request->all()
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

        $chapterId = $lesson->chapter_id;
        $lesson->delete();

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapter,
            'message' => 'Lesson Delete Successfully.!'
        ], 200);
    }

    // This function uploads lesson video.
    public function saveVideo($id, Request $request)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson Not Found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'video' => 'required|mimes:mp4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => $validator->errors()
            ], 400);
        }

        if ($lesson->video != "") {
            if (File::exists(public_path('uploads/course/videos/' . $lesson->video))) {
                File::delete(public_path('uploads/course/videos/' . $lesson->video));
            }
        }

        $video = $request->video;
        $ext = $video->getClientOriginalExtension();
        $videoName = strtotime('now') . "-" . $id . "." . $ext;
        $video->move(public_path('uploads/course/videos'), $videoName);

        $lesson->video = $videoName;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Video has been Updated Successfully!'
        ], 200);
    }

    // This functions will sort lessons.
    public function sortLessons(Request $request)
    {
        if (!empty($request->lessons)) {
            foreach ($request->lessons as $key => $lesson) {
                Lesson::where('id', $lesson['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order Update Successfully!'
        ], 200);
    }
}
