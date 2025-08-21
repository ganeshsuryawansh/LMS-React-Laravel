<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\category;
use App\Models\course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\GD\Driver;

class CourseController extends Controller
{
    // This method will return all courses for specific user.
    public function index() {}

    // This method save course data as draft
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // This will Store course in DB.
        $course = new course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course has been created Successfully!'
        ]);
    }

    // Meta Data
    public function metaData()
    {
        $category = category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'category' => $category,
            'language' => $languages,
            'levels' => $levels
        ], 200);
    }

    public function show($id)
    {
        $course = course::with(['chapters', 'chapters.lessons'])->find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    // This method Update course data.
    public function update($id, Request $request)
    {
        $course = course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'description' => 'required',
            'sell_price' => 'required',
            'cross_price' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // This will Update course in DB.
        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->description = $request->description;
        $course->price = $request->sell_price;
        $course->cross_price = $request->cross_price;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course has been Updated Successfully!'
        ]);
    }

    public function saveCourseImage($id, Request $request)
    {
        $course = course::find($id);
        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => $validator->errors()
            ], 400);
        }

        if ($course->image != "") {
            if (File::exists(public_path('uploads/course/' . $course->image))) {
                File::delete(public_path('uploads/course/' . $course->image));
            }

            if (File::exists(public_path('uploads/course/small/' . $course->image))) {
                File::delete(public_path('uploads/course/small/' . $course->image));
            }
        }

        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now') . "-" . $id . "." . $ext;
        $image->move(public_path('uploads/course'), $imageName);

        // Create Small Thumbnail.
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/course/' . $imageName));

        $img->cover(750, 450);
        $img->save(public_path('uploads/course/small/' . $imageName));

        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course Image has been Updated Successfully!'
        ], 200);
    }

    public function changeStatus($id, Request $request)
    {
        $course = course::find($id);
        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $course->status = $request->status;
        $course->save();
        $message = $request->status == 1 ? 'Course has been Published Successfully!' : 'Course has been Unpublished Successfully!';

        return response()->json([
            'status' => 200,
            'message' => $message
        ], 200);
    }
}
