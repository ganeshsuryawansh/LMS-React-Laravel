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
}
