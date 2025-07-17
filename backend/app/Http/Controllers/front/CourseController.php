<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\category;
use App\Models\course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    // This method will return all courses for specific user
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
        $course = course::find($id);

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
}
