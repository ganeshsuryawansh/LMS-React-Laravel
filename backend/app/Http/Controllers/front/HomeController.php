<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\category;
use App\Models\course;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function fetchCategories()
    {
        $categories = category::orderBy('name', 'ASC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ], 200);
    }

    public function feturedCourses()
    {
        $courses = course::orderBy('title', 'ASC')
            ->with('level')
            ->where('is_featured', 'yes')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }

    public function courses(Request $request)
    {
        $courses = course::where('status', 1);

        // Filter Course by keyword.
        if (!empty($request->keyword)) {
            $courses = $courses->where('title', 'like', '%' . $request->keyword . '%');
        }

        // filter course by category.
        if (!empty($request->category)) {
            $categoryArray = explode(',', $request->category);
            if (!empty($categoryArray)) {
                $courses = $courses->whereIn('category_id', $categoryArray);
            }
        }

        // filter course by level.
        if (!empty($request->level)) {
            $levelArray = explode(',', $request->level);
            if (!empty($levelArray)) {
                $courses = $courses->whereIn('level_id', $levelArray);
            }
        }

        // filter courses by language.
        if (!empty($request->language)) {
            $languageArray = explode(',', $request->language);

            if (!empty($languageArray)) {
                $courses = $courses->whereIn('language_id', $languageArray);
            }
        }

        // sort courses.
        if (!empty($request->sort)) {
            $sortArr = ['asc', 'desc'];

            if (in_array($request->sort, $sortArr)) {
                $courses = $courses->orderBy('created_at', $request->sort);
            } else {
                $courses = $courses->orderBy('created_at', 'DESC');
            }
        }

        $courses = $courses->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }
}
